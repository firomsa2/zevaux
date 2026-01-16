"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Phone,
  BarChart3,
  Settings,
  BookOpen,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";

interface PostOnboardingCelebrationProps {
  businessName: string;
  phoneNumber: string;
  onDismiss?: () => void;
}

export function PostOnboardingCelebration({
  businessName,
  phoneNumber,
  onDismiss,
}: PostOnboardingCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [particles, setParticles] = useState<any[]>([]);

  // CHANGED: Add celebration animation effect
  useEffect(() => {
    setParticles(
      Array.from({ length: 50 }).map(() => ({
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${Math.random() * 3 + 2}s`,
      }))
    );
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const nextSteps = [
    {
      icon: BarChart3,
      title: "Monitor Performance",
      description: "Track calls, duration, and success rates in real-time",
      href: "/dashboard/analytics",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Settings,
      title: "Configure Settings",
      description: "Customize your receptionist's behavior and responses",
      href: "/dashboard/receptionist/configure",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      icon: BookOpen,
      title: "Explore Knowledge Base",
      description: "Upload documents to train your AI receptionist",
      href: "/dashboard/knowledge-base",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      icon: Users,
      title: "Invite Team Members",
      description: "Add collaborators to manage your account",
      href: "/dashboard/team",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  return (
    <>
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {particles.map((style, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-bounce"
              style={{
                ...style,
                top: "-10px",
              }}
            />
          ))}
          <style>{`
            @keyframes fall {
              to {
                transform: translateY(100vh) translateX(${
                  Math.random() * 100 - 50
                }px);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      <Card className="border-2 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <div className="relative">
          {/* Dismiss button */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}

          <CardHeader className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-50"></div>
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 relative" />
              </div>
              <div className="flex-1 pr-8">
                <CardTitle className="text-2xl mb-2">
                  Congratulations! You're Live
                </CardTitle>
                <p className="text-base text-green-900 dark:text-green-200">
                  Your AI receptionist is now active and ready to receive calls
                  on{" "}
                  <span className="font-mono font-semibold">{phoneNumber}</span>
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Key Details */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-lg bg-white dark:bg-slate-900/50 border border-green-100 dark:border-green-900/50 p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Business Name
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {businessName}
                </p>
              </div>
              <div className="rounded-lg bg-white dark:bg-slate-900/50 border border-green-100 dark:border-green-900/50 p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    Active
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-white dark:bg-slate-900/50 border border-green-100 dark:border-green-900/50 p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Phone Number
                </p>
                <p className="text-lg font-mono font-semibold text-slate-900 dark:text-white truncate">
                  {phoneNumber}
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  What's Next?
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {nextSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <Link key={step.href} href={step.href}>
                      <div
                        className={`${step.bgColor} border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer group h-full`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Icon className={`h-5 w-5 ${step.color}`} />
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-green-200 dark:border-green-900/50">
              <Link href="/dashboard/calls" className="flex-1">
                <Button
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <Phone className="h-4 w-4" />
                  View Call Logs
                </Button>
              </Link>
              <Link href="/dashboard/receptionist/configure" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                >
                  <Settings className="h-4 w-4" />
                  Configure
                </Button>
              </Link>
            </div>

            {/* Tips */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                Quick Tips
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>
                  ✓ Test your receptionist by calling{" "}
                  <span className="font-mono">{phoneNumber}</span>
                </li>
                <li>✓ Add your knowledge base to improve responses</li>
                <li>✓ Set up call forwarding and escalation numbers</li>
                <li>✓ Invite team members to collaborate</li>
              </ul>
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  );
}
