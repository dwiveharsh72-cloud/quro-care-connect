import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, Users, IndianRupee, Activity } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { RevenueLeakChart } from "@/components/RevenueLeakChart";

const weeklyData = [
  { day: "Mon", patients: 45, revenue: 32000 },
  { day: "Tue", patients: 52, revenue: 41000 },
  { day: "Wed", patients: 48, revenue: 36000 },
  { day: "Thu", patients: 61, revenue: 48000 },
  { day: "Fri", patients: 55, revenue: 43000 },
  { day: "Sat", patients: 38, revenue: 28000 },
];

const monthlyTrends = [
  { month: "Jul", patients: 920, revenue: 680000 },
  { month: "Aug", patients: 1050, revenue: 780000 },
  { month: "Sep", patients: 980, revenue: 720000 },
  { month: "Oct", patients: 1150, revenue: 850000 },
  { month: "Nov", patients: 1220, revenue: 920000 },
  { month: "Dec", patients: 1100, revenue: 810000 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">Comprehensive clinic performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients (Month)"
          value="1,220"
          change="+18% from last month"
          changeType="positive"
          icon={Users}
          iconColor="text-primary"
        />
        <StatCard
          title="Monthly Revenue"
          value="₹9.2L"
          change="+12% from last month"
          changeType="positive"
          icon={IndianRupee}
          iconColor="text-success"
        />
        <StatCard
          title="Avg Daily Patients"
          value="52"
          change="+5 from average"
          changeType="positive"
          icon={Activity}
          iconColor="text-accent"
        />
        <StatCard
          title="Growth Rate"
          value="18%"
          change="Month over month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Legend />
              <Bar dataKey="patients" fill="hsl(var(--primary))" name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trends (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `₹${value/1000}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--success))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--success))", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueLeakChart />

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">AI Performance Metrics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Prescriptions Optimized</span>
                <span className="text-2xl font-bold text-primary">847</span>
              </div>
              <p className="text-xs text-muted-foreground">This month • +32% from last month</p>
            </div>

            <div className="p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Drug Interactions Caught</span>
                <span className="text-2xl font-bold text-success">127</span>
              </div>
              <p className="text-xs text-muted-foreground">Prevented potential adverse events</p>
            </div>

            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Avg Claim Success Rate</span>
                <span className="text-2xl font-bold text-accent">89%</span>
              </div>
              <p className="text-xs text-muted-foreground">+18% improvement with AI</p>
            </div>

            <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Revenue per Prescription</span>
                <span className="text-2xl font-bold text-warning">₹1,840</span>
              </div>
              <p className="text-xs text-muted-foreground">+₹320 with smart upselling</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Metrics</h3>
          <div className="space-y-4">
            {[
              { label: "Peak Hours", value: "10 AM - 12 PM", trend: "+15%" },
              { label: "Top Doctor", value: "Dr. Suresh Menon", trend: "62 patients" },
              { label: "Avg Consultation", value: "18 mins", trend: "Optimal" },
              { label: "Patient Retention", value: "87%", trend: "+5%" },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="font-semibold">{metric.value}</p>
                </div>
                <span className="text-sm font-medium text-success">{metric.trend}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Monthly Patient Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyTrends} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="patients" fill="hsl(var(--accent))" name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
