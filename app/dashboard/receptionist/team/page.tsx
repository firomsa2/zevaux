import TeamMembersForm from "@/components/receptionist/configure/team-members";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Teams | Zevaux",
  description: "Configure your business Teams and availability",
};

export default function TeamsPage() {
  return <TeamMembersForm />;
}
