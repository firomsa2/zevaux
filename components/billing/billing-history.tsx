"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Business } from "@/types/database";

interface BillingHistoryProps {
  business?: Business;
  invoices?: any[];
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  description: string;
  url?: string;
}

export function BillingHistory({
  business,
  invoices: initialInvoices,
}: BillingHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (initialInvoices) {
      return initialInvoices.map((inv) => ({
        id: inv.invoice_number || inv.stripe_invoice_id || inv.id,
        date: new Date(inv.created_at || inv.date).toLocaleDateString(),
        amount: inv.amount,
        status: inv.status,
        description: inv.description || "Monthly Subscription",
        url: inv.invoice_pdf || inv.url,
      }));
    }
    return [];
  });
  const [loading, setLoading] = useState(!initialInvoices);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialInvoices || !business) return;

    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          `/api/stripe/invoices?businessId=${business.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setInvoices(data.invoices || []);
        } else {
          setError("Failed to load invoices");
        }
      } catch (err) {
        console.error("Failed to load invoices:", err);
        setError("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [business?.id, initialInvoices]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>Your past invoices and payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-950/20 p-3">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>
              No invoices yet. Your first invoice will appear after your trial
              ends.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">
                      {invoice.id}
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell className="font-semibold">
                      ${(invoice.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
                            : invoice.status === "open"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
                        }
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
