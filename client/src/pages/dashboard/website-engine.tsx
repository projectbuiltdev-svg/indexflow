import { lazy, Suspense } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { Loader2 } from "lucide-react";

const WECanvas = lazy(() => import("@/components/website-engine/WECanvas"));

export default function WebsiteEngine() {
  const { selectedWorkspace } = useWorkspace();
  const venueId = selectedWorkspace?.id || "";

  return (
    <div className="h-[calc(100vh-64px)]" data-testid="page-website-engine">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <WECanvas
          projectId="0"
          pageId="0"
          venueId={venueId}
          projectLanguage="en"
        />
      </Suspense>
    </div>
  );
}
