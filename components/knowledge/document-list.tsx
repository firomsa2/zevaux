"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Trash2,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatBytes, getFileIcon } from "@/lib/file-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteDocument as deleteDocumentAction,
  retryDocument,
} from "@/actions/knowledge";

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

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

// CHANGED: Enhanced document list with better filtering and actions
export function DocumentList({
  documents,
  isLoading = false,
  onRefresh,
}: DocumentListProps) {
  const [sortBy, setSortBy] = useState<"date" | "name" | "size" | "status">(
    "date"
  );
  const [filterStatus, setFilterStatus] = useState<"all" | Document["status"]>(
    "all"
  );

  const filteredDocuments = documents.filter(
    (doc) => filterStatus === "all" || doc.status === filterStatus
  );

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.file_name.localeCompare(b.file_name);
      case "size":
        return b.file_size - a.file_size;
      case "status":
        return a.status.localeCompare(b.status);
      default: // date
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-200";
    }
  };

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "processed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (documents.length === 0) {
    return (
      <Card className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
        <p className="text-slate-600 dark:text-slate-400">
          No documents uploaded yet
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
          Upload documents to enhance your AI receptionist
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* CHANGED: Enhanced toolbar with filters and sorting */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "All", value: "all" },
            { label: "Processed", value: "processed" },
            { label: "Processing", value: "processing" },
            { label: "Pending", value: "pending" },
            { label: "Failed", value: "failed" },
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={filterStatus === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(filter.value as any)}
              className="bg-transparent"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="size">Sort by Size</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Document table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Chunks</TableHead>
              <TableHead>Language</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDocuments.map((doc) => (
              <TableRow
                key={doc.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getFileIcon(doc.file_type)}
                    <span className="truncate max-w-xs">{doc.file_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                  {formatBytes(doc.file_size)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {doc.status === "processed" ? (
                    <span className="text-sm font-medium text-green-600">
                      {doc.chunk_count} chunks
                    </span>
                  ) : (
                    <span className="text-sm text-slate-500">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm uppercase">
                  {doc.language}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {doc.status === "failed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => retryDocument(doc.id)}
                      className="gap-1 h-8"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Retry
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDocumentAction(doc.id)}
                    className="gap-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <p className="text-sm text-slate-500 dark:text-slate-500">
        Showing {sortedDocuments.length} of {documents.length} documents
      </p>
    </div>
  );
}
