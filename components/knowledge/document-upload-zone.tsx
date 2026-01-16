"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Cloud, Upload, type File, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface DocumentUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
  maxSize?: number;
  acceptedFormats?: string[];
}

// CHANGED: New drag-and-drop component with visual feedback
export function DocumentUploadZone({
  onFilesSelected,
  isUploading = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedFormats = [
    ".pdf",
    ".txt",
    ".doc",
    ".docx",
    ".md",
    ".csv",
    ".json",
    ".html",
    ".xls",
    ".xlsx",
  ],
}: DocumentUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (filesToValidate: FileList | File[]) => {
    const fileArray = Array.from(filesToValidate);
    const errors: string[] = [];

    for (const file of fileArray) {
      // Check file extension
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        errors.push(
          `${file.name}: Unsupported format. Allowed: ${acceptedFormats.join(
            ", "
          )}`
        );
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(
          `${file.name}: File exceeds ${maxSize / 1024 / 1024}MB limit`
        );
      }
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return false;
    }

    setError(null);
    return true;
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (isUploading) return;

      const droppedFiles = e.dataTransfer.files;
      if (validateFiles(droppedFiles)) {
        onFilesSelected(Array.from(droppedFiles));
      }
    },
    [isUploading, onFilesSelected]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && validateFiles(e.target.files)) {
        onFilesSelected(Array.from(e.target.files));
      }
    },
    [onFilesSelected]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer p-12 text-center",
          isDragActive
            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]"
            : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50 dark:bg-slate-900/50",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* CHANGED: Enhanced visual feedback with icon animation */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          disabled={isUploading}
          className="hidden"
          accept={acceptedFormats.join(",")}
        />

        <div
          className={cn("transition-transform", isDragActive && "scale-110")}
        >
          {isDragActive ? (
            <Cloud className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-bounce" />
          ) : (
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
          )}
        </div>

        <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {isDragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          or click to browse from your computer
        </p>

        <div className="text-xs text-slate-500 dark:text-slate-500 space-y-1">
          <p>Supported formats: {acceptedFormats.join(", ")}</p>
          <p>Maximum file size: {maxSize / 1024 / 1024}MB</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
