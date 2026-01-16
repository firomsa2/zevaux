"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Save,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ReceptionistProgressWrapper } from "@/components/onboarding/receptionist-progress-wrapper";
import { triggerOnboardingRefresh } from "@/utils/onboarding-refresh";

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price?: number;
  category: string;
  requiresAppointment: boolean;
  maxParticipants?: number;
  notes?: string;
}

const SERVICE_CATEGORIES = [
  "Hair Services",
  "Beauty Services",
  "Medical Services",
  "Consultation",
  "Treatment",
  "Procedure",
  "Class",
  "Workshop",
  "Maintenance",
  "Installation",
  "Repair",
  "Other",
];

const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
  { value: 300, label: "5 hours" },
  { value: 480, label: "8 hours" },
];

export default function ServicesForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Consultation",
      description: "Initial consultation session",
      durationMinutes: 30,
      category: "Consultation",
      requiresAppointment: true,
    },
  ]);

  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    description: "",
    durationMinutes: 30,
    category: "",
    requiresAppointment: true,
  });

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: userData } = await supabase
        .from("users")
        .select("business_id")
        .eq("id", user.id)
        .single();

      if (!userData?.business_id) throw new Error("No business found");
      setBusinessId(userData.business_id);

      const { data: configRes } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", userData.business_id)
        .single();

      if (configRes?.config?.services) {
        // Transform stored services to match our format
        const storedServices = configRes.config.services.map(
          (service: any, index: number) => ({
            id: (index + 1).toString(),
            name: service.name || "",
            description: service.description || "",
            durationMinutes: service.durationMinutes || 30,
            price: service.price,
            category: service.category || "",
            requiresAppointment: service.requiresAppointment !== false,
            maxParticipants: service.maxParticipants,
            notes: service.notes,
          })
        );
        setServices(storedServices);
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    if (!newService.name?.trim()) {
      toast({
        title: "Error",
        description: "Service name is required",
        variant: "destructive",
      });
      return;
    }

    const newServiceData: Service = {
      id: Date.now().toString(),
      name: newService.name!,
      description: newService.description || "",
      durationMinutes: newService.durationMinutes || 30,
      price: newService.price,
      category: newService.category || "",
      requiresAppointment: newService.requiresAppointment !== false,
      maxParticipants: newService.maxParticipants,
      notes: newService.notes,
    };

    setServices((prev) => [...prev, newServiceData]);

    // Reset form
    setNewService({
      name: "",
      description: "",
      durationMinutes: 30,
      category: "",
      requiresAppointment: true,
    });

    toast({
      title: "Success",
      description: "Service added",
      variant: "default",
    });
  };

  const updateService = (id: string, field: keyof Service, value: any) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const removeService = (id: string) => {
    if (services.length <= 1) {
      toast({
        title: "Error",
        description: "You must have at least one service",
        variant: "destructive",
      });
      return;
    }

    setServices((prev) => prev.filter((service) => service.id !== id));
    toast({
      title: "Success",
      description: "Service removed",
      variant: "default",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!businessId) throw new Error("No business ID found");

      // Get existing config
      const { data: existingConfig } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", businessId)
        .single();

      // Format services for storage
      const servicesForStorage = services.map((service) => ({
        name: service.name,
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: service.price,
        category: service.category,
        requiresAppointment: service.requiresAppointment,
        maxParticipants: service.maxParticipants,
        notes: service.notes,
      }));

      const configData = {
        business_id: businessId,
        config: {
          ...(existingConfig?.config || {}),
          services: servicesForStorage,
        },
        updated_at: new Date().toISOString(),
      };

      // Update config
      const { error: configError } = await supabase
        .from("business_configs")
        .upsert(configData, {
          onConflict: "business_id",
        });

      if (configError) throw configError;

      // Update prompt
      const { error: promptError } = await supabase.rpc(
        "update_business_prompt_trigger",
        { p_business_id: businessId }
      );

      if (promptError) {
        console.warn("Prompt update failed:", promptError);
      }

      toast({
        title: "Success",
        description: "Services saved successfully",
        variant: "default",
      });

      // Trigger onboarding progress refresh
      triggerOnboardingRefresh();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReceptionistProgressWrapper />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <p className="text-muted-foreground">
          Configure the services your business offers
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Add Service Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Service
            </CardTitle>
            <CardDescription>
              Add a new service that customers can book or inquire about
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input
                  id="serviceName"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Haircut, Consultation, Repair"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceCategory">Category</Label>
                <select
                  id="serviceCategory"
                  value={newService.category}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select a category</option>
                  {SERVICE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceDescription">Description</Label>
              <Textarea
                id="serviceDescription"
                value={newService.description}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe what this service includes..."
                className="min-h-20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceDuration">Duration</Label>
                <select
                  id="serviceDuration"
                  value={newService.durationMinutes}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      durationMinutes: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="servicePrice">Price ($)</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newService.price || ""}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      price: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={newService.maxParticipants || ""}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      maxParticipants: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="text-base">Requires Appointment</Label>
                <p className="text-sm text-muted-foreground">
                  Can customers book this service in advance?
                </p>
              </div>
              <Switch
                checked={newService.requiresAppointment !== false}
                onCheckedChange={(value) =>
                  setNewService((prev) => ({
                    ...prev,
                    requiresAppointment: value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={addService}
                disabled={!newService.name?.trim()}
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Your Services ({services.length})
            </CardTitle>
            <CardDescription>
              Manage and edit your business services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-lg">
                            {service.name}
                          </h4>
                          {service.category && (
                            <span className="px-2 py-1 text-xs bg-secondary rounded-full">
                              {service.category}
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{service.durationMinutes} minutes</span>
                      </div>
                      {service.price !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${service.price.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Appointment:{" "}
                        </span>
                        <span>
                          {service.requiresAppointment
                            ? "Required"
                            : "Not required"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Additional Options</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            value={service.notes || ""}
                            onChange={(e) =>
                              updateService(service.id, "notes", e.target.value)
                            }
                            placeholder="Additional notes..."
                            className="w-full px-3 py-1.5 text-sm border rounded"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Internal notes
                          </p>
                        </div>
                        <div>
                          <input
                            type="number"
                            min="1"
                            value={service.maxParticipants || ""}
                            onChange={(e) =>
                              updateService(
                                service.id,
                                "maxParticipants",
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            placeholder="Max participants"
                            className="w-full px-3 py-1.5 text-sm border rounded"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            For group services
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No services yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add services that customers can book or inquire about
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {services.length} service{services.length !== 1 ? "s" : ""}{" "}
            configured
          </div>
          <Button
            type="submit"
            disabled={saving || services.length === 0}
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Services
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
