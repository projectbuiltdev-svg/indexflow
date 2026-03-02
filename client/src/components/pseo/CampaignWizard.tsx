import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/lib/queryClient";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  Upload,
  MapPin,
  Briefcase,
  Rocket,
} from "lucide-react";
import TemplateUploadStep from "./wizard-steps/TemplateUploadStep";
import LocationSetupStep from "./wizard-steps/LocationSetupStep";
import ServicesKeywordsStep from "./wizard-steps/ServicesKeywordsStep";
import ConfirmActivateStep from "./wizard-steps/ConfirmActivateStep";
import type { TemplateData } from "./wizard-steps/TemplateUploadStep";
import type { LocationsData } from "./wizard-steps/LocationSetupStep";
import type { ServicesKeywordsData } from "./wizard-steps/ServicesKeywordsStep";

interface CampaignWizardProps {
  workspaceId: string;
  onClose: () => void;
  onComplete: (campaignId: string) => void;
}

const STEPS = [
  { key: "template", label: "Template", icon: Upload },
  { key: "locations", label: "Locations", icon: MapPin },
  { key: "services", label: "Services & Keywords", icon: Briefcase },
  { key: "confirm", label: "Confirm & Activate", icon: Rocket },
] as const;

export default function CampaignWizard({ workspaceId, onClose, onComplete }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignName, setCampaignName] = useState("");
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [locationsData, setLocationsData] = useState<LocationsData | null>(null);
  const [servicesData, setServicesData] = useState<ServicesKeywordsData | null>(null);

  const handleTemplateComplete = useCallback((data: TemplateData) => {
    setTemplateData(data);
    setCurrentStep(1);
  }, []);

  const handleLocationsComplete = useCallback((data: LocationsData) => {
    setLocationsData(data);
    setCurrentStep(2);
  }, []);

  const handleServicesComplete = useCallback((data: ServicesKeywordsData) => {
    setServicesData(data);
    setCurrentStep(3);
  }, []);

  const handleActivateComplete = useCallback((campaignId: string) => {
    queryClient.invalidateQueries({ queryKey: [`/api/pseo/campaigns`] });
    queryClient.invalidateQueries({ queryKey: [`/api/pseo/entitlement`] });
    onComplete(campaignId);
  }, [onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const effectiveName = campaignName.trim() || "Untitled Campaign";

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col" data-testid="pseo-campaign-wizard">
      <div className="border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-wizard-close">
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold" data-testid="text-wizard-title">New pSEO Campaign</h1>
            <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="campaign-name" className="text-sm text-muted-foreground">Campaign Name:</Label>
          <Input
            id="campaign-name"
            placeholder="My Campaign"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-56 h-8 text-sm"
            data-testid="input-campaign-name"
          />
        </div>
      </div>

      <div className="border-b px-6 py-3 shrink-0">
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={step.key} className="flex items-center gap-2">
                {idx > 0 && (
                  <div className={`w-12 h-0.5 ${isCompleted ? "bg-primary" : "bg-border"}`} />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                    data-testid={`step-indicator-${step.key}`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-3.5 w-3.5" />}
                  </div>
                  <span
                    className={`text-sm hidden sm:inline ${
                      isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto p-6">
          {currentStep > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-4"
              data-testid="button-wizard-back"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to {STEPS[currentStep - 1].label}
            </Button>
          )}

          {currentStep === 0 && (
            <TemplateUploadStep
              onComplete={handleTemplateComplete}
              initialData={templateData}
            />
          )}

          {currentStep === 1 && (
            <LocationSetupStep
              onComplete={handleLocationsComplete}
              initialData={locationsData}
              serviceCount={servicesData?.services.length || 0}
            />
          )}

          {currentStep === 2 && locationsData && (
            <ServicesKeywordsStep
              onComplete={handleServicesComplete}
              initialData={servicesData}
              locations={locationsData.locations}
              workspaceId={workspaceId}
            />
          )}

          {currentStep === 3 && templateData && locationsData && servicesData && (
            <ConfirmActivateStep
              templateData={templateData}
              locationsData={locationsData}
              servicesData={servicesData}
              workspaceId={workspaceId}
              campaignName={effectiveName}
              onComplete={handleActivateComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
