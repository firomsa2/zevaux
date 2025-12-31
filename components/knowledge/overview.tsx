"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
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
  Files,
  Globe,
  MessageSquare,
  Upload,
  FileText,
  BarChart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getKnowledgeStats } from "@/actions/knowledge";

interface DocumentStats {
  total: number;
  byType: {
    faq: number;
    website: number;
    document: number;
  };
  byStatus: {
    pending: number;
    processing: number;
    processed: number;
    failed: number;
  };
  totalChunks: number;
  lastUpdated: string | null;
}

export default function KnowledgeOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [stats, setStats] = useState<DocumentStats>({
    total: 0,
    byType: { faq: 0, website: 0, document: 0 },
    byStatus: { pending: 0, processing: 0, processed: 0, failed: 0 },
    totalChunks: 0,
    lastUpdated: null,
  });
  //   const supabase = createClient();

  useEffect(() => {
    fetchKnowledgeData();
  }, []);

  //   const fetchKnowledgeData = async () => {
  //     try {
  //       setLoading(true);

  //       const {
  //         data: { user },
  //       } = await supabase.auth.getUser();
  //       if (!user) throw new Error("No user found");

  //       const { data: userData } = await supabase
  //         .from("users")
  //         .select("business_id")
  //         .eq("id", user.id)
  //         .single();

  //       if (!userData?.business_id) throw new Error("No business found");
  //       setBusinessId(userData.business_id);

  //       // Fetch documents
  //       const { data: documents, error: docsError } = await supabase
  //         .from("knowledge_base_documents")
  //         .select("*")
  //         .eq("business_id", userData.business_id);

  //       if (docsError) throw docsError;

  //       // Fetch chunks
  //       const { data: chunks, error: chunksError } = await supabase
  //         .from("knowledge_base_chunks")
  //         .select("id")
  //         .eq("business_id", userData.business_id);

  //       if (chunksError) throw chunksError;

  //       // Calculate stats
  //       const newStats: DocumentStats = {
  //         total: documents?.length || 0,
  //         byType: {
  //           faq: documents?.filter((d) => d.source_type === "manual").length || 0,
  //           website:
  //             documents?.filter((d) => d.source_type === "url").length || 0,
  //           document:
  //             documents?.filter((d) => d.source_type === "upload").length || 0,
  //         },
  //         byStatus: {
  //           pending: documents?.filter((d) => d.status === "pending").length || 0,
  //           processing:
  //             documents?.filter((d) => d.status === "processing").length || 0,
  //           processed:
  //             documents?.filter((d) => d.status === "processed").length || 0,
  //           failed: documents?.filter((d) => d.status === "failed").length || 0,
  //         },
  //         totalChunks: chunks?.length || 0,
  //         lastUpdated:
  //           documents && documents.length > 0
  //             ? documents.reduce(
  //                 (latest, doc) =>
  //                   new Date(doc.updated_at) > new Date(latest)
  //                     ? doc.updated_at
  //                     : latest,
  //                 documents[0].updated_at
  //               )
  //             : null,
  //       };

  //       setStats(newStats);
  //     } catch (err: any) {
  //       setError(err.message);
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const fetchKnowledgeData = async () => {
    try {
      setLoading(true);

      const result = await getKnowledgeStats();

      if (!result.success) {
        throw new Error(result.error);
      }

      setStats(result.data as DocumentStats);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Enhance your AI receptionist with business-specific knowledge
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/knowledge/documents">
            <Upload className=" h-4 w-4" />
            Upload Documents
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="pb-0 pt-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.total}</div>
              <Files className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.totalChunks} knowledge chunks
            </div>
          </CardContent>
        </Card>

        <div className="pb-2 pt-2">
          <div>
            <div className="text-sm font-medium text-muted-foreground ">
              Document Types
            </div>
          </div>
          <div className="pt-0">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">FAQs</span>
                </div>
                <span className="font-medium">{stats.byType.faq}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Website</span>
                </div>
                <span className="font-medium">{stats.byType.website}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Documents</span>
                </div>
                <span className="font-medium">{stats.byType.document}</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="pb-2 pt-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor("processed")}>Processed</Badge>
                <span className="font-medium">{stats.byStatus.processed}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor("processing")}>
                  Processing
                </Badge>
                <span className="font-medium">{stats.byStatus.processing}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor("pending")}>Pending</Badge>
                <span className="font-medium">{stats.byStatus.pending}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="pb-2 pt-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center">
              {stats.lastUpdated ? (
                <>
                  <div className="text-2xl font-bold">
                    {new Date(stats.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(stats.lastUpdated).toLocaleTimeString()}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">No documents yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {/* Total Documents */}
        <div className="rounded-lg border bg-background px-4 py-3 flex flex-col justify-center">
          <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
            Total Documents
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className="text-3xl font-bold">{stats.total}</span>
            <Files className="h-8 w-8 text-muted-foreground" />
          </div>

          <p className="mt-1 text-xs text-muted-foreground text-center">
            {stats.totalChunks} knowledge chunks
          </p>
        </div>

        {/* Document Types */}
        <div className="rounded-lg border bg-background px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Document Types
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                FAQs
              </div>
              <span className="font-medium">{stats.byType.faq}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                Website
              </div>
              <span className="font-medium">{stats.byType.website}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                Documents
              </div>
              <span className="font-medium">{stats.byType.document}</span>
            </div>
          </div>
        </div>

        {/* Processing Status */}
        <div className="rounded-lg border bg-background px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Processing Status
          </p>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor("processed")}>Processed</Badge>
              <span className="font-medium">{stats.byStatus.processed}</span>
            </div>

            <div className="flex items-center justify-between">
              <Badge className={getStatusColor("processing")}>Processing</Badge>
              <span className="font-medium">{stats.byStatus.processing}</span>
            </div>

            <div className="flex items-center justify-between">
              <Badge className={getStatusColor("pending")}>Pending</Badge>
              <span className="font-medium">{stats.byStatus.pending}</span>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="rounded-lg border bg-background px-4 py-3 flex flex-col justify-center text-center">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Last Updated
          </p>

          {stats.lastUpdated ? (
            <>
              <p className="text-2xl font-bold">
                {new Date(stats.lastUpdated).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(stats.lastUpdated).toLocaleTimeString()}
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">No documents yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              FAQs
            </CardTitle>
            <CardDescription>
              Create and manage frequently asked questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{stats.byType.faq} FAQs configured</span>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/knowledge/faqs">Manage FAQs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Website Content
            </CardTitle>
            <CardDescription>Import content from your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{stats.byType.website} websites imported</span>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/knowledge/website">Add Website</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
            <CardDescription>
              Upload PDFs, DOCs, and other documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{stats.byType.document} documents uploaded</span>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/knowledge/documents">
                Upload Documents
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div> */}

      {/* How It Works */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            How Knowledge Base Works
          </CardTitle>
          <CardDescription>
            Your AI receptionist uses this knowledge to answer questions
            accurately
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold">1</span>
              </div>
              <h4 className="font-medium">Upload</h4>
              <p className="text-sm text-muted-foreground">
                Add FAQs, website URLs, or documents
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold">2</span>
              </div>
              <h4 className="font-medium">Process</h4>
              <p className="text-sm text-muted-foreground">
                Webhook automatically chunks and stores content
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold">3</span>
              </div>
              <h4 className="font-medium">Retrieve</h4>
              <p className="text-sm text-muted-foreground">
                AI finds relevant snippets for each question
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold">4</span>
              </div>
              <h4 className="font-medium">Answer</h4>
              <p className="text-sm text-muted-foreground">
                AI uses knowledge to provide accurate answers
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
