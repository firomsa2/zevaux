import KnowledgeOverview from "@/components/knowledge/overview";
import FAQsForm from "@/components/knowledge/faqs";
import WebsiteForm from "@/components/knowledge/website";
import DocumentsForm from "@/components/knowledge/documents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Globe, MessageSquare } from "lucide-react";

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <KnowledgeOverview />

      {/* Main Content Tabs */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <DocumentsForm />
        </TabsContent>

        <TabsContent value="faqs" className="space-y-6">
          <FAQsForm />
        </TabsContent>

        <TabsContent value="website" className="space-y-6">
          <WebsiteForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
