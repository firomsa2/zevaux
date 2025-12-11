"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface CallLog {
  id: string;
  call_duration: number;
  call_status: string;
  sentiment: string;
  intent: string;
  created_at: string;
}

export function AnalyticsDashboard({ callLogs }: { callLogs: CallLog[] }) {
  const analytics = useMemo(() => {
    const totalCalls = callLogs.length;
    const completedCalls = callLogs.filter(
      (log) => log.call_status === "completed"
    ).length;
    const missedCalls = callLogs.filter(
      (log) => log.call_status === "missed"
    ).length;
    const avgDuration =
      totalCalls > 0
        ? Math.round(
            callLogs.reduce((sum, log) => sum + (log.call_duration || 0), 0) /
              totalCalls /
              60
          )
        : 0;

    // Call volume by day
    const callsByDay: Record<string, number> = {};
    callLogs.forEach((log) => {
      const day = format(new Date(log.created_at), "MMM dd");
      callsByDay[day] = (callsByDay[day] || 0) + 1;
    });

    const callVolumeData = Object.entries(callsByDay)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([day, count]) => ({ day, calls: count }));

    // Sentiment distribution
    const sentimentCounts: Record<string, number> = {};
    callLogs.forEach((log) => {
      const sentiment = log.sentiment || "Neutral";
      sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
    });

    const sentimentData = Object.entries(sentimentCounts).map(
      ([name, value]) => ({ name, value })
    );

    // Intent distribution
    const intentCounts: Record<string, number> = {};
    callLogs.forEach((log) => {
      const intent = log.intent || "Unknown";
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });

    const intentData = Object.entries(intentCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Status distribution
    const statusCounts: Record<string, number> = {};
    callLogs.forEach((log) => {
      const status = log.call_status || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalCalls,
      completedCalls,
      missedCalls,
      avgDuration,
      callVolumeData,
      sentimentData,
      intentData,
      statusData,
      successRate:
        totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0,
    };
  }, [callLogs]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalCalls}</div>
            <p className="text-xs text-text-tertiary mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.completedCalls}</div>
            <p className="text-xs text-text-tertiary mt-1">
              {analytics.successRate}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.avgDuration}m</div>
            <p className="text-xs text-text-tertiary mt-1">Per call</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Missed Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.missedCalls}</div>
            <p className="text-xs text-text-tertiary mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Call Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Call Volume</CardTitle>
            <CardDescription>Calls over time</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.callVolumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.callVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-text-tertiary">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Customer sentiment analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.sentimentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.sentimentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-text-tertiary">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call Status */}
        <Card>
          <CardHeader>
            <CardTitle>Call Status</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-text-tertiary">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Intents */}
        <Card>
          <CardHeader>
            <CardTitle>Top Call Intents</CardTitle>
            <CardDescription>Most common reasons for calls</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.intentData.length > 0 ? (
              <div className="space-y-4">
                {analytics.intentData.map((intent, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{intent.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-surface rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{
                            width: `${
                              (intent.value /
                                Math.max(
                                  ...analytics.intentData.map((i) => i.value)
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-text-tertiary w-8 text-right">
                        {intent.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-tertiary">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
