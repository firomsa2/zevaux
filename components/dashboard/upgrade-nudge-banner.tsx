'use client';

import { AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Plan } from '@/types/database';

interface UpgradeNudgeBannerProps {
  minutesUsed: number;
  minutesLimit: number;
  usagePercentage: number;
  plan?: Plan | null;
}

export function UpgradeNudgeBanner({
  minutesUsed,
  minutesLimit,
  usagePercentage,
  plan,
}: UpgradeNudgeBannerProps) {
  // Don't show banner if under 70% usage
  if (usagePercentage < 70) {
    return null;
  }

  let bannerConfig = {
    title: '',
    description: '',
    ctaText: 'View Plans',
    icon: AlertCircle,
    bgColor: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-600',
  };

  if (usagePercentage >= 120) {
    // Over limit
    bannerConfig = {
      title: 'You\'ve Exceeded Your Monthly Minutes',
      description: `You're using ${minutesUsed} of ${minutesLimit} included minutes. Additional minutes cost $${plan && 'overage_rate' in plan ? (plan as any).overage_rate : 0.25}/min. Upgrade to get more included minutes.`,
      ctaText: 'Upgrade Plan Now',
      icon: AlertCircle,
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-900',
      iconColor: 'text-red-600',
    };
  } else if (usagePercentage >= 100) {
    // At limit
    bannerConfig = {
      title: 'You\'ve Used All Your Included Minutes',
      description: `You're at ${minutesUsed} of ${minutesLimit} minutes. Upgrade your plan to get more included minutes and reduce your per-minute costs.`,
      ctaText: 'Upgrade Plan Now',
      icon: AlertCircle,
      bgColor: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-900',
      iconColor: 'text-orange-600',
    };
  } else if (usagePercentage >= 90) {
    // 90% - Warning
    bannerConfig = {
      title: 'You\'re Running Low on Minutes',
      description: `${minutesLimit - minutesUsed} minutes remaining. Upgrade your plan to avoid overage charges next month.`,
      ctaText: 'Upgrade Plan',
      icon: TrendingUp,
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-900',
      iconColor: 'text-yellow-600',
    };
  } else {
    // 70-90% - Informational
    bannerConfig = {
      title: 'Consider Upgrading Your Plan',
      description: `You're using ${usagePercentage.toFixed(0)}% of your included minutes. Growing faster than expected? Upgrade for more minutes and save on overage costs.`,
      ctaText: 'View Plans',
      icon: Zap,
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600',
    };
  }

  const Icon = bannerConfig.icon;

  return (
    <div className={`border rounded-lg p-4 mb-6 ${bannerConfig.bgColor}`}>
      <div className="flex items-start gap-4">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${bannerConfig.iconColor}`} />
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${bannerConfig.textColor}`}>
            {bannerConfig.title}
          </h3>
          <p className={`text-sm mb-3 ${bannerConfig.textColor} opacity-90`}>
            {bannerConfig.description}
          </p>
          <Link href="/dashboard/billing">
            <Button size="sm" variant="outline">
              {bannerConfig.ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
