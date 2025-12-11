"use client";

import { SMSStatus, SMSMode, SMSFilters } from "@/types/sms";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SMSFiltersProps {
  filters: SMSFilters;
  onFiltersChange: (filters: SMSFilters) => void;
  onClearFilters: () => void;
}

export function SMSFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: SMSFiltersProps) {
  const statusOptions: { value: SMSStatus | "all"; label: string }[] = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "sent", label: "Sent" },
    { value: "failed", label: "Failed" },
    { value: "retry", label: "Retry" },
  ];

  const modeOptions: { value: SMSMode | "all"; label: string }[] = [
    { value: "all", label: "All Modes" },
    { value: "fully_ai", label: "Fully AI" },
    { value: "hybrid", label: "Hybrid" },
    { value: "manual", label: "Manual" },
  ];

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.mode !== "all" ||
    filters.dateRange?.from ||
    filters.dateRange?.to;

  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value: SMSStatus | "all") =>
              onFiltersChange({ ...filters, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mode Filter */}
        <div className="space-y-2">
          <Label htmlFor="mode-filter">Mode</Label>
          <Select
            value={filters.mode || "all"}
            onValueChange={(value: SMSMode | "all") =>
              onFiltersChange({ ...filters, mode: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={{
                  from: filters.dateRange?.from || undefined,
                  to: filters.dateRange?.to || undefined,
                }}
                onSelect={(range) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: {
                      from: range?.from || null,
                      to: range?.to || null,
                    },
                  })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
