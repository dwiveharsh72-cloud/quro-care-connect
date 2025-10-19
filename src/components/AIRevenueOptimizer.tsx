import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, IndianRupee, FileCheck } from "lucide-react";
import { toast } from "sonner";

interface Medication {
  name: string;
  dosage: string;
  cost: number;
  insurerCode?: string;
}

interface Test {
  name: string;
  cost: number;
  insurerCode?: string;
  revenueImpact?: string;
}

interface OptimizationResult {
  originalAmount: number;
  optimizedAmount: number;
  claimSuccessRate: number;
  suggestedTests: Test[];
  revenueOpportunity: number;
  insuranceCompliance: {
    missingCodes: number;
    completeness: number;
  };
}

interface AIRevenueOptimizerProps {
  medications: Medication[];
  symptoms: string[];
  diagnosis: string;
  onOptimize?: (result: OptimizationResult) => void;
}

export const AIRevenueOptimizer = ({ medications, symptoms, diagnosis, onOptimize }: AIRevenueOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);

  const analyzeAndOptimize = () => {
    setIsOptimizing(true);

    setTimeout(() => {
      const medicationTotal = medications.reduce((sum, med) => sum + med.cost, 0);

      const suggestedTests: Test[] = [];
      let additionalRevenue = 0;

      if (symptoms.includes("Persistent cough") || symptoms.includes("Throat inflammation")) {
        suggestedTests.push({
          name: "Chest X-Ray",
          cost: 800,
          insurerCode: "CXR-001",
          revenueImpact: "+15% claim success"
        });
        additionalRevenue += 800;
      }

      if (symptoms.includes("Mild fever")) {
        suggestedTests.push({
          name: "CBC (Complete Blood Count)",
          cost: 400,
          insurerCode: "CBC-001",
          revenueImpact: "+12% approval odds"
        });
        additionalRevenue += 400;
      }

      if (diagnosis && (diagnosis.includes("Respiratory") || diagnosis.includes("Infection"))) {
        suggestedTests.push({
          name: "ECG",
          cost: 500,
          insurerCode: "ECG-001",
          revenueImpact: "+10% revenue capture"
        });
        additionalRevenue += 500;
      }

      const missingCodes = medications.filter(m => !m.insurerCode).length;
      const completeness = ((medications.length - missingCodes) / medications.length) * 100;

      const baseClaimRate = completeness >= 80 ? 85 : 65;
      const optimizedClaimRate = Math.min(95, baseClaimRate + (suggestedTests.length * 5));

      const result: OptimizationResult = {
        originalAmount: medicationTotal,
        optimizedAmount: medicationTotal + additionalRevenue,
        claimSuccessRate: optimizedClaimRate,
        suggestedTests,
        revenueOpportunity: additionalRevenue,
        insuranceCompliance: {
          missingCodes,
          completeness: Math.round(completeness)
        }
      };

      setOptimization(result);
      setIsOptimizing(false);
      toast.success("Revenue optimization complete!");
      onOptimize?.(result);
    }, 2000);
  };

  return (
    <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-success/5">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
            AI Revenue Optimizer
            <Badge className="bg-success text-success-foreground">PREMIUM</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            Maximize claim approvals & identify revenue opportunities
          </p>
        </div>
      </div>

      {!optimization ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-warning/10 rounded-lg border border-warning/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold text-warning">Industry Problem</span>
              </div>
              <p className="text-xs text-muted-foreground">15-25% claims rejected</p>
              <p className="text-lg font-bold text-warning mt-1">₹50K+ lost/year</p>
            </div>

            <div className="p-4 bg-success/10 rounded-lg border border-success/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">AI Solution</span>
              </div>
              <p className="text-xs text-muted-foreground">Smart optimization</p>
              <p className="text-lg font-bold text-success mt-1">+₹20K/month</p>
            </div>
          </div>

          <Button
            onClick={analyzeAndOptimize}
            disabled={isOptimizing || medications.length === 0}
            className="w-full bg-gradient-to-r from-success to-primary hover:opacity-90"
            size="lg"
          >
            {isOptimizing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Revenue Opportunities...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Optimize Revenue & Claims
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Claim Success Rate</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">{optimization.claimSuccessRate}%</span>
                {optimization.claimSuccessRate >= 85 && (
                  <Badge variant="outline" className="text-xs border-success text-success">High</Badge>
                )}
              </div>
            </div>

            <div className="p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground">Revenue Opportunity</span>
              </div>
              <span className="text-2xl font-bold text-success">₹{optimization.revenueOpportunity.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Insurance Compliance</span>
              <Badge variant={optimization.insuranceCompliance.completeness >= 80 ? "default" : "destructive"}>
                {optimization.insuranceCompliance.completeness}% Complete
              </Badge>
            </div>
            {optimization.insuranceCompliance.missingCodes > 0 && (
              <p className="text-xs text-muted-foreground">
                ⚠️ {optimization.insuranceCompliance.missingCodes} medication(s) missing insurer codes
              </p>
            )}
          </div>

          {optimization.suggestedTests.length > 0 && (
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Recommended Upsells (Evidence-Based)
              </h4>
              <div className="space-y-2">
                {optimization.suggestedTests.map((test, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-background rounded border border-border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{test.name}</p>
                      <p className="text-xs text-muted-foreground">{test.revenueImpact}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">₹{test.cost}</p>
                      <p className="text-xs text-muted-foreground">{test.insurerCode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/30">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-success">Optimization Complete</p>
              <p className="text-xs text-muted-foreground">
                Total optimized bundle: ₹{optimization.optimizedAmount.toLocaleString()} ({optimization.claimSuccessRate}% approval odds)
              </p>
            </div>
          </div>

          <Button
            onClick={analyzeAndOptimize}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Re-analyze
          </Button>
        </div>
      )}
    </Card>
  );
};
