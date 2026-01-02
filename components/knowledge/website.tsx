"use client";

import { useState, useEffect } from "react";
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
  Save,
  AlertCircle,
  Globe,
  Link,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  addWebsite,
  deleteDocument,
  getKnowledgeDocuments,
  retryDocument,
} from "@/actions/knowledge";

import { triggerKnowledgeWebsiteWebhook } from "@/utils/webhooks";

interface Website {
  id: string;
  url: string;
  title: string;
  language: string;
  status: "pending" | "processing" | "processed" | "failed";
  lastCrawled: string | null;
  pageCount: number;
  chunkCount: number;
}

export default function WebsiteForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const [websites, setWebsites] = useState<Website[]>([
    {
      id: "1",
      url: "https://example.com",
      title: "Example Website",
      language: "en",
      status: "processed",
      lastCrawled: new Date().toISOString(),
      pageCount: 12,
      chunkCount: 45,
    },
  ]);

  const [newWebsite, setNewWebsite] = useState({
    url: "",
    title: "",
    language: "en",
  });

  const [isValidUrl, setIsValidUrl] = useState(true);

  useEffect(() => {
    fetchWebsitesData();
  }, []);

  //   const fetchWebsitesData = async () => {
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

  //       // Fetch website documents
  //       const { data: websiteDocs, error: docsError } = await supabase
  //         .from("knowledge_base_documents")
  //         .select("*")
  //         .eq("business_id", userData.business_id)
  //         .eq("source_type", "url");

  //       if (docsError) throw docsError;

  //       // Transform to website format
  //       const websiteList: Website[] = websiteDocs?.map(doc => ({
  //         id: doc.id,
  //         url: doc.source_url || "",
  //         title: doc.title,
  //         language: doc.language || "en",
  //         status: doc.status as any,
  //         lastCrawled: doc.updated_at,
  //         pageCount: 0, // You'd need to calculate this from chunks
  //         chunkCount: 0, // You'd need to count chunks for this document
  //       })) || [];

  //       setWebsites(websiteList);

  //     } catch (err: any) {
  //       setError(err.message);
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const fetchWebsitesData = async () => {
    try {
      setLoading(true);

      const result = await getKnowledgeDocuments();
      console.log("🚀 ~ fetchWebsitesData ~ result:", result);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Filter for website documents
      const websiteDocs = (result.data || []).filter(
        (doc) => doc.source_type === "url"
      );

      // Transform to website format
      const websiteList = websiteDocs.map((doc) => ({
        id: doc.id,
        url: doc.source_url || "",
        title: doc.title,
        language: doc.language || "en",
        status: doc.status,
        lastCrawled: doc.updated_at,
        pageCount: doc.page_count || 0,
        chunkCount: doc.chunk_count || 0,
      }));

      setWebsites(websiteList);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addWebsites = async () => {
    if (!newWebsite.url || !isValidUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const result = await addWebsite({
        url: newWebsite.url,
        title: newWebsite.title,
        language: newWebsite.language,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Trigger webhook
      if (businessId) {
        await triggerKnowledgeWebsiteWebhook(businessId, newWebsite.url);
      }

      // Reset form
      setNewWebsite({
        url: "",
        title: "",
        language: "en",
      });

      // Refresh data
      await fetchWebsitesData();

      toast({
        title: "Success",
        description: "Website added and being processed",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const refreshWebsite = async (websiteId: string) => {
    try {
      const result = await retryDocument(websiteId);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local state
      setWebsites((prev) =>
        prev.map((w) =>
          w.id === websiteId ? { ...w, status: "processing" } : w
        )
      );

      toast({
        title: "Success",
        description: "Website refresh initiated",
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

  const removeWebsite = async (websiteId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this website? All associated content will be deleted."
      )
    ) {
      return;
    }

    try {
      const result = await deleteDocument(websiteId);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Remove from local state
      setWebsites((prev) => prev.filter((w) => w.id !== websiteId));

      toast({
        title: "Success",
        description: "Website removed successfully",
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
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const extractTitleFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      // Remove www. and .com/.org/etc
      return hostname
        .replace("www.", "")
        .split(".")[0]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } catch {
      return "Website";
    }
  };

  const handleUrlChange = (url: string) => {
    setNewWebsite((prev) => ({ ...prev, url }));
    const isValid = validateUrl(url);
    setIsValidUrl(isValid);

    if (isValid && !newWebsite.title) {
      setNewWebsite((prev) => ({
        ...prev,
        title: extractTitleFromUrl(url),
      }));
    }
  };

  const testWebsite = async () => {
    if (!newWebsite.url || !isValidUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    try {
      // Test if website is accessible
      const response = await fetch(
        `/api/test-website?url=${encodeURIComponent(newWebsite.url)}`
      );
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Website is accessible and ready to import",
          variant: "default",
        });
      } else {
        toast({
          title: "Warning",
          description: data.message || "Website might not be fully accessible",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not connect to website",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  //   const addWebsite = async () => {
  //     if (!newWebsite.url || !isValidUrl) {
  //       toast({
  //         title: "Error",
  //         description: "Please enter a valid URL",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     setSaving(true);
  //     try {
  //       // Save to knowledge_base_documents
  //       const { data, error } = await supabase
  //         .from("knowledge_base_documents")
  //         .insert({
  //           business_id: businessId,
  //           title: newWebsite.title,
  //           source_type: "url",
  //           source_url: newWebsite.url,
  //           language: newWebsite.language,
  //           status: "pending",
  //         })
  //         .select()
  //         .single();

  //       if (error) throw error;

  //       // Trigger webhook for crawling and chunking
  //       const webhookResponse = await fetch('https://your-webhook-url.com/crawl-website', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           businessId,
  //           documentId: data.id,
  //           url: newWebsite.url,
  //           language: newWebsite.language,
  //         }),
  //       });

  //       if (!webhookResponse.ok) {
  //         throw new Error('Failed to trigger webhook');
  //       }

  //       // Add to local state
  //       const newWebsiteData: Website = {
  //         id: data.id,
  //         url: newWebsite.url,
  //         title: newWebsite.title,
  //         language: newWebsite.language,
  //         status: "pending",
  //         lastCrawled: null,
  //         pageCount: 0,
  //         chunkCount: 0,
  //       };

  //       setWebsites(prev => [...prev, newWebsiteData]);

  //       // Reset form
  //       setNewWebsite({
  //         url: "",
  //         title: "",
  //         language: "en",
  //       });

  //       toast({
  //         title: "Success",
  //         description: "Website added and being processed",
  //         variant: "default",
  //       });

  //       // Refresh after a moment
  //       setTimeout(() => {
  //         fetchWebsitesData();
  //       }, 2000);

  //     } catch (err: any) {
  //       toast({
  //         title: "Error",
  //         description: err.message,
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setSaving(false);
  //     }
  //   };

  //   const refreshWebsite = async (websiteId: string) => {
  //     try {
  //       // Update status to processing
  //       setWebsites(prev =>
  //         prev.map(w =>
  //           w.id === websiteId ? { ...w, status: "processing" } : w
  //         )
  //       );

  //       // Trigger webhook for re-crawling
  //       await fetch('https://your-webhook-url.com/refresh-website', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           businessId,
  //           documentId: websiteId,
  //         }),
  //       });

  //       toast({
  //         title: "Success",
  //         description: "Website refresh initiated",
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

  //   const removeWebsite = async (websiteId: string) => {
  //     if (!confirm("Are you sure you want to remove this website? All associated content will be deleted.")) {
  //       return;
  //     }

  //     try {
  //       // Delete from database
  //       const { error } = await supabase
  //         .from("knowledge_base_documents")
  //         .delete()
  //         .eq("id", websiteId)
  //         .eq("business_id", businessId);

  //       if (error) throw error;

  //       // Also delete associated chunks
  //       await supabase
  //         .from("knowledge_base_chunks")
  //         .delete()
  //         .eq("document_id", websiteId);

  //       // Remove from local state
  //       setWebsites(prev => prev.filter(w => w.id !== websiteId));

  //       toast({
  //         title: "Success",
  //         description: "Website removed successfully",
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
        {/* Add Website Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5" />
              Add Website
            </CardTitle>
            <CardDescription>
              Enter your website URL to import content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={newWebsite.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.yourbusiness.com"
                    className={
                      !isValidUrl && newWebsite.url ? "border-red-500" : ""
                    }
                  />
                  {!isValidUrl && newWebsite.url && (
                    <p className="text-sm text-red-500 mt-1">
                      Please enter a valid URL (include http:// or https://)
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={testWebsite}
                  disabled={!newWebsite.url || !isValidUrl || testing}
                >
                  {testing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Test"
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="websiteTitle">Title</Label>
                <Input
                  id="websiteTitle"
                  value={newWebsite.title}
                  onChange={(e) =>
                    setNewWebsite((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="My Business Website"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="websiteLanguage">Language</Label>
                <select
                  id="websiteLanguage"
                  value={newWebsite.language}
                  onChange={(e) =>
                    setNewWebsite((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                </select>
              </div>
            </div>

            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">How it works</h4>
                  <ul className="text-sm text-blue-800 space-y-1 mt-1">
                    <li>
                      • Our system crawls your website and extracts text content
                    </li>
                    <li>• Content is automatically chunked and processed</li>
                    <li>
                      • AI uses this content to answer questions about your
                      business
                    </li>
                    <li>• Processing typically takes 5-10 minutes</li>
                  </ul>
                </div>
              </div>
            </div> */}

            <div className="flex justify-end">
              <Button
                onClick={addWebsites}
                disabled={!newWebsite.url || !isValidUrl || saving}
                className="w-full md:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Website"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Websites List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link className="h-5 w-5" />
              Imported Websites ({websites.length})
            </CardTitle>
            <CardDescription>
              Manage and monitor your imported websites
            </CardDescription>
          </CardHeader>
          <CardContent>
            {websites.length > 0 ? (
              <div className="space-y-4">
                {websites.map((website) => (
                  <div
                    key={website.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-lg">
                            {website.title}
                          </h4>
                          <Badge className={getStatusColor(website.status)}>
                            {website.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary hover:underline flex items-center gap-1"
                          >
                            {website.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => refreshWebsite(website.id)}
                          disabled={website.status === "processing"}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWebsite(website.id)}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Status</Label>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              website.status === "processed"
                                ? "bg-green-500"
                                : website.status === "processing"
                                ? "bg-blue-500"
                                : website.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm capitalize">
                            {website.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Language</Label>
                        <div className="text-sm">
                          {website.language.toUpperCase()}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Last Crawled</Label>
                        <div className="text-sm">
                          {website.lastCrawled
                            ? new Date(website.lastCrawled).toLocaleDateString()
                            : "Never"}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Content</Label>
                        <div className="text-sm">
                          {website.pageCount} pages, {website.chunkCount} chunks
                        </div>
                      </div>
                    </div>

                    {website.status === "failed" && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-sm text-red-800">
                          Failed to process website. Please check the URL and
                          try again.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No websites imported yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add your website to help your AI receptionist learn about your
                  business
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Tips for Best Results</CardTitle>
            <CardDescription>
              How to get the most out of website importing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Recommended Content</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• About Us page</li>
                  <li>• Services/Products pages</li>
                  <li>• FAQ page</li>
                  <li>• Contact information</li>
                  <li>• Pricing pages</li>
                  <li>• Testimonials/Reviews</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ensure your website is publicly accessible</li>
                  <li>• Use clear, concise language</li>
                  <li>• Keep information up to date</li>
                  <li>• Include detailed service descriptions</li>
                  <li>• Add structured FAQ pages</li>
                  <li>• Refresh content after major updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
