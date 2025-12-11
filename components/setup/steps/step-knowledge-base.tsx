"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function StepKnowledgeBase({ config, onChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="kb-url">Website URL or Knowledge Base Link</Label>
        <Input
          id="kb-url"
          type="url"
          placeholder="https://example.com"
          value={config.knowledge_base_url}
          onChange={(e) => onChange({ knowledge_base_url: e.target.value })}
          className="mt-2"
        />
        <p className="text-xs text-text-tertiary mt-2">
          Provide a URL to your website or knowledge base. The AI will use this
          to answer customer questions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">What You Can Upload</CardTitle>
          <CardDescription>The AI receptionist can learn from:</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>Website content and pages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>FAQ documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>Product/service information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>Pricing and policies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>Business procedures</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> The more information you provide, the better
          your AI receptionist can answer customer questions accurately.
        </p>
      </div>
    </div>
  );
}
