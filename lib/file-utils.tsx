import {
  FileText,
  File,
  FileSpreadsheet,
  FileCode,
  FileImage,
  FileJson,
} from "lucide-react";

// CHANGED: New utility functions for file handling
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function getFileIcon(fileType: string) {
  if (fileType.includes("pdf")) {
    return <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />;
  }
  if (
    fileType.includes("spreadsheet") ||
    fileType.includes("sheet") ||
    fileType.includes("csv")
  ) {
    return (
      <FileSpreadsheet className="h-4 w-4 text-green-600 dark:text-green-400" />
    );
  }
  if (fileType.includes("json")) {
    return <FileJson className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
  }
  if (fileType.includes("text") || fileType.includes("plain")) {
    return <FileCode className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
  }
  if (fileType.includes("image")) {
    return (
      <FileImage className="h-4 w-4 text-purple-600 dark:text-purple-400" />
    );
  }
  return <File className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
}

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toUpperCase() || "FILE";
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
