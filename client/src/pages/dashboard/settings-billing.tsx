import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const usageItems = [
  { label: "Workspaces", used: 3, total: 50 },
  { label: "Posts", used: 127, total: 500 },
  { label: "Keywords", used: 45, total: 200 },
  { label: "Users", used: 4, total: 5 },
];

const plans = [
  { id: "starter", name: "Starter", price: "$29/mo" },
  { id: "pro", name: "Pro", price: "$99/mo" },
  { id: "enterprise", name: "Enterprise", price: "$299/mo" },
];

export default function SettingsBilling() {
  const { toast } = useToast();

  const [currentPlan, setCurrentPlan] = useState("pro");
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const [cancelOpen, setCancelOpen] = useState(false);

  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const [creditType, setCreditType] = useState("");
  const [creditAmount, setCreditAmount] = useState("10");

  const [rankCredits, setRankCredits] = useState(15);
  const [gridCredits, setGridCredits] = useState(10);

  const activePlan = plans.find((p) => p.id === currentPlan) || plans[1];

  const handleChangePlan = () => {
    setCurrentPlan(selectedPlan);
    const plan = plans.find((p) => p.id === selectedPlan);
    toast({ title: "Plan changed", description: `Your plan has been changed to ${plan?.name}` });
    setChangePlanOpen(false);
  };

  const handleCancelPlan = () => {
    toast({ title: "Plan cancelled", description: "Your subscription has been cancelled. It will remain active until the end of the billing period." });
    setCancelOpen(false);
  };

  const handleBuyCredits = () => {
    const amount = parseInt(creditAmount) || 0;
    if (amount <= 0) return;
    if (creditType === "rank") {
      setRankCredits((prev) => prev + amount);
    } else {
      setGridCredits((prev) => prev + amount);
    }
    toast({ title: "Credits purchased", description: `${amount} ${creditType === "rank" ? "Rank Tracker" : "Grid Scan"} credits added` });
    setBuyCreditsOpen(false);
    setCreditAmount("10");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Billing & Usage</h1>

      <Card data-testid="card-current-plan">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Badge data-testid="badge-plan-name">{activePlan.name}</Badge>
            <span className="text-2xl font-bold" data-testid="text-plan-price">{activePlan.price}</span>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-next-billing">Next billing date: March 1, 2026</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Button data-testid="button-change-plan" onClick={() => { setSelectedPlan(currentPlan); setChangePlanOpen(true); }}>Change Plan</Button>
            <Button variant="outline" data-testid="button-cancel-plan" onClick={() => setCancelOpen(true)}>Cancel</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {usageItems.map((item) => (
            <div key={item.label} className="space-y-2" data-testid={`usage-${item.label.toLowerCase()}`}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.used} of {item.total}</span>
              </div>
              <Progress value={(item.used / item.total) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card data-testid="card-credits-rank-tracker">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">Rank Tracker Credits</p>
                <p className="text-2xl font-bold" data-testid="text-rank-tracker-credits">{rankCredits}</p>
                <p className="text-xs text-muted-foreground">remaining</p>
              </div>
              <Button variant="outline" size="sm" data-testid="button-buy-rank-credits" onClick={() => { setCreditType("rank"); setBuyCreditsOpen(true); }}>Buy Credits</Button>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-credits-grid-scan">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">Grid Scan Credits</p>
                <p className="text-2xl font-bold" data-testid="text-grid-scan-credits">{gridCredits}</p>
                <p className="text-xs text-muted-foreground">remaining</p>
              </div>
              <Button variant="outline" size="sm" data-testid="button-buy-grid-credits" onClick={() => { setCreditType("grid"); setBuyCreditsOpen(true); }}>Buy Credits</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-payment-method">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm" data-testid="text-card-number">**** **** **** 4242</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              data-testid="button-update-payment"
              onClick={() => toast({ title: "Payment method updated", description: "Your payment method has been updated successfully" })}
            >
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={changePlanOpen} onOpenChange={setChangePlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger data-testid="select-change-plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name} - {p.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePlanOpen(false)} data-testid="button-cancel-change-plan">Cancel</Button>
            <Button onClick={handleChangePlan} data-testid="button-confirm-change-plan">Confirm Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Plan</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to cancel your <span className="font-medium text-foreground">{activePlan.name}</span> plan? Your subscription will remain active until the end of the current billing period.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)} data-testid="button-cancel-cancel">Keep Plan</Button>
            <Button variant="destructive" onClick={handleCancelPlan} data-testid="button-confirm-cancel">Cancel Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={buyCreditsOpen} onOpenChange={setBuyCreditsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy {creditType === "rank" ? "Rank Tracker" : "Grid Scan"} Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Number of Credits</Label>
              <Input
                type="number"
                min="1"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                data-testid="input-credit-amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyCreditsOpen(false)} data-testid="button-cancel-buy-credits">Cancel</Button>
            <Button onClick={handleBuyCredits} data-testid="button-confirm-buy-credits">Purchase</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
