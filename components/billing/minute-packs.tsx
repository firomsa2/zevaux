'use client';

import { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  availableMinutePacks,
  type MinutePack,
} from '@/lib/minute-packs';

interface MinutePacksProps {
  onPurchaseClick?: (pack: MinutePack) => void;
  isLoading?: boolean;
}

export function MinutePacks({ onPurchaseClick, isLoading = false }: MinutePacksProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const handlePurchase = (pack: MinutePack) => {
    setSelectedPack(pack.id);
    onPurchaseClick?.(pack);
  };

  const pricePerMinute = (pack: MinutePack) => {
    return (pack.price / pack.minutes).toFixed(3);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Buy More Minutes</h3>
        <p className="text-muted-foreground">
          Need extra minutes this month? Purchase bonus minutes instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {availableMinutePacks.map((pack) => {
          const isSelected = selectedPack === pack.id;
          const isPopular = pack.minutes === 500; // Highlight the 500 minute pack

          return (
            <Card
              key={pack.id}
              className={`relative transition-all ${
                isPopular ? 'border-primary shadow-lg scale-105 lg:scale-100' : ''
              } ${isSelected ? 'ring-2 ring-primary' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  {pack.minutes.toLocaleString()}
                </CardTitle>
                <CardDescription>{pack.name}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div>
                  <div className="text-3xl font-bold">${pack.price}</div>
                  <p className="text-xs text-muted-foreground">
                    ${pricePerMinute(pack)}/min
                  </p>
                </div>

                {/* Savings badge */}
                {pack.savingsPercent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                    <p className="text-sm font-semibold text-green-700">
                      Save {pack.savingsPercent}%
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Valid for 30 days</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Use anytime</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>No contract</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handlePurchase(pack)}
                  disabled={isLoading}
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full"
                >
                  {isLoading && selectedPack === pack.id
                    ? 'Processing...'
                    : 'Purchase'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">How long do bonus minutes last?</h4>
            <p className="text-sm text-muted-foreground">
              Bonus minutes expire 30 days after purchase. Use them within that window.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">When should I buy bonus minutes?</h4>
            <p className="text-sm text-muted-foreground">
              Buy them when you&apos;re approaching your monthly limit and expect to exceed it. Overage minutes cost more per minute than bonus packs.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Can I refund unused minutes?</h4>
            <p className="text-sm text-muted-foreground">
              Minute packs are non-refundable. However, unused minutes carry over until they expire.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
