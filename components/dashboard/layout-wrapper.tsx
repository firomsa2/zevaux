import { UpgradeNudge } from "@/components/billing/upgrade-nudge";

export function DashboardLayoutWrapper({
  children,
  businessData,
}: {
  children: React.ReactNode;
  businessData: {
    businessId: string;
    usage: {
      minutesUsed: number;
      purchasedMinutes: number;
      planSlug: string;
    };
  } | null;
}) {
  return (
    <>
      {children}
      {businessData && (
        <UpgradeNudge
          businessId={businessData.businessId}
          usage={businessData.usage}
        />
      )}
    </>
  );
}
