"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  AlertCircle,
  FileText,
  Trash2,
  CheckCircle,
  X,
  Eye,
  Download,
  FileUp,
  FileImage,
  FileSpreadsheet,
  FileCode,
  File,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

export default function DocumentsForm() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const supabase = createClient();
  const { toast } = useToast();

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      file_name: "menu.pdf",
      file_size: 1024000,
      file_type: "application/pdf",
      language: "en",
      status: "processed",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      chunk_count: 15,
    },
  ]);

  const [language, setLanguage] = useState("en");

  useEffect(() => {
    fetchDocumentsData();
  }, []);

  //   const fetchDocumentsData = async () => {
  //     try {
  //       setLoading(true);

  //       const { data: { user } } = await supabase.auth.getUser();
  //       if (!user) throw new Error("No user found");

  //       const { data: userData } = await supabase
  //         .from("users")
  //         .select("business_id")
  //         .eq("id", user.id)
  //         .single();

  //       if (!userData?.business_id) throw new Error("No business found");
  //       setBusinessId(userData.business_id);

  //       // Fetch document records
  //       const { data: docs, error: docsError } = await supabase
  //         .from("knowledge_base_documents")
  //         .select("*")
  //         .eq("business_id", userData.business_id)
  //         .eq("source_type", "upload")
  //         .order("created_at", { ascending: false });

  //       if (docsError) throw docsError;

  //       // Transform to document format
  //       const docList: Document[] = docs?.map(doc => ({
  //         id: doc.id,
  //         file_name: doc.title,
  //         file_size: doc.file_size || 0,
  //         file_type: doc.file_type || "application/octet-stream",
  //         language: doc.language || "en",
  //         status: doc.status as any,
  //         created_at: doc.created_at,
  //         updated_at: doc.updated_at,
  //         chunk_count: 0, // You'd need to count chunks for this document
  //         error_message: doc.error_message,
  //       })) || [];

  //       setDocuments(docList);

  //     } catch (err: any) {
  //       setError(err.message);
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const fetchDocumentsData = async () => {
    try {
      setLoading(true);

      const result = (await getKnowledgeDocuments()) as any;

      // If the action returns an object with a success flag, handle errors
      if (result && result.success === false) {
        throw new Error(result.error || "Failed to fetch documents");
      }

      // Guard against different return shapes: { success, data } or an array directly
      const data =
        result && result.data
          ? result.data
          : Array.isArray(result)
          ? result
          : [];
      const uploadDocs = (data as any[]).filter(
        (doc: any) => doc.source_type === "upload"
      );

      // Transform to document format
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
      toast({
        title: "Error",
        description: "No files selected",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setError(null);

    try {
      for (const file of files) {
        // Start upload progress
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

        // Create FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);

        // Upload using server action
        const result = await uploadDocument(formData);

        if (!result.success) {
          throw new Error(`Failed to upload ${file.name}: ${result.error}`);
        }

        // Trigger webhook for processing
        if (result.data && businessId) {
          await triggerKnowledgeDocumentWebhook(
            businessId,
            String(result.data.id),
            result.data.file_path
          );
        }

        // Add to local state
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

        // Clear upload progress
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }

      // Clear selected files
      setFiles([]);

      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
        variant: "default",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this document? All associated chunks will be removed."
      )
    ) {
      return;
    }

    try {
      const result = await deleteDocumentAction(documentId);

      if (!result || result.success === false) {
        throw new Error(result?.error || "Failed to delete document");
      }

      // Remove from local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));

      toast({
        title: "Success",
        description: "Document deleted successfully",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const retryProcessing = async (documentId: string) => {
    try {
      const result = await retryDocument(documentId);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, status: "pending" } : doc
        )
      );

      toast({
        title: "Success",
        description: "Document reprocessing initiated",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    selectedFiles.forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds 10MB limit`);
        return;
      }

      // Check file extension
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      if (!SUPPORTED_FORMATS.includes(fileExt)) {
        errors.push(`${file.name} has unsupported format`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      toast({
        title: "Warning",
        description: errors.join(", "),
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }

    // Reset input
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <File className="h-5 w-5" />;
    if (fileType.includes("image")) return <FileImage className="h-5 w-5" />;
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return <FileSpreadsheet className="h-5 w-5" />;
    if (fileType.includes("document") || fileType.includes("word"))
      return <FileText className="h-5 w-5" />;
    return <FileCode className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  //   const uploadFiles = async () => {
  //     if (files.length === 0) {
  //       toast({
  //         title: "Error",
  //         description: "No files selected",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     setUploading(true);
  //     setError(null);

  //     try {
  //       for (const file of files) {
  //         const fileName = `${businessId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  //         // Start upload progress
  //         setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

  //         // Upload to Supabase Storage
  //         const { error: uploadError } = await supabase.storage
  //           .from("knowledge_files")
  //           .upload(fileName, file, {
  //             onUploadProgress: (progress) => {
  //               const percent = Math.round((progress.loaded / progress.total) * 100);
  //               setUploadProgress(prev => ({ ...prev, [file.name]: percent }));
  //             },
  //           });

  //         if (uploadError) {
  //           throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
  //         }

  //         // Create document record
  //         const { data: doc, error: docError } = await supabase
  //           .from("knowledge_base_documents")
  //           .insert({
  //             business_id: businessId,
  //             title: file.name,
  //             source_type: "upload",
  //             file_path: fileName,
  //             file_name: file.name,
  //             file_size: file.size,
  //             file_type: file.type,
  //             language: language,
  //             status: "pending",
  //           })
  //           .select()
  //           .single();

  //         if (docError) {
  //           // Clean up uploaded file if database insert fails
  //           await supabase.storage.from("knowledge_files").remove([fileName]);
  //           throw new Error(`Failed to create record for ${file.name}: ${docError.message}`);
  //         }

  //         // Trigger webhook for processing
  //         const webhookResponse = await fetch('https://your-webhook-url.com/process-document', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({
  //             businessId,
  //             documentId: doc.id,
  //             filePath: fileName,
  //             language: language,
  //           }),
  //         });

  //         if (!webhookResponse.ok) {
  //           throw new Error(`Failed to trigger processing for ${file.name}`);
  //         }

  //         // Add to local state
  //         const newDoc: Document = {
  //           id: doc.id,
  //           file_name: file.name,
  //           file_size: file.size,
  //           file_type: file.type,
  //           language: language,
  //           status: "pending",
  //           created_at: new Date().toISOString(),
  //           updated_at: new Date().toISOString(),
  //           chunk_count: 0,
  //         };

  //         setDocuments(prev => [newDoc, ...prev]);

  //         // Clear upload progress
  //         setUploadProgress(prev => {
  //           const newProgress = { ...prev };
  //           delete newProgress[file.name];
  //           return newProgress;
  //         });
  //       }

  //       // Clear selected files
  //       setFiles([]);

  //       toast({
  //         title: "Success",
  //         description: `${files.length} file(s) uploaded successfully`,
  //         variant: "default",
  //       });

  //     } catch (err: any) {
  //       setError(err.message);
  //       toast({
  //         title: "Error",
  //         description: err.message,
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setUploading(false);
  //     }
  //   };

  //   const deleteDocument = async (documentId: string, filePath?: string) => {
  //     if (!confirm("Are you sure you want to delete this document? All associated chunks will be removed.")) {
  //       return;
  //     }

  //     try {
  //       // Delete from database
  //       const { error } = await supabase
  //         .from("knowledge_base_documents")
  //         .delete()
  //         .eq("id", documentId)
  //         .eq("business_id", businessId);

  //       if (error) throw error;

  //       // Delete from storage if file path exists
  //       if (filePath) {
  //         await supabase.storage
  //           .from("knowledge_files")
  //           .remove([filePath]);
  //       }

  //       // Delete associated chunks
  //       await supabase
  //         .from("knowledge_base_chunks")
  //         .delete()
  //         .eq("document_id", documentId);

  //       // Remove from local state
  //       setDocuments(prev => prev.filter(doc => doc.id !== documentId));

  //       toast({
  //         title: "Success",
  //         description: "Document deleted successfully",
  //         variant: "default",
  //       });

  //     } catch (err: any) {
  //       toast({
  //         title: "Error",
  //         description: err.message,
  //         variant: "destructive",
  //       });
  //     }
  //   };

  //   const retryProcessing = async (documentId: string) => {
  //     try {
  //       // Update status to pending
  //       setDocuments(prev =>
  //         prev.map(doc =>
  //           doc.id === documentId ? { ...doc, status: "pending" } : doc
  //         )
  //       );

  //       // Trigger webhook for reprocessing
  //       await fetch('https://your-webhook-url.com/retry-document', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           businessId,
  //           documentId,
  //         }),
  //       });

  //       toast({
  //         title: "Success",
  //         description: "Document reprocessing initiated",
  //         variant: "default",
  //       });

  //     } catch (err: any) {
  //       toast({
  //         title: "Error",
  //         description: err.message,
  //         variant: "destructive",
  //       });
  //     }
  //   };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Upload Area */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5" />
              Upload Documents
            </CardTitle>
            <CardDescription>
              Upload PDFs, Word documents, text files, and more (Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Drop Zone */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
              <Input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileSelect}
                accept={SUPPORTED_FORMATS.join(",")}
                className="hidden"
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer flex w-full"
              >
                <div className="space-y-2 mx-auto">
                  <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Click to browse or drag files here
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-3">
                <Label>Selected Files ({files.length})</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {uploadProgress[file.name] !== undefined && (
                          <Progress
                            value={uploadProgress[file.name]}
                            className="w-24"
                          />
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Language Selection and Upload Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  <div className="w-full sm:w-auto">
                    <Label htmlFor="documentLanguage">Document Language</Label>
                    <select
                      id="documentLanguage"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full sm:w-48 px-3 py-2 border rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                    </select>
                  </div>
                  <Button
                    onClick={uploadFiles}
                    disabled={uploading || files.length === 0}
                    className="w-full sm:w-auto"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload {files.length} File
                        {files.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Documents ({documents.length})
            </CardTitle>
            <CardDescription>
              Manage and monitor your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-lg">
                            {doc.file_name}
                          </h4>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                          {doc.chunk_count > 0 && (
                            <Badge variant="outline">
                              {doc.chunk_count} chunks
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>{doc.file_type}</span>
                          <span>•</span>
                          <span>{doc.language.toUpperCase()}</span>
                          <span>•</span>
                          <span>
                            Uploaded{" "}
                            {new Date(doc.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {doc.status === "failed" && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => retryProcessing(doc.id)}
                          >
                            Retry
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {doc.status === "processing" && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Processing document...
                        </span>
                      </div>
                    )}

                    {doc.status === "failed" && doc.error_message && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-sm text-red-800">
                          {doc.error_message}
                        </p>
                      </div>
                    )}

                    {doc.status === "processed" && doc.chunk_count > 0 && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>
                          Successfully processed into {doc.chunk_count}{" "}
                          knowledge chunks
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No documents uploaded yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Upload documents to help your AI receptionist learn from your
                  content
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supported Formats */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Supported Formats</CardTitle>
            <CardDescription>
              File types you can upload for processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SUPPORTED_FORMATS.map((format) => (
                <div
                  key={format}
                  className="flex items-center gap-2 p-3 border rounded-lg"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {format.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
