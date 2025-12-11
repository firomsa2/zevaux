"use client";

import { SMSStats } from "@/types/sms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, Send, AlertCircle } from "lucide-react";

interface SMSStatsProps {
  stats: SMSStats;
}

export function SMSStats({ stats }: SMSStatsProps) {
  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Draft",
      value: stats.draft,
      icon: FileText,
      color: "text-gray-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Sent",
      value: stats.sent,
      icon: Send,
      color: "text-blue-600",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
