import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWorkspace } from "@/lib/workspace-context";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Loader2, AlertTriangle, ShoppingCart } from "lucide-react";
import CampaignDashboard from "@/components/pseo/CampaignDashboard";
import CampaignWizard from "@/components/pseo/CampaignWizard";
import { useState } from "react";

interface PseoEntitlement {
  baseCampaigns: number;
  addonCampaigns: number;
  totalEntitlement: number;
  activeCount: number;
  slotsAvailable: number;
  checkoutUrl: string | null;
}

export default function ContentCampaigns() {
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;
  const [wizardOpen, setWizardOpen] = useState(false);

  const { data: entitlement, isLoading: entitlementLoading } = useQuery<PseoEntitlement>({
    queryKey: [`/api/pseo/entitlement`, workspaceId],
    queryFn: async () => {
      const res = await fetch(`/api/pseo/entitlement?workspaceId=${workspaceId}`);
      if (!res.ok) throw new Error("Failed to check entitlement");
      return res.json();
    },
    enabled: !!workspaceId,
  });

  const handleWizardComplete = useCallback((campaignId: string) => {
    setWizardOpen(false);
    queryClient.invalidateQueries({ queryKey: [`/api/pseo/campaigns`] });
    queryClient.invalidateQueries({ queryKey: [`/api/pseo/entitlement`, workspaceId] });
  }, [workspaceId]);

  if (!workspaceId) return null;

  if (entitlementLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (entitlement && entitlement.totalEntitlement === 0 && entitlement.baseCampaigns === 0) {
    return (
      <div className="p-6">
        <Card className="max-w-lg mx-auto mt-8" data-testid="pseo-upgrade-prompt">
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">pSEO Not Available</h2>
            <p className="text-muted-foreground mb-6">
              Programmatic SEO campaigns are not included in your current plan.
              Upgrade to a plan with pSEO campaigns to generate location×service landing pages at scale.
            </p>
            <Button data-testid="button-upgrade-plan">
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const slotsExhausted = entitlement && entitlement.slotsAvailable === 0 && entitlement.totalEntitlement !== -1;

  return (
    <div className="p-6">
      {slotsExhausted && (
        <div className="mb-4 flex items-center justify-between p-3 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 rounded-lg" data-testid="pseo-slots-exhausted">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm">
              All {entitlement!.totalEntitlement} campaign slot{entitlement!.totalEntitlement !== 1 ? "s" : ""} used.
              Archive a campaign or add more slots.
            </span>
          </div>
          {entitlement!.checkoutUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(entitlement!.checkoutUrl!, "_blank")}
              data-testid="button-add-campaign-slot"
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              Add Campaign Slot
            </Button>
          )}
        </div>
      )}

      <CampaignDashboard workspaceId={workspaceId} />

      {wizardOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <CampaignWizard
            workspaceId={workspaceId}
            onClose={() => setWizardOpen(false)}
            onComplete={handleWizardComplete}
          />
        </div>
      )}
    </div>
  );
}
