"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  AlertCircle,
  FileText,
  Trash2,
  CheckCircle,
  X,
  File,
  FileImage,
  FileSpreadsheet,
  FileCode,
  RefreshCw,
  MoreVertical,
  FolderOpen,
  Languages,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getKnowledgeDocuments,
  retryDocument,
  uploadDocument,
  deleteDocument as deleteDocumentAction,
} from "@/actions/knowledge";

import { triggerKnowledgeDocumentWebhook } from "@/utils/webhooks";

interface Document {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  language: string;
  status: "pending" | "processing" | "processed" | "failed";
  created_at: string;
  updated_at: string;
  chunk_count: number;
  error_message?: string;
}

const SUPPORTED_FORMATS = [
  ".pdf",
  ".txt",
  ".doc",
  ".docx",
  ".md",
  ".csv",
  ".json",
  ".html",
  ".htm",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DocumentsManager() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [language, setLanguage] = useState("en");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchDocumentsData();
  }, []);

  const fetchDocumentsData = async () => {
    try {
      setLoading(true);
      const result = (await getKnowledgeDocuments()) as any;

      if (result && result.success === false) {
        throw new Error(result.error || "Failed to fetch documents");
      }

      const data =
        result && result.data
          ? result.data
          : Array.isArray(result)
          ? result
          : [];
      const uploadDocs = (data as any[]).filter(
        (doc: any) => doc.source_type === "upload"
      );

      const docList = uploadDocs.map((doc) => ({
        id: doc.id,
        file_name: doc.title,
        file_size: doc.file_size || 0,
        file_type: doc.file_type || "application/octet-stream",
        language: doc.language || "en",
        status: doc.status,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        chunk_count: doc.chunk_count || 0,
        error_message: doc.error_message,
      }));

      setDocuments(docList);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error("No files selected");
      return;
    }

    setUploading(true);
    setError(null);
    const loadingId = toast.loading(`Uploading ${files.length} file(s)...`);

    try {
      for (const file of files) {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);

        const result = await uploadDocument(formData);

        if (!result.success) {
          throw new Error(`Failed to upload ${file.name}: ${result.error}`);
        }

        if (result.data) {
          await triggerKnowledgeDocumentWebhook(
            result.data.business_id,
            String(result.data.id),
            result.data.file_path
          );
        }

        const newDoc: Document = {
          id: String(result.data?.id ?? ""),
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || "application/octet-stream",
          language: language,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          chunk_count: 0,
        };

        setDocuments((prev) => [newDoc, ...prev]);
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }

      setFiles([]);
      toast.dismiss(loadingId);
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (err: any) {
      toast.dismiss(loadingId);
      setError(err.message);
      toast.error("Upload failed", { description: err.message });
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const result = await deleteDocumentAction(documentId);
      if (!result || result.success === false) {
        throw new Error(result?.error || "Failed to delete document");
      }
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      toast.success("Document deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete document", { description: err.message });
    }
  };

  const retryProcessing = async (documentId: string) => {
    try {
      const result = await retryDocument(documentId);
      if (!result.success) throw new Error(result.error);

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, status: "pending" } : doc
        )
      );
      toast.info("Reprocessing document...");
    } catch (err: any) {
      toast.error("Failed to retry processing", { description: err.message });
    }
  };

  const validateAndAddFiles = (fileList: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileList.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds 10MB limit`);
        return;
      }
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      if (!SUPPORTED_FORMATS.includes(fileExt)) {
        errors.push(`${file.name} has unsupported format`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      toast.warning("Some files were skipped", {
        description: errors.join(", "),
      });
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const selectedFiles = Array.from(event.target.files);
    validateAndAddFiles(selectedFiles);
    event.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndAddFiles(droppedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <File className="h-4 w-4" />;
    if (fileType.includes("image")) return <FileImage className="h-4 w-4" />;
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return <FileSpreadsheet className="h-4 w-4" />;
    if (fileType.includes("document") || fileType.includes("word"))
      return <FileText className="h-4 w-4" />;
    return <FileCode className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const statusBadge = (status: string) => {
    const styles = {
      processed: "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200",
      processing: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200",
      pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 border-yellow-200",
      failed: "bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200",
    };
    const labels = {
      processed: "Active",
      processing: "Processing",
      pending: "Pending",
      failed: "Failed",
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${styles[status as keyof typeof styles] || styles.pending} font-normal text-xs`}
      >
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  const processedCount = documents.filter(doc => doc.status === "processed").length;
  const totalCount = documents.length;

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Knowledge Documents
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              Upload documents to train your AI receptionist with business knowledge
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Card */}
      <Card className=" shadow-lg">
        <CardHeader className="">
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            Upload Documents
          </CardTitle>
          {/* <CardDescription className="text-base pt-1">
            Upload PDF, DOCX, TXT, and other supported formats. Maximum file size is 10MB.
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-0">
          {/* Drag and Drop Upload Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
              ${isDragging 
                ? "border-primary bg-primary/10 scale-[1.01] shadow-lg ring-2 ring-primary/20" 
                : "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
              }
            `}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileSelect}
              accept={SUPPORTED_FORMATS.join(",")}
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center p-8 text-center">
              {/* Upload Icon */}
              <div className={`
                mb-4 transition-all duration-300
                ${isDragging ? "scale-110" : ""}
              `}>
                <div className={`
                  h-16 w-16 rounded-xl flex items-center justify-center
                  ${isDragging 
                    ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20" 
                    : "bg-primary/20 text-primary"
                  }
                  transition-all duration-300
                `}>
                  <Upload className={`h-7 w-7 ${isDragging ? "animate-bounce" : ""}`} />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold">
                  {isDragging ? "Drop files here" : "Drag and drop files here"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  or <span className="text-primary font-medium underline decoration-2 underline-offset-2">click to browse</span>
                </p>
              </div>

              {/* Supported Formats */}
              <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Supported:</span> PDF, DOCX, TXT, MD, CSV, JSON, HTML, XLS, PPT
                </p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Max size:</span> 10MB
                </p>
              </div>

              {/* Drag Over Overlay */}
              {isDragging && (
                <div className="absolute inset-0 bg-primary/5 rounded-xl flex items-center justify-center pointer-events-none">
                  <div className="bg-primary/10 backdrop-blur-sm rounded-lg px-5 py-2.5 border-2 border-primary/30 shadow-lg">
                    <p className="text-primary font-semibold text-sm">Drop files to upload</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Language and Upload Controls */}
          {files.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="space-y-1.5 w-full sm:w-48">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Document Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1" />
              <Button
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  uploadFiles();
                }}
                disabled={uploading}
                className="min-w-[160px] shadow-md hover:shadow-lg transition-shadow"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {files.length} {files.length === 1 ? 'file' : 'files'}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">
                  Selected Files ({files.length})
                </Label>
              </div>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="shrink-0 text-primary">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Table Card */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                Documents Library
              </CardTitle>
              <CardDescription className="text-base pt-1">
                Manage your uploaded documents and track their processing status
              </CardDescription>
            </div>
            {totalCount > 0 && (
              <Badge variant="outline" className="text-sm">
                {processedCount} / {totalCount} Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30">
                  <TableHead className="font-semibold">Document</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Size</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 text-primary">
                            {getFileIcon(doc.file_type || "")}
                          </div>
                          <span 
                            className="truncate max-w-[200px] sm:max-w-xs" 
                            title={doc.file_name}
                          >
                            {doc.file_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-normal">
                          {doc.file_type?.split("/").pop()?.toUpperCase() || "FILE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatFileSize(doc.file_size)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {statusBadge(doc.status)}
                          {doc.error_message && (
                            <p className="text-xs text-red-600 max-w-[150px] truncate" title={doc.error_message}>
                              {doc.error_message}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {doc.status === "failed" && (
                              <DropdownMenuItem onClick={() => retryProcessing(doc.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retry Processing
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => deleteDocument(doc.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center gap-3 py-8">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <FolderOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            No documents uploaded yet
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload your first document to get started
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
