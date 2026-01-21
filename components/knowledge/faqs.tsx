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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Plus,
  Trash2,
  MessageSquare,
  Search,
  Settings2,
  X,
  Save,
  Pencil,
  Check,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFAQs, addFAQ, updateFAQ, deleteFAQ } from "@/actions/knowledge";
import { Separator } from "@/components/ui/separator";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const [newFAQ, setNewFAQ] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
    category: "General",
    language: "en",
    priority: 5,
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchFAQsData();
  }, []);

  const fetchFAQsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getFAQs();

      if (!result.success) {
        throw new Error(result.error);
      }

      setFaqs(result.data || []);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFAQ = async () => {
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
        priority: newFAQ.priority || 5,
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
        priority: 5,
        tags: [],
      });
      setShowAdvanced(false);

      // Refresh data
      await fetchFAQsData();

      toast.success("FAQ added successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFAQ = async (id: string, field: keyof FAQ, value: any) => {
    try {
    const updatedFAQs = faqs.map((faq) =>
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    setFaqs(updatedFAQs);

      const result = await updateFAQ(id, { [field]: value });
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success("FAQ updated");
    } catch (err: any) {
      await fetchFAQsData(); // Revert on error
      toast.error(err.message);
    }
  };

  const handleRemoveFAQ = async () => {
    if (!faqToDelete) return;

    try {
      const result = await deleteFAQ(faqToDelete);
      if (!result.success) {
        throw new Error(result.error);
      }

      await fetchFAQsData();
    toast.success("FAQ removed");
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    } catch (err: any) {
      toast.error(err.message);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

        {/* Add FAQ Form */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New FAQ
            </CardTitle>
            <CardDescription>
            Create a new frequently asked question to help your AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faqQuestion" className="text-sm font-medium">
                Question <span className="text-destructive">*</span>
              </Label>
              <Input
                id="faqQuestion"
                value={newFAQ.question}
                onChange={(e) =>
                  setNewFAQ((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="What are your business hours?"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faqAnswer" className="text-sm font-medium">
                Answer <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="faqAnswer"
                value={newFAQ.answer}
                onChange={(e) =>
                  setNewFAQ((prev) => ({ ...prev, answer: e.target.value }))
                }
                placeholder="We're open Monday to Friday from 9 AM to 6 PM..."
                className="min-h-24 text-base resize-none"
              />
            </div>

            {/* Advanced Options - Hidden for now */}
            {/* <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-between text-sm text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Advanced Options
                  </span>
                  {showAdvanced ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                    <Label htmlFor="faqLanguage" className="text-sm">
                      Language
                    </Label>
                    <Select
                  value={newFAQ.language}
                      onValueChange={(value) =>
                        setNewFAQ((prev) => ({ ...prev, language: value }))
                  }
                >
                      <SelectTrigger id="faqLanguage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                  {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              </div>
            </div>
            <div className="space-y-2">
                  <Label className="text-sm">Tags</Label>
                  <div className="flex gap-2">
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
                      className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
                  {newFAQ.tags && newFAQ.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newFAQ.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                          className="flex items-center gap-1 px-2 py-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                            <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
                  )}
            </div>
              </CollapsibleContent>
            </Collapsible> */}

              <Button
              onClick={handleAddFAQ}
              disabled={
                saving ||
                !newFAQ.question?.trim() ||
                !newFAQ.answer?.trim()
              }
              className="w-full"
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
                </>
              )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQs List */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                Your FAQs
                <Badge variant="secondary" className="ml-2">
                  {filteredFAQs.length}
                </Badge>
                </CardTitle>
              <CardDescription className="mt-1">
                Manage your frequently asked questions
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                  />
                </div>
              {/* Category Filter - Hidden for now */}
              {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {FAQ_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredFAQs.length > 0 ? (
            <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                <Card
                  key={faq.id}
                  className="border transition-all hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-base leading-relaxed text-foreground">
                                {faq.question}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                          {/* Category and Priority badges - Commented out for now */}
                          {/* <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            {faq.priority && (
                              <Badge variant="secondary" className="text-xs">
                                Priority: {faq.priority}
                              </Badge>
                            )}
                          </div> */}
                          {faq.tags && faq.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                              {faq.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {faq.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{faq.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-start gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              setEditingFAQ(
                                editingFAQ === faq.id ? null : faq.id
                              )
                            }
                          >
                            {editingFAQ === faq.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Pencil className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => {
                              setFaqToDelete(faq.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {editingFAQ === faq.id && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-1 gap-4 pt-2">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Question
                              </Label>
                              <Input
                                value={faq.question}
                                onChange={(e) =>
                                  handleUpdateFAQ(
                                    faq.id,
                                    "question",
                                    e.target.value
                                  )
                                }
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Answer
                              </Label>
                              <Textarea
                                value={faq.answer}
                                onChange={(e) =>
                                  handleUpdateFAQ(
                                    faq.id,
                                    "answer",
                                    e.target.value
                                  )
                                }
                                className="text-sm min-h-24 resize-none"
                              />
                            </div>
                            {/* Category - Commented out for now */}
                            {/* <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Category
                              </Label>
                              <Select
                                value={faq.category}
                                onValueChange={(value) =>
                                  handleUpdateFAQ(faq.id, "category", value)
                                }
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {FAQ_CATEGORIES.map((category) => (
                                    <SelectItem
                                      key={category}
                                      value={category}
                                    >
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div> */}
                            {/* Priority - Commented out for now */}
                            {/* <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Priority
                              </Label>
                              <Select
                                value={faq.priority?.toString()}
                                onValueChange={(value) =>
                                  handleUpdateFAQ(
                                    faq.id,
                                    "priority",
                                    parseInt(value)
                                  )
                                }
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                    (num) => (
                                      <SelectItem
                                        key={num}
                                        value={num.toString()}
                                      >
                                        {num}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div> */}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery || selectedCategory !== "all"
                    ? "No matching FAQs found"
                    : "No FAQs yet"}
                </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                  {searchQuery || selectedCategory !== "all"
                  ? "Try changing your search or filter criteria"
                  : "Add your first FAQ to help your AI assistant answer questions"}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be
              undone and will permanently remove the FAQ from your knowledge
              base.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFaqToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFAQ}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
