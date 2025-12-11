import { Metadata } from "next";
import TrainingForm from "@/components/knowledge/training";

export const metadata: Metadata = {
  title: "Training | Zevaux",
  description: "Train and test your AI receptionist with your knowledge base",
};

export default function TrainingPage() {
  return <TrainingForm />;
}