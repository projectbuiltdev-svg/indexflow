import { ClientLayout } from "@/components/client-layout";
import { useWorkspace } from "@/lib/workspace-context";
import CampaignDashboard from "@/components/pseo/CampaignDashboard";

export default function PseoCampaigns() {
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;

  if (!workspaceId) return null;

  return (
    <ClientLayout>
      <CampaignDashboard workspaceId={workspaceId} />
    </ClientLayout>
  );
}
