"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Phone } from "lucide-react";
import { format } from "date-fns";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface CallLog {
  id: string;
  caller_id: string;
  caller_name: string;
  call_duration: number;
  call_status: string;
  transcript: string;
  summary: string;
  sentiment: string;
  intent: string;
  created_at: string;
}

export function CallLogsTable({
  initialData,
  userId,
}: {
  initialData: CallLog[];
  userId: string;
}) {
  console.log("🚀 ~ CallLogsTable ~ initialData:", initialData);
  console.log("🚀 ~ CallLogsTable ~ userId:", userId);

  const [callLogs, setCallLogs] = useState<CallLog[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<CallLog[]>(initialData);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        console.log("No user is logged in.");
      } else {
        setUser(data?.user);
      }
    }
    getUser();
  }, []);

  console.log("user", user);

  useEffect(() => {
    const supabase = createClient();
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`calls:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calls",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCallLogs((prev) => [payload.new as CallLog, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setCallLogs((prev) =>
              prev.map((log) =>
                log.id === payload.new.id ? (payload.new as CallLog) : log
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    const filtered = callLogs.filter(
      (log) =>
        log.caller_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.caller_id?.includes(searchTerm) ||
        log.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [searchTerm, callLogs]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "neutral":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "missed":
        return "bg-red-100 text-red-800";
      case "voicemail":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-text-tertiary" />
              <Input
                placeholder="Search by caller name, number, or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>Showing {filteredLogs.length} calls</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-text-secondary">
                No calls yet. Your calls will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Caller</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="hover:bg-surface cursor-pointer"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {log.caller_name || "Unknown"}
                          </p>
                          <p className="text-xs text-text-tertiary">
                            {log.caller_id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.call_duration
                          ? `${Math.round(log.call_duration / 60)}m`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.call_status)}>
                          {log.call_status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSentimentColor(log.sentiment)}>
                          {log.sentiment || "Neutral"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.intent || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-text-tertiary">
                        {format(new Date(log.created_at), "MMM dd, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
