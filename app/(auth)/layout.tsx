import { getUserSession } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await getUserSession();
  if (response?.user) {
    redirect("/");
  }
  return <>{children}</>;
}
