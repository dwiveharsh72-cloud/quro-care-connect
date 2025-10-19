import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mic, FileText, Plus, Printer, Send, Sparkles, Activity, Pill, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AIRevenueOptimizer } from "@/components/AIRevenueOptimizer";
import { DrugInteractionChecker } from "@/components/DrugInteractionChecker";

const Prescriptions = () => {
  const [prescription, setPrescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("Voice recording started - AI Medical Scribe active");
      // Simulate voice input with AI analysis
      setTimeout(() => {
        const mockTranscript = "Patient complains of persistent cough and mild fever for 3 days. Chest clear on auscultation. Throat mildly inflamed.";
        setPrescription(mockTranscript);
        setIsRecording(false);
        toast.success("Voice input processed");
        
        // AI Medical Scribe Analysis
        setTimeout(() => {
          setAiAnalysis({
            symptoms: ["Persistent cough", "Mild fever (3 days)", "Throat inflammation"],
            possibleDiagnosis: ["Upper Respiratory Tract Infection", "Viral Pharyngitis"],
            confidence: 87,
            suggestedMedications: [
              { name: "Tab Azithromycin 500mg", dosage: "OD for 3 days", reason: "Bacterial coverage", cost: 120, insurerCode: "AZI-500" },
              { name: "Syp Cough suppressant", dosage: "10ml TDS", reason: "Symptom relief", cost: 85, insurerCode: "COUGH-01" },
              { name: "Tab Paracetamol 650mg", dosage: "SOS for fever", reason: "Fever management", cost: 45, insurerCode: "PCM-650" }
            ],
            recommendedTests: ["Throat swab", "CBC (if fever persists)"],
            redFlags: [],
            followUp: "3 days or if symptoms worsen"
          });
          toast.success("AI analysis complete!");
        }, 1500);
      }, 2500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Prescriptions</h1>
        <p className="text-muted-foreground">Create prescriptions with voice-to-text AI assistance</p>
      </div>

      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-success/10 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              AI Medical Scribe + Smart Triage
              <Badge className="bg-primary text-primary-foreground">NEW</Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              Speak naturally and let AI structure your clinical notes, suggest diagnoses, recommend medications, 
              and identify red flags - all in real-time. The most advanced clinical documentation assistant.
            </p>
          </div>
        </div>
      </div>

      {aiAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRevenueOptimizer
            medications={aiAnalysis.suggestedMedications || []}
            symptoms={aiAnalysis.symptoms || []}
            diagnosis={aiAnalysis.possibleDiagnosis?.[0] || ""}
          />
          <DrugInteractionChecker
            medications={aiAnalysis.suggestedMedications || []}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Voice Input */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">AI Scribe</h3>
              </div>
              <Badge variant="outline" className={isRecording ? "bg-destructive/10 text-destructive border-destructive animate-pulse" : "bg-primary/10 text-primary border-primary"}>
                <Mic className="w-3 h-3 mr-1" />
                {isRecording ? "Recording..." : "Ready"}
              </Badge>
            </div>

            <Button
              onClick={handleVoiceInput}
              className={`w-full ${isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-gradient-to-r from-primary to-accent"}`}
              size="lg"
            >
              <Mic className={`w-4 h-4 mr-2 ${isRecording && "animate-pulse"}`} />
              {isRecording ? "Stop Recording" : "Start Voice Input"}
            </Button>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Patient Name</label>
                <Input placeholder="Search patient..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Clinical Notes</label>
              <Textarea
                placeholder="Speak or type clinical observations..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button className="flex-1 bg-success hover:bg-success/90">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </Card>

        {/* Right: AI Analysis */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-accent animate-pulse" />
            <h3 className="text-lg font-semibold">AI Clinical Analysis</h3>
            {aiAnalysis && (
              <Badge className="bg-success text-success-foreground ml-auto">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {aiAnalysis.confidence}% Confidence
              </Badge>
            )}
          </div>

          {!aiAnalysis ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium mb-2">AI Medical Scribe Ready</p>
              <p className="text-sm">Start voice input to see real-time AI-powered clinical insights, diagnosis suggestions, and medication recommendations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Symptoms */}
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Identified Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.symptoms.map((symptom: string, i: number) => (
                    <Badge key={i} variant="outline">{symptom}</Badge>
                  ))}
                </div>
              </div>

              {/* Possible Diagnosis */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Suggested Diagnosis
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.possibleDiagnosis.map((diagnosis: string, i: number) => (
                    <Badge key={i} className="bg-primary text-primary-foreground">{diagnosis}</Badge>
                  ))}
                </div>
              </div>

              {/* Suggested Medications */}
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4 text-accent" />
                  AI Recommended Medications
                </h4>
                <div className="space-y-2">
                  {aiAnalysis.suggestedMedications.map((med: any, i: number) => (
                    <div key={i} className="flex items-start justify-between p-3 bg-background rounded border border-border">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{med.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{med.dosage}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{med.reason}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Tests */}
              <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  Recommended Tests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.recommendedTests.map((test: string, i: number) => (
                    <Badge key={i} variant="outline" className="border-warning text-warning">{test}</Badge>
                  ))}
                </div>
              </div>

              {/* Follow-up */}
              <div className="p-3 bg-success/5 rounded-lg border border-success/20 text-sm">
                <span className="font-semibold">Follow-up: </span>
                <span className="text-muted-foreground">{aiAnalysis.followUp}</span>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Add Medications</h3>
          <div className="space-y-2">
            {[
              "Paracetamol 500mg",
              "Amoxicillin 250mg",
              "Cough Syrup",
              "Ibuprofen 400mg",
              "Antibiotic Cream",
            ].map((med) => (
              <Button
                key={med}
                variant="outline"
                className="w-full justify-start"
                onClick={() => setPrescription(prev => prev + `\n${med} - `)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {med}
              </Button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Recent Prescriptions</h4>
            <div className="space-y-2">
              {[
                { patient: "Rajesh Kumar", date: "Jan 18" },
                { patient: "Priya Sharma", date: "Jan 17" },
                { patient: "Amit Patel", date: "Jan 15" },
              ].map((item) => (
                <div
                  key={item.patient}
                  className="p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <p className="font-medium text-sm">{item.patient}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Prescriptions;
