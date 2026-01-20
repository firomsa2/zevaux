"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  Trash2,
  MessageSquare,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { addFAQ, getKnowledgeDocuments } from "@/actions/knowledge";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  language: string;
  priority: number;
  tags: string[];
}

const FAQ_CATEGORIES = [
  "General",
  "Pricing",
  "Services",
  "Booking",
  "Cancellation",
  "Hours",
  "Location",
  "Contact",
  "Technical",
  "Other",
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
];

export default function FAQsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const supabase = createClient();

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "What are your business hours?",
      answer:
        "We're open Monday to Friday from 9 AM to 6 PM, and Saturday from 10 AM to 4 PM.",
      category: "Hours",
      language: "en",
      priority: 1,
      tags: ["hours", "schedule"],
    },
  ]);

  const [newFAQ, setNewFAQ] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
    category: "General",
    language: "en",
    priority: 1,
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchFAQsData();
  }, []);

  //   const fetchFAQsData = async () => {
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

  //       // In real implementation, fetch from database
  //       // For now, we'll use mock data
  //       await loadFAQsFromStorage();

  //     } catch (err: any) {
  //       setError(err.message);
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const loadFAQsFromStorage = async () => {
  //     // Check localStorage for saved FAQs
  //     const savedFAQs = localStorage.getItem(`faqs_${businessId}`);
  //     if (savedFAQs) {
  //       setFaqs(JSON.parse(savedFAQs));
  //     }
  //   };

  const saveFAQsToStorage = async (faqsList: FAQ[]) => {
    if (businessId) {
      localStorage.setItem(`faqs_${businessId}`, JSON.stringify(faqsList));

      // In a real implementation, you would save to Supabase
      // and trigger the webhook for chunking
      try {
        // Save to knowledge_base_documents as manual entry
        const { error } = await supabase
          .from("knowledge_base_documents")
          .insert({
            business_id: businessId,
            title: "FAQs",
            source_type: "manual",
            language: "en", // Default language for FAQ collection
            status: "pending",
          });

        if (error) throw error;

        // Trigger webhook for chunking
        await fetch("https://your-webhook-url.com/process-faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessId,
            faqs: faqsList,
          }),
        });
      } catch (err) {
        console.error("Error saving FAQs:", err);
      }
    }
  };
  const fetchFAQsData = async () => {
    try {
      setLoading(true);

      const result = await getKnowledgeDocuments();
      console.log(
        "🚀 ~ fetchFAQsData ~ getKnowledgeDocuments:",
        getKnowledgeDocuments
      );
      console.log("🚀 ~ fetchFAQsData ~ result:", result);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Filter for FAQ documents
      const faqDocs = (
        result && result.data
          ? result.data
          : Array.isArray(result)
          ? result
          : []
      ).filter((doc) => doc.source_type === "manual");

      // Transform to FAQ format
      const faqList = faqDocs.flatMap((doc) =>
        (doc.metadata?.faqs || []).map((faq: any, index: number) => ({
          id: `${doc.id}-${index}`,
          ...faq,
        }))
      );

      setFaqs(faqList);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //   const addFAQ = () => {
  //     if (!newFAQ.question?.trim() || !newFAQ.answer?.trim()) {
  //       toast({
  //         title: "Error",
  //         description: "Question and answer are required",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     const newFAQData: FAQ = {
  //       id: Date.now().toString(),
  //       question: newFAQ.question!,
  //       answer: newFAQ.answer!,
  //       category: newFAQ.category || "General",
  //       language: newFAQ.language || "en",
  //       priority: newFAQ.priority || 1,
  //       tags: newFAQ.tags || [],
  //     };

  //     const updatedFAQs = [...faqs, newFAQData];
  //     setFaqs(updatedFAQs);

  //     // Save to storage
  //     saveFAQsToStorage(updatedFAQs);

  //     // Reset form
  //     setNewFAQ({
  //       question: "",
  //       answer: "",
  //       category: "General",
  //       language: "en",
  //       priority: 1,
  //       tags: [],
  //     });

  //     toast({
  //       title: "Success",
  //       description: "FAQ added successfully",
  //       variant: "default",
  //     });
  //   };
  const addFAQs = async () => {
    if (!newFAQ.question?.trim() || !newFAQ.answer?.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    setSaving(true);

    try {
      const result = await addFAQ({
        question: newFAQ.question!,
        answer: newFAQ.answer!,
        category: newFAQ.category || "General",
        language: newFAQ.language || "en",
        priority: newFAQ.priority || 1,
        tags: newFAQ.tags || [],
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Reset form
      setNewFAQ({
        question: "",
        answer: "",
        category: "General",
        language: "en",
        priority: 1,
        tags: [],
      });

      // Refresh data
      await fetchFAQsData();

      toast.success("FAQ added successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateFAQ = (id: string, field: keyof FAQ, value: any) => {
    const updatedFAQs = faqs.map((faq) =>
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    setFaqs(updatedFAQs);
    saveFAQsToStorage(updatedFAQs);
  };

  const removeFAQ = (id: string) => {
    const updatedFAQs = faqs.filter((faq) => faq.id !== id);
    setFaqs(updatedFAQs);
    saveFAQsToStorage(updatedFAQs);
    toast.success("FAQ removed");
  };

  const addTag = () => {
    if (newTag.trim() && !newFAQ.tags?.includes(newTag.trim())) {
      setNewFAQ((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewFAQ((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  // Filter FAQs
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...FAQ_CATEGORIES];

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
        {/* Add FAQ Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5" />
              Add New FAQ
            </CardTitle>
            <CardDescription>
              Create a new frequently asked question
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faqQuestion">Question *</Label>
              <Input
                id="faqQuestion"
                value={newFAQ.question}
                onChange={(e) =>
                  setNewFAQ((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="What are your business hours?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faqAnswer">Answer *</Label>
              <Textarea
                id="faqAnswer"
                value={newFAQ.answer}
                onChange={(e) =>
                  setNewFAQ((prev) => ({ ...prev, answer: e.target.value }))
                }
                placeholder="We're open Monday to Friday from 9 AM to 6 PM..."
                className="min-h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faqCategory">Category</Label>
                <select
                  id="faqCategory"
                  value={newFAQ.category}
                  onChange={(e) =>
                    setNewFAQ((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {FAQ_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faqLanguage">Language</Label>
                <select
                  id="faqLanguage"
                  value={newFAQ.language}
                  onChange={(e) =>
                    setNewFAQ((prev) => ({ ...prev, language: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faqPriority">Priority (1-10)</Label>
                <Input
                  id="faqPriority"
                  type="number"
                  min="1"
                  max="10"
                  value={newFAQ.priority}
                  onChange={(e) =>
                    setNewFAQ((prev) => ({
                      ...prev,
                      priority: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newFAQ.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={addFAQs}
                disabled={!newFAQ.question?.trim() || !newFAQ.answer?.trim()}
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQs List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5" />
                  Your FAQs ({filteredFAQs.length})
                </CardTitle>
                <CardDescription>
                  Manage and edit your frequently asked questions
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-48"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-lg">
                            {faq.question}
                          </h4>
                          <Badge variant="outline">{faq.category}</Badge>
                          <Badge variant="secondary" className="text-xs">
                            Priority: {faq.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {faq.answer}
                        </p>
                        {faq.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {faq.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFAQ(faq.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Question</Label>
                        <Input
                          value={faq.question}
                          onChange={(e) =>
                            updateFAQ(faq.id, "question", e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Priority</Label>
                        <select
                          value={faq.priority}
                          onChange={(e) =>
                            updateFAQ(
                              faq.id,
                              "priority",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-2 py-1 text-sm border rounded"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Category</Label>
                        <select
                          value={faq.category}
                          onChange={(e) =>
                            updateFAQ(faq.id, "category", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border rounded"
                        >
                          {FAQ_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery || selectedCategory !== "all"
                    ? "No matching FAQs found"
                    : "No FAQs yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "all"
                    ? "Try changing your search or filter"
                    : "Add FAQs to help your AI receptionist answer questions"}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
