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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2, Upload, FileText, Trash2 } from "lucide-react";
import { PhoneNumberAssignment } from "./phone-number-assignment";

interface ReceptionistFormProps {
  existing?: any;
  orgId: string | null;
}

interface ReceptionistConfig {
  name: string;
  greeting_message: string;
  prompts: string;
  voicemail_message: string;
  closing_message: string;
  voice_profile: {
    voice: string;
    lang: string;
  };
  fallback_contact: {
    email: string;
  };
  website_url: string;
}

export default function ReceptionistForm({
  existing,
  orgId,
}: ReceptionistFormProps) {
  const [config, setConfig] = useState<ReceptionistConfig>({
    name: "",
    greeting_message: "",
    prompts: "",
    voicemail_message: "",
    closing_message: "",
    voice_profile: {
      voice: "alloy",
      lang: "en-US",
    },
    fallback_contact: {
      email: "",
    },
    website_url: "",
  });

  const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null);
  const [knowledgeFileIds, setKnowledgeFileIds] = useState<string[]>([]);

  const [assignedPhoneNumberId, setAssignedPhoneNumberId] = useState<
    string | null
  >(existing?.assigned_phone_number_id || null);

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  // Load existing data
  useEffect(() => {
    if (existing) {
      setConfig({
        name: existing.name || "",
        greeting_message: existing.greeting || "",
        prompts: existing.prompts || "",
        voicemail_message: existing.voicemail || "",
        closing_message: existing.closing_message || "",
        voice_profile: {
          voice: existing.voice_profile?.voice || "alloy",
          lang: existing.voice_profile?.lang || "en-US",
        },
        fallback_contact: {
          email: existing.fallback_contact?.email || "",
        },
        website_url: existing.website_url || "",
      });
      setAssignedPhoneNumberId(existing.assigned_phone_number_id || null);
    }
  }, [existing]);

  // Load existing knowledge files
  // useEffect(() => {
  //   const loadFiles = async () => {
  //     if (!orgId) return;

  //     const { data, error } = await supabase
  //       .from("knowledge_files")
  //       .select("*")
  //       .eq("org_id", orgId)
  //       .order("created_at", { ascending: false });

  //     if (!error && data) {
  //       setUploadedFiles(data);
  //     }
  //   };

  //   loadFiles();
  // }, [orgId, supabase]);
  useEffect(() => {
    const loadFiles = async () => {
      if (!orgId) return;
      const { data, error } = await supabase
        .from("knowledge_files")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setUploadedFiles(data);
        // Store existing file IDs
        setKnowledgeFileIds(data.map((f) => f.id));
      }
    };
    loadFiles();
  }, [orgId, supabase]);

  const handleConfigChange = (field: string, value: any) => {
    if (field.includes(".")) {
      // Handle nested fields like voice_profile.voice
      const [parent, child] = field.split(".");
      setConfig((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ReceptionistConfig],
          [child]: value,
        },
      }));
    } else {
      setConfig((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKnowledgeFile(e.target.files[0]);
    }
  };

  // const uploadKnowledgeFile = async (): Promise<string | null> => {
  //   if (!knowledgeFile || !orgId) return null;

  //   setUploading(true);
  //   try {
  //     const fileExt = knowledgeFile.name.split(".").pop();
  //     const fileName = `${orgId}/${Date.now()}-${Math.random()
  //       .toString(36)
  //       .substring(2)}.${fileExt}`;

  //     const { error: uploadError } = await supabase.storage
  //       .from("knowledge_files")
  //       .upload(fileName, knowledgeFile);

  //     if (uploadError) {
  //       console.error("Upload error:", uploadError);
  //       return null;
  //     }

  //     const { data, error } = await supabase
  //       .from("knowledge_files")
  //       .insert({
  //         org_id: orgId,
  //         file_path: fileName,
  //         file_name: knowledgeFile.name,
  //         file_size: knowledgeFile.size,
  //         file_type: knowledgeFile.type,
  //         status: "pending",
  //       })
  //       .select()
  //       .single();

  //     if (error) {
  //       console.error("Database error:", error);
  //       return null;
  //     }

  //     setUploadedFiles((prev) => [data, ...prev]);
  //     setKnowledgeFile(null);
  //     return data.id;
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     return null;
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  console.log("OrgId in upload:", orgId);

  const uploadKnowledgeFile = async (): Promise<string | null> => {
    if (!knowledgeFile || !orgId) {
      console.error("❌ Missing file or orgId");
      return null;
    }

    setUploading(true);

    try {
      const fileExt = knowledgeFile.name.split(".").pop()?.toLowerCase();
      const fileName = `${orgId}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      console.log("📤 Starting upload:", {
        fileName,
        fileSize: knowledgeFile.size,
        fileType: knowledgeFile.type,
        orgId,
      });

      // Step 1: Upload to storage
      console.log("🔄 Step 1: Uploading to storage...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("knowledge_files")
        .upload(fileName, knowledgeFile);

      if (uploadError) {
        console.error("❌ Storage upload error:", uploadError);
        console.log("📋 Upload error details:", {
          message: uploadError.message,
          name: uploadError.name,
          stack: uploadError.stack,
        });
        alert(`Upload failed: ${uploadError.message}`);
        return null;
      }

      console.log("✅ File uploaded to storage:", uploadData);

      // Step 2: Save to database
      console.log("🔄 Step 2: Saving to database...");
      const { data, error } = await supabase
        .from("knowledge_files")
        .insert({
          org_id: orgId,
          file_path: fileName,
          file_name: knowledgeFile.name,
          file_size: knowledgeFile.size,
          file_type: knowledgeFile.type,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Database error:", error);
        // If database insert fails, delete the uploaded file
        console.log("🔄 Cleaning up: Deleting uploaded file from storage...");
        await supabase.storage.from("knowledge_files").remove([fileName]);
        alert(`Database error: ${error.message}`);
        return null;
      }

      console.log("✅ File saved to database:", data);

      // Update UI
      setUploadedFiles((prev) => [data, ...prev]);
      setKnowledgeFileIds((prev) => [...prev, data.id]);
      setKnowledgeFile(null);

      // Reset file input
      const fileInput = document.getElementById(
        "knowledge"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      alert("✅ File uploaded successfully!");
      return data.id;
    } catch (error: any) {
      console.error("💥 Unexpected upload error:", error);
      alert(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const testStorageAccess = async () => {
    console.log("🧪 Testing storage access...");

    if (!orgId) {
      console.error("❌ No orgId");
      return;
    }

    try {
      // Test 1: List buckets
      console.log("🔍 Test 1: Listing buckets...");
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();
      console.log("Buckets:", buckets);
      console.log("Buckets error:", bucketsError);

      // Test 2: List files in org folder
      console.log("🔍 Test 2: Listing files in org folder...");
      const { data: files, error: filesError } = await supabase.storage
        .from("knowledge_files")
        .list(orgId);
      console.log("Files:", files);
      console.log("Files error:", filesError);

      // Test 3: Try to upload a small test file
      console.log("🔍 Test 3: Testing upload...");
      const testContent = "This is a test file for storage access";
      const testFile = new File([testContent], "test.txt", {
        type: "text/plain",
      });
      const testFileName = `${orgId}/test-${Date.now()}.txt`;

      const { data: testUpload, error: testError } = await supabase.storage
        .from("knowledge_files")
        .upload(testFileName, testFile);

      console.log("Test upload result:", testUpload);
      console.log("Test upload error:", testError);

      if (testUpload && !testError) {
        console.log("✅ Test upload successful!");
        // Clean up test file
        await supabase.storage.from("knowledge_files").remove([testFileName]);
        console.log("✅ Test file cleaned up");
      }
    } catch (error) {
      console.error("❌ Storage test failed:", error);
    }
  };
  // const handleDeleteFile = async (fileId: string, filePath: string) => {
  //   try {
  //     await supabase.storage.from("knowledge_files").remove([filePath]);
  //     await supabase.from("knowledge_files").delete().eq("id", fileId);
  //     setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  //   } catch (error: any) {
  //     console.error("Delete error:", error);
  //     alert("Error deleting file: " + error.message);
  //   }
  // };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleDeleteFile = async (fileId: string, filePath: string) => {
    try {
      await supabase.storage.from("knowledge_files").remove([filePath]);
      await supabase.from("knowledge_files").delete().eq("id", fileId);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      setKnowledgeFileIds((prev) => prev.filter((id) => id !== fileId));
    } catch (error: any) {
      console.error("Delete error:", error);
      alert("Error deleting file: " + error.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orgId) {
      alert("Organization ID not found. Please try logging in again.");
      return;
    }

    setSaving(true);

    try {
      // Upload knowledge file if selected
      // let knowledgeFileId = null;
      // if (knowledgeFile) {
      //   knowledgeFileId = await uploadKnowledgeFile();
      // }

      // if (knowledgeFile && !knowledgeFileId) {
      //   throw new Error("Knowledge file upload failed.");
      // }

      if (config.website_url && !isValidUrl(config.website_url)) {
        alert("Please enter a valid website URL");
        setSaving(false);
        return;
      }

      if (knowledgeFile) {
        const newFileId = await uploadKnowledgeFile();
        if (!newFileId) throw new Error("Knowledge file upload failed.");
      }

      // Prepare data for webhook
      const webhookData = {
        name: config.name,
        first_message: config.greeting_message,
        prompts: config.prompts,
        voicemail: config.voicemail_message,
        closing_message: config.closing_message,
        voice_profile: config.voice_profile,
        fallback_contact: config.fallback_contact,
        // knowledge_file_id: knowledgeFileId,
        knowledge_file_ids: knowledgeFileIds,
        organization_id: orgId,
        website_url: config.website_url,
        assigned_phone_number_id: assignedPhoneNumberId,
      };

      // Send to webhook
      const webhookResponse = await fetch(
        // "https://ddconsult.app.n8n.cloud/webhook/agentf7876ea1-d834-401e-b89f-2a6544ce3e33",
        "https://app.zevaux.com/webhook/agentz2052aaa0-c045-49e7-8b28-3e89f278dec5",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookData),
        }
      );

      if (!webhookResponse.ok) {
        throw new Error(`Webhook failed: ${webhookResponse.statusText}`);
      }

      // Save to local database
      const dbData = {
        org_id: orgId,
        name: config.name,
        greeting: config.greeting_message,
        prompts: config.prompts,
        voicemail: config.voicemail_message,
        closing_message: config.closing_message,
        voice_profile: config.voice_profile,
        fallback_contact: config.fallback_contact,
        website_url: config.website_url,
        assigned_phone_number_id: assignedPhoneNumberId,
      };

      const { error } = existing
        ? await supabase
            .from("receptionists")
            .update(dbData)
            .eq("id", existing.id)
        : await supabase.from("receptionists").insert(dbData);

      if (error) {
        console.error("Database error:", error);
        alert("Saved to webhook but local save failed: " + error.message);
      } else {
        alert("Saved successfully to both webhook and local database!");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Quick templates for each section
  const greetingTemplates = [
    "Hello, thank you for calling. How can I help you?",
    "Hi there! Welcome to our business. What can I assist you with?",
    "Good day! Thank you for reaching out. How may I be of service?",
  ];

  const promptTemplates = [
    `You are a professional and friendly receptionist for a business. Your role is to:
- Answer calls promptly and professionally
- Understand the caller's needs
- Provide helpful information when possible
- Transfer to appropriate departments when needed
- Take detailed messages when necessary

Always maintain a calm, helpful tone and ensure callers feel heard and assisted.`,

    `You are an AI receptionist for a medical practice. Your responsibilities include:
- Answering calls with empathy and professionalism
- Scheduling appointments based on availability
- Providing basic information about services
- Directing urgent medical issues to emergency services
- Maintaining strict patient confidentiality

Speak clearly and compassionately, understanding that callers may be stressed or in need of medical help.`,
  ];

  const voicemailTemplates = [
    "I'm sorry, we're unable to take your call right now. Please leave your name, number, and a brief message after the tone, and we'll get back to you as soon as possible.",
    "You've reached our voicemail. We're currently assisting other callers. Please leave your message with your name and contact information, and we'll return your call shortly.",
  ];

  const closingTemplates = [
    "Thank you for calling! Have a wonderful day.",
    "We appreciate your call. If you need anything else, don't hesitate to reach out.",
    "Thanks for contacting us. We look forward to assisting you again soon!",
  ];

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Add this temporary debug section */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Debug Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-700 mb-4">
            If uploads are failing, test your storage setup:
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={testStorageAccess}
            className="mb-2"
          >
            Test Storage Access
          </Button>
          <div className="text-xs text-yellow-600">
            <p>Org ID: {orgId}</p>
            <p>Bucket: knowledge_files</p>
          </div>
        </CardContent>
      </Card>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Configure your receptionist's basic details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Receptionist Name</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => handleConfigChange("name", e.target.value)}
                placeholder="Enter receptionist name"
                required
                className="border border-gray-300"
              />
            </div>
            {/* <div>
              <Label htmlFor="email">Fallback Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={config.fallback_contact.email}
                onChange={(e) =>
                  handleConfigChange("fallback_contact.email", e.target.value)
                }
                placeholder="support@yourcompany.com"
              />
            </div> */}
          </div>
        </CardContent>
      </Card>
      {/* Phone Number Assignment */}
      <Card id="phone-number-assignment">
        <CardHeader>
          <CardTitle>Phone Number Assignment</CardTitle>
          <CardDescription>
            Assign a phone number to this receptionist. They will answer calls
            to this number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone-assignment">Assigned Phone Number</Label>
            {/* {orgId && (
              <PhoneNumberAssignment
                orgId={orgId}
                receptionistId={existing?.id || "new"} // Pass "new" for new receptionists
                currentPhoneNumberId={assignedPhoneNumberId}
                onAssignmentChange={(phoneNumberId) => {
                  setAssignedPhoneNumberId(phoneNumberId);
                }} */}
            {orgId && (
              <PhoneNumberAssignment
                orgId={orgId}
                receptionistId={existing?.id || "temp-new"} // Use a temporary ID for new receptionists
                currentPhoneNumberId={assignedPhoneNumberId}
                onAssignmentChange={(phoneNumberId) => {
                  console.log(
                    "📞 Phone number assignment changed:",
                    phoneNumberId
                  );
                  setAssignedPhoneNumberId(phoneNumberId);
                }}
              />
            )}

            <p className="text-xs text-muted-foreground mt-2">
              Only active, unassigned phone numbers are shown. Manage phone
              numbers in the{" "}
              <a
                href="/dashboard/phone-numbers"
                className="text-primary hover:underline"
              >
                Phone Numbers
              </a>{" "}
              section.
            </p>
          </div>

          {/* Current Assignment Display */}
          {assignedPhoneNumberId && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-green-800">
                    <strong>Active Assignment:</strong> This receptionist will
                    answer calls to the selected phone number.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!assignedPhoneNumberId && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm text-yellow-800">
                    <strong>No Phone Number Assigned:</strong> This receptionist
                    will not receive any calls until a phone number is assigned.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      {/* Voice Configuration */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Voice Configuration</CardTitle>
          <CardDescription>
            Customize how your receptionist sounds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voice">Voice</Label>
              <Select
                value={config.voice_profile.voice}
                onValueChange={(value) =>
                  handleConfigChange("voice_profile.voice", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alloy">
                    Alloy - Clear and professional
                  </SelectItem>
                  <SelectItem value="echo">Echo - Warm and friendly</SelectItem>
                  <SelectItem value="fable">
                    Fable - Storyteller tone
                  </SelectItem>
                  <SelectItem value="onyx">
                    Onyx - Deep and authoritative
                  </SelectItem>
                  <SelectItem value="nova">
                    Nova - Bright and energetic
                  </SelectItem>
                  <SelectItem value="shimmer">
                    Shimmer - Soft and calming
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={config.voice_profile.lang}
                onValueChange={(value) =>
                  handleConfigChange("voice_profile.lang", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card> */}
      {/* Greeting Message */}
      <Card>
        <CardHeader>
          <CardTitle>Greeting Message</CardTitle>
          <CardDescription>The first message callers hear</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="greeting">Greeting Message</Label>
            <Textarea
              id="greeting"
              placeholder="Hello, thank you for calling. How can I help you?"
              value={config.greeting_message}
              onChange={(e) =>
                handleConfigChange("greeting_message", e.target.value)
              }
              className="min-h-24 border border-gray-200"
            />
          </div>

          {/* <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-900">
                <strong>Preview:</strong> "
                {config.greeting_message ||
                  "Your greeting message will appear here"}
                "
              </p>
            </CardContent>
          </Card> */}

          <div className="space-y-3">
            <p className="text-sm font-medium">Quick Templates:</p>
            <div className="grid gap-2">
              {greetingTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    handleConfigChange("greeting_message", template)
                  }
                  className="text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* AI Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>AI Instructions & Personality</CardTitle>
          <CardDescription>
            Define how your receptionist should behave and respond
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompts">Detailed Instructions</Label>
            <Textarea
              id="prompts"
              placeholder="Describe your receptionist's personality, responsibilities, and how they should handle calls..."
              value={config.prompts}
              onChange={(e) => handleConfigChange("prompts", e.target.value)}
              className="min-h-48 font-mono text-sm max-h-96 border border-gray-200"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Character Count: {config.prompts.length} | Word Count:{" "}
              {config.prompts.split(/\s+/).filter(Boolean).length}
            </p>
          </div>

          {/* <div className="space-y-3">
            <p className="text-sm font-medium">Template Prompts:</p>
            <div className="grid gap-3">
              {promptTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleConfigChange("prompts", template)}
                  className="text-left p-4 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-mono whitespace-pre-wrap"
                >
                  {template}
                </button>
              ))}
            </div>
          </div> */}
        </CardContent>
      </Card>
      {/* Voicemail Message */}
      <Card>
        <CardHeader>
          <CardTitle>Voicemail Message</CardTitle>
          <CardDescription>Message when calls go to voicemail</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="voicemail">Voicemail Message</Label>
            <Textarea
              id="voicemail"
              placeholder="I'm sorry, we're unable to take your call right now. Please leave a message after the beep..."
              value={config.voicemail_message}
              onChange={(e) =>
                handleConfigChange("voicemail_message", e.target.value)
              }
              className="min-h-24 border border-gray-200"
            />
          </div>

          {/* <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <p className="text-sm text-purple-800 italic">
                <strong>Preview:</strong> "
                {config.voicemail_message ||
                  "Your voicemail message will appear here"}
                "
              </p>
            </CardContent>
          </Card> */}

          <div className="space-y-3">
            <p className="text-sm font-medium">Quick Templates:</p>
            <div className="grid gap-2">
              {voicemailTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    handleConfigChange("voicemail_message", template)
                  }
                  className="text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Closing Message */}
      <Card>
        <CardHeader>
          <CardTitle>Closing Message</CardTitle>
          <CardDescription>Final message at the end of calls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="closing">Closing Message</Label>
            <Textarea
              id="closing"
              placeholder="Thank you for calling! Have a great day."
              value={config.closing_message}
              onChange={(e) =>
                handleConfigChange("closing_message", e.target.value)
              }
              className="min-h-20 border border-gray-200"
            />
          </div>

          {/* <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <p className="text-sm text-green-800">
                <strong>Preview:</strong> "
                {config.closing_message ||
                  "Your closing message will appear here"}
                "
              </p>
            </CardContent>
          </Card> */}

          <div className="space-y-3">
            <p className="text-sm font-medium">Quick Templates:</p>
            <div className="grid gap-2">
              {closingTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    handleConfigChange("closing_message", template)
                  }
                  className="border border-gray-200 text-left p-3 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Website URL */}
      <Card>
        <CardHeader>
          <CardTitle>Website URL</CardTitle>
          <CardDescription>
            (Optional) Your business website for reference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              value={config.website_url}
              onChange={(e) =>
                handleConfigChange("website_url", e.target.value)
              }
              placeholder="https://www.yourbusiness.com"
              className="border border-gray-200"
            />
          </div>
        </CardContent>
      </Card>
      {/* Knowledge Base */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>
            Upload documents to enhance your receptionist's knowledge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="knowledge">Upload Knowledge File</Label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Input
                id="knowledge"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.txt,.doc,.docx,.md,.csv"
                className="hidden"
              />
              <Label htmlFor="knowledge" className="cursor-pointer">
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, TXT, DOC, DOCX, MD, CSV (Max 10MB)
                    </p>
                  </div>
                </div>
              </Label>
            </div>
            {knowledgeFile && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {knowledgeFile.name}
              </p>
            )}
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading file...
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Uploaded Files:</p>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{file.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.status} • {Math.round(file.file_size / 1024)}KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id, file.file_path)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="min-w-32" size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
