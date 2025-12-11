import KnowledgeOverview from "@/components/knowledge/overview";
import FAQsForm from "@/components/knowledge/faqs";
import WebsiteForm from "@/components/knowledge/website";
import DocumentsForm from "@/components/knowledge/documents";
import TrainingForm from "@/components/knowledge/training";

export default function KnowledgePage() {
  return (
    <div className="space-y-12">
      {/* Overview stats and quick actions */}
      <KnowledgeOverview />

      {/* Documents section */}
      <section className="space-y-6">
        {/* <h2 className="text-2xl font-semibold tracking-tight">Documents</h2> */}
        <DocumentsForm />
      </section>

      {/* FAQs section */}
      <section className="space-y-6">
        {/* <h2 className="text-2xl font-semibold tracking-tight">FAQs</h2> */}
        <FAQsForm />
      </section>

      {/* Website content section */}
      <section className="space-y-6">
        {/* <h2 className="text-2xl font-semibold tracking-tight">
          Website Content
        </h2> */}
        <WebsiteForm />
      </section>

      {/* Training section */}
      {/* <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">AI Training</h2>
        <TrainingForm />
      </section> */}
    </div>
  );
}
