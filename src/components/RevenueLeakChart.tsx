import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, TrendingUp, IndianRupee } from "lucide-react";

const revenueLeakData = [
  {
    category: "Missing Insurer Codes",
    lost: 45000,
    recovered: 38000,
    percentage: 84,
    color: "hsl(var(--destructive))"
  },
  {
    category: "Incomplete Documentation",
    lost: 32000,
    recovered: 24000,
    percentage: 75,
    color: "hsl(var(--warning))"
  },
  {
    category: "Missed Upsells",
    lost: 28000,
    recovered: 22000,
    percentage: 79,
    color: "hsl(var(--primary))"
  },
  {
    category: "Claim Rejections",
    lost: 38000,
    recovered: 31000,
    percentage: 82,
    color: "hsl(var(--accent))"
  }
];

export const RevenueLeakChart = () => {
  const totalLost = revenueLeakData.reduce((sum, item) => sum + item.lost, 0);
  const totalRecovered = revenueLeakData.reduce((sum, item) => sum + item.recovered, 0);
  const recoveryRate = Math.round((totalRecovered / totalLost) * 100);

  return (
    <Card className="p-6 border-2 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              Revenue Leak Analysis
              <Badge className="bg-warning text-warning-foreground">AI INSIGHTS</Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-detected revenue opportunities and recovery tracking
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Recovery Rate</p>
            <p className="text-2xl font-bold text-success">{recoveryRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Revenue at Risk</span>
            </div>
            <p className="text-xl font-bold text-destructive">
              ₹{(totalLost / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </div>

          <div className="p-4 bg-success/10 rounded-lg border border-success/30">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">AI Recovered</span>
            </div>
            <p className="text-xl font-bold text-success">
              ₹{(totalRecovered / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-muted-foreground mt-1">Optimized</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueLeakData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `₹${value/1000}K`}
            />
            <YAxis
              dataKey="category"
              type="category"
              width={150}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px"
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
            />
            <Bar dataKey="lost" fill="hsl(var(--destructive))" name="Lost" opacity={0.3} />
            <Bar dataKey="recovered" name="Recovered" radius={[0, 4, 4, 0]}>
              {revenueLeakData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Top Recovery Opportunities</h4>
          {revenueLeakData
            .sort((a, b) => (b.lost - b.recovered) - (a.lost - a.recovered))
            .slice(0, 2)
            .map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.category}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{(item.lost - item.recovered).toLocaleString()} potential recovery
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.percentage}% saved
                </Badge>
              </div>
            ))}
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <IndianRupee className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-primary">Projected Annual Impact</p>
              <p className="text-xs text-muted-foreground mt-1">
                With AI Revenue Optimizer: <strong className="text-success">+₹{((totalRecovered * 12) / 1000).toFixed(0)}K/year</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                ROI: {Math.round(((totalRecovered / totalLost) * 100))}% improvement in claim success rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
