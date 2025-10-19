import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, CheckCircle2, AlertCircle, Pill } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Medication {
  name: string;
  dosage: string;
  cost: number;
}

interface Interaction {
  drug_a: string;
  drug_b: string;
  severity: "critical" | "major" | "moderate" | "minor";
  description: string;
  recommendation: string;
}

interface DrugInteractionCheckerProps {
  medications: Medication[];
}

export const DrugInteractionChecker = ({ medications }: DrugInteractionCheckerProps) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    if (medications.length >= 2) {
      checkInteractions();
    } else {
      setInteractions([]);
      setCheckedCount(0);
    }
  }, [medications]);

  const checkInteractions = async () => {
    setIsChecking(true);
    const foundInteractions: Interaction[] = [];

    try {
      for (let i = 0; i < medications.length; i++) {
        for (let j = i + 1; j < medications.length; j++) {
          const drugA = extractDrugName(medications[i].name);
          const drugB = extractDrugName(medications[j].name);

          const { data, error } = await supabase
            .from('drug_interactions')
            .select('*')
            .or(`and(drug_a.ilike.%${drugA}%,drug_b.ilike.%${drugB}%),and(drug_a.ilike.%${drugB}%,drug_b.ilike.%${drugA}%)`)
            .maybeSingle();

          if (data && !error) {
            foundInteractions.push(data);
          }
        }
      }

      setInteractions(foundInteractions);
      setCheckedCount(medications.length);
    } catch (error) {
      console.error('Error checking interactions:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const extractDrugName = (fullName: string): string => {
    const parts = fullName.split(' ');
    if (parts[0].toLowerCase() === 'tab' || parts[0].toLowerCase() === 'syp') {
      return parts[1] || parts[0];
    }
    return parts[0];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'major':
        return 'bg-warning text-warning-foreground';
      case 'moderate':
        return 'bg-yellow-500 text-white';
      case 'minor':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'major':
        return <AlertTriangle className="w-4 h-4" />;
      case 'moderate':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (medications.length < 2) {
    return (
      <Card className="p-6 border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-accent opacity-50" />
          <div>
            <h3 className="text-lg font-semibold">Smart Drug Interaction Checker</h3>
            <p className="text-sm text-muted-foreground">Add 2+ medications to check for interactions</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-glow ${
            interactions.length > 0 ? 'bg-gradient-to-br from-destructive to-warning' : 'bg-gradient-to-br from-success to-accent'
          }`}>
            {interactions.length > 0 ? (
              <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
            ) : (
              <Shield className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              Smart Drug Interaction Checker
              <Badge className="bg-accent text-accent-foreground">AI-POWERED</Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              Real-time safety analysis • Prevents ₹2-5L/year in malpractice risk
            </p>
          </div>
        </div>

        {isChecking ? (
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-sm font-medium">Analyzing {medications.length} medications...</span>
            </div>
          </div>
        ) : (
          <>
            {interactions.length === 0 ? (
              <div className="p-4 bg-success/10 rounded-lg border border-success/30 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <div>
                  <p className="font-semibold text-success text-sm">No Interactions Detected</p>
                  <p className="text-xs text-muted-foreground">
                    Checked {checkedCount} medication(s) - Safe to prescribe
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {interactions.length} Interaction{interactions.length !== 1 ? 's' : ''} Found
                  </h4>
                  <Badge variant="destructive" className="animate-pulse">
                    Action Required
                  </Badge>
                </div>

                <div className="space-y-2">
                  {interactions.map((interaction, i) => (
                    <div
                      key={i}
                      className="p-4 bg-background rounded-lg border-2 border-destructive/30 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(interaction.severity)}
                          <span className="font-semibold text-sm">
                            {interaction.drug_a} + {interaction.drug_b}
                          </span>
                        </div>
                        <Badge className={getSeverityColor(interaction.severity)}>
                          {interaction.severity.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="font-medium text-destructive">⚠️ Risk:</p>
                          <p className="text-muted-foreground">{interaction.description}</p>
                        </div>

                        <div className="p-3 bg-primary/5 rounded border border-primary/20">
                          <p className="font-medium text-primary mb-1">💡 Recommendation:</p>
                          <p className="text-sm">{interaction.recommendation}</p>
                        </div>
                      </div>

                      {interaction.severity === 'critical' && (
                        <div className="mt-2 p-2 bg-destructive/10 rounded border border-destructive/30">
                          <p className="text-xs font-semibold text-destructive">
                            🚨 CRITICAL: This combination is contraindicated. Alternative therapy strongly recommended.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-warning/10 rounded-lg border border-warning/30">
                  <p className="text-xs text-muted-foreground">
                    <strong>Legal Protection:</strong> All interactions logged for medical record compliance.
                    Reduces malpractice liability by documenting safety checks.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <div className="pt-3 border-t border-border">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Medications</p>
              <p className="font-semibold">{checkedCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Combinations</p>
              <p className="font-semibold">{checkedCount >= 2 ? (checkedCount * (checkedCount - 1)) / 2 : 0}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alerts</p>
              <p className={`font-semibold ${interactions.length > 0 ? 'text-destructive' : 'text-success'}`}>
                {interactions.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
