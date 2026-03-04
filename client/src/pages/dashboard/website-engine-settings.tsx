import { useWorkspace } from "@/lib/workspace-context";
import WEWhiteLabel from "@/components/website-engine/WEWhiteLabel";

export default function WebsiteEngineSettings() {
  const { selectedWorkspace } = useWorkspace();
  const venueId = selectedWorkspace?.id || "";

  return (
    <div className="p-6" data-testid="page-we-settings">
      <WEWhiteLabel
        venueId={venueId}
        tier={(selectedWorkspace as any)?.subscriptionTier || selectedWorkspace?.plan || "solo"}
        isOnTrial={(selectedWorkspace as any)?.onTrial || false}
        userEmail=""
      />
    </div>
  );
}
