"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Zap } from "lucide-react";
import Link from "next/link";

export function DashboardContent({ user, profile, receptionistConfig }: any) {
  const isSetupComplete = !!receptionistConfig?.phone_number;

  return (
    <main className="flex-1 px-4">
      <div className="space-y-4">
        {/* Setup Status */}
        {!isSetupComplete && (
          <Card className="border-accent bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-foreground" />
                Get Started with Your AI Receptionist
              </CardTitle>
              <CardDescription>
                Complete the setup wizard to activate your receptionist in 5
                minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/setup">
                <Button className="btn-primary">Start Setup Wizard</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Total Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-text-tertiary mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Avg Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0m</div>
              <p className="text-xs text-text-tertiary mt-1">Per call</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0%</div>
              <p className="text-xs text-text-tertiary mt-1">AI responses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSetupComplete ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <span className="text-sm font-medium">
                  {isSetupComplete ? "Active" : "Inactive"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest calls and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-text-secondary">
              <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No calls yet. Start your setup to begin receiving calls.</p>
              {!isSetupComplete && (
                <Link href="/dashboard/setup">
                  <Button className="mt-4 btn-primary">Complete Setup</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
