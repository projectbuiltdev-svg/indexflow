import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import CampaignDashboard from "@/components/pseo/CampaignDashboard";

export default function ContentCampaigns() {
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;

  if (!workspaceId) return null;

  return (
    <div className="p-6">
      <CampaignDashboard workspaceId={workspaceId} />
    </div>
  );
}
