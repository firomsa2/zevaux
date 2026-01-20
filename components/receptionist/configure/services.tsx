"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  CardFooter,
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
  Edit2,
  X,
  Check,
  MoreVertical,
  Users,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Eye,
  EyeOff,
  ArrowUpDown,
  Copy,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { toast, notify } from "@/lib/toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ReceptionistProgressWrapper } from "@/components/onboarding/receptionist-progress-wrapper";
import { triggerOnboardingRefresh } from "@/utils/onboarding-refresh";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes?: number;
  price?: number;
  requiresAppointment: boolean;
  maxParticipants?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BusinessConfig {
  services?: Service[];
  [key: string]: any; // Allow other config fields
}

interface ServiceOperation {
  type: "create" | "update" | "delete";
  service: Service;
  timestamp: number;
}

const DURATION_OPTIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
];

type SortField = "name" | "duration" | "price" | "createdAt";
type SortDirection = "asc" | "desc";

export default function ServicesManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [activeTab, setActiveTab] = useState<"list" | "grid">("list");
  const [showInactive, setShowInactive] = useState(false);

  // Operations queue for batch processing
  const [operationsQueue, setOperationsQueue] = useState<ServiceOperation[]>(
    [],
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [originalServices, setOriginalServices] = useState<Service[]>([]);

  const supabase = createClient();

  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    description: "",
    durationMinutes: undefined,
    price: undefined,
    requiresAppointment: true,
    maxParticipants: undefined,
    isActive: true,
  });

  // Fetch business data and services
  useEffect(() => {
    fetchBusinessData();
  }, []);

  // Track changes to enable save button
  useEffect(() => {
    const hasChanges =
      JSON.stringify(services) !== JSON.stringify(originalServices);
    setIsDirty(hasChanges);
  }, [services, originalServices]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("No user found");

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("business_id")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;
      if (!userData?.business_id) throw new Error("No business found");

      setBusinessId(userData.business_id);

      const { data: configRes, error: configError } = await supabase
        .from("business_configs")
        .select("config")
        .eq("business_id", userData.business_id)
        .single();

      if (configError) {
        if (configError.code === "PGRST116") {
          // No config exists yet, create one
          await createInitialConfig(userData.business_id);
          setServices([]);
          setOriginalServices([]);
          return;
        }
        throw configError;
      }

      const config: BusinessConfig = configRes.config || {};
      const storedServices: Service[] = config.services || [];

      // Transform stored services to ensure proper format
      const formattedServices = storedServices.map((service: any, index) => {
        // Handle both old format (duration string) and new format (durationMinutes number)
        let durationMinutes: number | undefined;
        if (service.durationMinutes != null) {
          durationMinutes =
            typeof service.durationMinutes === "number"
              ? service.durationMinutes
              : parseDurationString(service.durationMinutes);
        } else if (service.duration != null) {
          durationMinutes = parseDurationString(service.duration);
        }

        // Handle price which might be stored as string or number
        let price: number | undefined;
        if (service.price != null && service.price !== "") {
          const parsedPrice =
            typeof service.price === "number"
              ? service.price
              : parseFloat(service.price);
          if (!isNaN(parsedPrice)) {
            price = parsedPrice;
          }
        }

        return {
          id: service.id || `service-${index + 1}`,
          name: service.name || "",
          description: service.description || "",
          durationMinutes,
          price,
          requiresAppointment: service.requiresAppointment !== false,
          maxParticipants: service.maxParticipants,
          notes: service.notes,
          isActive: service.isActive !== false,
          createdAt: service.createdAt || new Date().toISOString(),
          updatedAt: service.updatedAt || new Date().toISOString(),
        };
      });

      setServices(formattedServices);
      setOriginalServices([...formattedServices]); // Deep copy for comparison
    } catch (err: any) {
      console.error("Failed to fetch services:", err);
      setError(err.message || "Failed to load services");
      toast.error("Failed to load services", {
        description: "Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInitialConfig = async (businessId: string) => {
    try {
      const { error } = await supabase.from("business_configs").insert({
        business_id: businessId,
        config: { services: [] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Failed to create initial config:", error);
    }
  };

  // Add a new service (optimistic update)
  const handleAddService = () => {
    if (!newService.name?.trim()) {
      toast.error("Service name is required");
      return;
    }

    const serviceId = `service-${Date.now()}`;
    const now = new Date().toISOString();

    const serviceData: Service = {
      id: serviceId,
      name: newService.name!,
      description: newService.description || "",
      durationMinutes: newService.durationMinutes,
      price: newService.price,
      requiresAppointment: newService.requiresAppointment !== false,
      maxParticipants: newService.maxParticipants,
      notes: newService.notes,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    // Optimistic update
    setServices((prev) => [serviceData, ...prev]);

    // Add to operations queue
    setOperationsQueue((prev) => [
      ...prev,
      {
        type: "create",
        service: serviceData,
        timestamp: Date.now(),
      },
    ]);

    setHasUnsavedChanges(true);

    // Reset form
    setNewService({
      name: "",
      description: "",
      durationMinutes: undefined,
      price: undefined,
      requiresAppointment: true,
      maxParticipants: undefined,
      isActive: true,
    });

    setShowAddForm(false);

    toast.success(`${serviceData.name} added`, {
      description: "Click Save Changes to persist.",
    });
  };

  // Update an existing service
  const handleUpdateService = () => {
    if (!editingService || !editingService.name.trim()) {
      toast.error("Service name is required");
      return;
    }

    const updatedService = {
      ...editingService,
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    setServices((prev) =>
      prev.map((service) =>
        service.id === editingService.id ? updatedService : service,
      ),
    );

    // Add to operations queue
    setOperationsQueue((prev) => [
      ...prev,
      {
        type: "update",
        service: updatedService,
        timestamp: Date.now(),
      },
    ]);

    setHasUnsavedChanges(true);
    setEditingService(null);

    toast.success(`${updatedService.name} updated`, {
      description: "Click Save Changes to persist.",
    });
  };

  // Delete a service
  const handleDeleteService = (id: string) => {
    const serviceToDelete = services.find((s) => s.id === id);
    if (!serviceToDelete) return;

    // Optimistic update
    setServices((prev) => prev.filter((service) => service.id !== id));

    // Add to operations queue
    setOperationsQueue((prev) => [
      ...prev,
      {
        type: "delete",
        service: serviceToDelete,
        timestamp: Date.now(),
      },
    ]);

    setHasUnsavedChanges(true);
    setServiceToDelete(null);

    toast.success(`${serviceToDelete.name} deleted`, {
      description: "Click Save Changes to persist.",
    });
  };

  // Duplicate a service
  const duplicateService = (service: Service) => {
    const duplicatedService: Service = {
      ...service,
      id: `service-${Date.now()}`,
      name: `${service.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    setServices((prev) => [duplicatedService, ...prev]);

    // Add to operations queue
    setOperationsQueue((prev) => [
      ...prev,
      {
        type: "create",
        service: duplicatedService,
        timestamp: Date.now(),
      },
    ]);

    setHasUnsavedChanges(true);

    toast.success(`${service.name} duplicated`, {
      description: "Click Save Changes to persist.",
    });
  };

  // Toggle service status
  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id === id) {
          const updatedService = {
            ...service,
            isActive: !service.isActive,
            updatedAt: new Date().toISOString(),
          };

          // Add to operations queue
          setOperationsQueue((prevQueue) => [
            ...prevQueue,
            {
              type: "update",
              service: updatedService,
              timestamp: Date.now(),
            },
          ]);

          setHasUnsavedChanges(true);
          return updatedService;
        }
        return service;
      }),
    );
  };

  // Save all changes to database
  const saveChanges = async () => {
    if (!businessId) {
      toast.error("No business ID found");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Get current config from database
      const { data: existingConfig, error: fetchError } = await supabase
        .from("business_configs")
        .select("config")
        .eq("business_id", businessId)
        .single();

      if (fetchError) throw fetchError;

      const currentConfig: BusinessConfig = existingConfig?.config || {};

      // Update only the services field while preserving other config
      const updatedConfig = {
        ...currentConfig,
        services: services.map((service) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          durationMinutes: service.durationMinutes,
          price: service.price,
          requiresAppointment: service.requiresAppointment,
          maxParticipants: service.maxParticipants,
          notes: service.notes,
          isActive: service.isActive,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        })),
      };

      // Update database
      const { error: updateError } = await supabase
        .from("business_configs")
        .update({
          config: updatedConfig,
          updated_at: new Date().toISOString(),
        })
        .eq("business_id", businessId);

      if (updateError) throw updateError;

      // Clear operations queue and update original state
      setOperationsQueue([]);
      setOriginalServices([...services]);
      setHasUnsavedChanges(false);
      setIsDirty(false);

      // Update prompt if needed
      try {
        await supabase.rpc("update_business_prompt_trigger", {
          p_business_id: businessId,
        });
      } catch (promptError) {
        console.warn("Prompt update failed:", promptError);
      }

      notify.crud.saveSuccess();

      triggerOnboardingRefresh();
    } catch (err: any) {
      console.error("Failed to save changes:", err);
      setError(err.message);

      // Revert to original state on error
      setServices([...originalServices]);
      setOperationsQueue([]);

      notify.crud.saveError("Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Discard all local changes
  const discardChanges = () => {
    setServices([...originalServices]);
    setOperationsQueue([]);
    setHasUnsavedChanges(false);
    setIsDirty(false);

    toast.info("Changes discarded", {
      description: "All local changes have been reverted.",
    });
  };

  // Process individual operation (for real-time updates if needed)
  const processOperation = async (operation: ServiceOperation) => {
    if (!businessId) return;

    try {
      // Get current config
      const { data: existingConfig } = await supabase
        .from("business_configs")
        .select("config")
        .eq("business_id", businessId)
        .single();

      const currentConfig: BusinessConfig = existingConfig?.config || {};
      const currentServices: Service[] = currentConfig.services || [];

      let updatedServices: Service[];

      switch (operation.type) {
        case "create":
          updatedServices = [operation.service, ...currentServices];
          break;
        case "update":
          updatedServices = currentServices.map((s) =>
            s.id === operation.service.id ? operation.service : s,
          );
          break;
        case "delete":
          updatedServices = currentServices.filter(
            (s) => s.id !== operation.service.id,
          );
          break;
        default:
          updatedServices = currentServices;
      }

      const updatedConfig = {
        ...currentConfig,
        services: updatedServices,
      };

      await supabase
        .from("business_configs")
        .update({
          config: updatedConfig,
          updated_at: new Date().toISOString(),
        })
        .eq("business_id", businessId);
    } catch (error) {
      console.error("Failed to process operation:", error);
      throw error;
    }
  };

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        if (!showInactive && !service.isActive) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            service.name.toLowerCase().includes(query) ||
            service.description.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortField === "price") {
          aValue = a.price ?? 0;
          bValue = b.price ?? 0;
        } else if (sortField === "duration") {
          aValue = a.durationMinutes ?? 0;
          bValue = b.durationMinutes ?? 0;
        } else {
          aValue = a[sortField];
          bValue = b[sortField];
        }

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [services, searchQuery, showInactive, sortField, sortDirection]);

  // Helper function to parse duration string to minutes
  const parseDurationString = (
    duration: string | number | null | undefined
  ): number | undefined => {
    // If it's already a number, return it
    if (typeof duration === "number") return duration;
    if (!duration || typeof duration !== "string") return undefined;

    const trimmed = duration.trim().toLowerCase();
    if (!trimmed) return undefined;

    // Try to extract number from strings like "30 mins", "1 hour", etc.
    const numberMatch = trimmed.match(/(\d+(?:\.\d+)?)/);
    if (!numberMatch) return undefined;

    const value = parseFloat(numberMatch[1]);

    // Check for hour/hours
    if (trimmed.includes("hour")) {
      return Math.round(value * 60);
    }

    // Default to minutes (for "mins", "min", or just a number)
    return Math.round(value);
  };

  const formatDuration = (minutes?: number | null) => {
    if (minutes == null || minutes === 0) return "Not specified";
    if (minutes < 60) return `${minutes}m`;
    const hours = minutes / 60;
    return hours === 1 ? "1 hour" : `${hours} hours`;
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <ReceptionistProgressWrapper />

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Services Management
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage and organize your business services professionally
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <Badge
                  variant="outline"
                  className="animate-pulse bg-yellow-500/10 text-yellow-600"
                >
                  {operationsQueue.length} pending change
                  {operationsQueue.length !== 1 ? "s" : ""}
                </Badge>
              )}
              <Button
                onClick={() => setShowAddForm(true)}
                className="gap-2"
                size="lg"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Services
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{services.length}</h3>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Services
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {services.filter((s) => s.isActive).length}
                  </h3>
                </div>
                <Sparkles className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Duration
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {services.length > 0
                      ? formatDuration(
                          Math.round(
                            services.reduce(
                              (acc, s) => acc + s.durationMinutes,
                              0,
                            ) / services.length,
                          ),
                        )
                      : "0m"}
                  </h3>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Appointment Only
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {services.filter((s) => s.requiresAppointment).length}
                  </h3>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Filters and Controls */}
        <Card>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDirection =
                      sortDirection === "asc" ? "desc" : "asc";
                    setSortDirection(newDirection);
                  }}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort {sortDirection === "asc" ? "A-Z" : "Z-A"}
                </Button>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showInactive}
                    onCheckedChange={setShowInactive}
                  />
                  <span className="text-sm">Show Inactive</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchBusinessData}
                  className="h-9 w-9 p-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services List/Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Services ({filteredServices.length})
                {hasUnsavedChanges && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-yellow-500/10 text-yellow-600"
                  >
                    Unsaved
                  </Badge>
                )}
              </h2>
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "list" | "grid")}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {filteredServices.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No services found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "No services match your search"
                      : "Add your first service to get started"}
                  </p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </CardContent>
              </Card>
            ) : activeTab === "list" ? (
              <div className="space-y-3">
                {filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className={`transition-all hover:shadow-md ${
                      !service.isActive ? "opacity-60" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold truncate">
                              {service.name}
                            </h3>
                            {!service.isActive && (
                              <Badge variant="outline" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                            {service.requiresAppointment && (
                              <Badge variant="secondary" className="text-xs">
                                Appointment Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {service.durationMinutes != null && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {formatDuration(service.durationMinutes)}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Duration</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {service.price && service?.price !== undefined && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span>${service.price}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Price</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {service.maxParticipants && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>Max {service.maxParticipants}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Maximum participants</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleServiceStatus(service.id)}
                                className="h-8 w-8 p-0"
                              >
                                {service.isActive ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {service.isActive
                                  ? "Make inactive"
                                  : "Make active"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingService(service)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit service</p>
                            </TooltipContent>
                          </Tooltip>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => duplicateService(service)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setEditingService(service)}
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setServiceToDelete(service.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className={`h-full transition-all hover:shadow-lg ${
                      !service.isActive ? "opacity-60" : ""
                    }`}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {service.name}
                          </h3>
                          <Badge
                            variant={service.isActive ? "default" : "outline"}
                            className="text-xs"
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {service.description}
                        </p>
                      </div>
                      <div className="space-y-3 mt-auto">
                        <div className="flex items-center justify-between text-sm">
                          {service.durationMinutes != null ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatDuration(service.durationMinutes)}
                              </span>
                            </div>
                          ) : (
                            <div />
                          )}
                          {service.price !== undefined && (
                            <div className="flex items-center gap-1 font-medium">
                              <DollarSign className="h-3 w-3" />
                              <span>${service.price}</span>
                            </div>
                          )}
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingService(service)}
                              className="h-8"
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleServiceStatus(service.id)}
                              className="h-8 w-8 p-0"
                            >
                              {service.isActive ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <EyeOff className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setServiceToDelete(service.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Save Changes Button */}
        {isDirty && (
          <div className="sticky bottom-6 z-10">
            <Card className="shadow-lg border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      You have unsaved changes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {operationsQueue.length} change
                      {operationsQueue.length !== 1 ? "s" : ""} pending
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={discardChanges}
                      disabled={saving}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Discard
                    </Button>
                    <Button
                      onClick={saveChanges}
                      disabled={saving}
                      size="lg"
                      className="gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save All Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Service Dialog */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="sm:max-w-[500px] max-h-[100vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Service
              </DialogTitle>
              <DialogDescription>
                Add a new service to your offerings. Changes will be saved
                locally until you click "Save All Changes".
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <div className="space-y-2">
                <Label>Service Name *</Label>
                <Input
                  value={newService.name}
                  onChange={(e) =>
                    setNewService((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Professional Consultation"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newService.description}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Briefly describe the service..."
                  className="min-h-15"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Duration (Optional)</Label>
                  <Select
                    value={
                      newService.durationMinutes?.toString() || "none"
                    }
                    onValueChange={(value) =>
                      setNewService((prev) => ({
                        ...prev,
                        durationMinutes:
                          value === "none" ? undefined : parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {DURATION_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
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
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Max Participants</Label>
                  <Input
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
                <div className="space-y-2">
                  <Label>Appointment Required</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch
                      checked={newService.requiresAppointment}
                      onCheckedChange={(value) =>
                        setNewService((prev) => ({
                          ...prev,
                          requiresAppointment: value,
                        }))
                      }
                    />
                    <span className="text-sm">
                      {newService.requiresAppointment ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Internal Notes</Label>
                <Textarea
                  value={newService.notes || ""}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Optional internal notes..."
                  className="min-h-15"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddService}
                disabled={!newService.name?.trim()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog
          open={!!editingService}
          onOpenChange={(open) => !open && setEditingService(null)}
        >
          <DialogContent className="sm:max-w-[500px] max-h-[100vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5" />
                Edit Service
              </DialogTitle>
              <DialogDescription>
                Update the service details below. Changes will be saved locally
                until you click "Save All Changes".
              </DialogDescription>
            </DialogHeader>
            {editingService && (
              <div className="space-y-2 py-2">
                <div className="space-y-2">
                  <Label>Service Name *</Label>
                  <Input
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editingService.description}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        description: e.target.value,
                      })
                    }
                    className="min-h-15"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Duration (Optional)</Label>
                    <Select
                      value={
                        editingService.durationMinutes?.toString() || "none"
                      }
                      onValueChange={(value) =>
                        setEditingService({
                          ...editingService,
                          durationMinutes:
                            value === "none" ? undefined : parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {DURATION_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingService.price || ""}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          price: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Max Participants</Label>
                    <Input
                      type="number"
                      min="1"
                      value={editingService.maxParticipants || ""}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          maxParticipants: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center gap-2 pt-2">
                      <Switch
                        checked={editingService.isActive}
                        onCheckedChange={(value) =>
                          setEditingService({
                            ...editingService,
                            isActive: value,
                          })
                        }
                      />
                      <span className="text-sm">
                        {editingService.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Internal Notes</Label>
                  <Textarea
                    value={editingService.notes || ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Add internal notes..."
                    className="min-h-15"
                  />
                </div>
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <Label className="text-sm">Appointment Required</Label>
                    <p className="text-xs text-muted-foreground">
                      Customers must book in advance
                    </p>
                  </div>
                  <Switch
                    checked={editingService.requiresAppointment}
                    onCheckedChange={(value) =>
                      setEditingService({
                        ...editingService,
                        requiresAppointment: value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingService(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateService}
                disabled={!editingService?.name?.trim()}
              >
                <Save className="mr-2 h-4 w-4" />
                Update Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!serviceToDelete}
          onOpenChange={(open) => !open && setServiceToDelete(null)}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Delete Service
              </DialogTitle>
              <DialogDescription>
                This action will delete the service from your local changes.
                Click "Delete Service" to confirm.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setServiceToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  serviceToDelete && handleDeleteService(serviceToDelete)
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
