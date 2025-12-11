"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Users,
  UserPlus,
  Mail,
  Phone,
  Shield,
  Trash2,
  Edit2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ROLES = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all settings",
  },
  {
    id: "manager",
    name: "Manager",
    description: "Can manage receptionist and view reports",
  },
  {
    id: "agent",
    name: "Agent",
    description: "Can handle escalated calls and view assigned calls",
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Can view reports and call logs only",
  },
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
  created_at: string;
}

export default function TeamMembersForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "agent",
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

      // In a real implementation, you would fetch team members from a dedicated table
      // For now, we'll simulate with mock data
      await loadTeamMembers();
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    // Mock team members - in real implementation, fetch from database
    const mockMembers: TeamMember[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john@example.com",
        phone: "+13015550123",
        role: "admin",
        status: "active",
        created_at: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+13015550124",
        role: "manager",
        status: "active",
        created_at: "2024-01-20T14:45:00Z",
      },
      {
        id: "3",
        name: "Mike Wilson",
        email: "mike@example.com",
        phone: "+13015550125",
        role: "agent",
        status: "active",
        created_at: "2024-02-05T09:15:00Z",
      },
    ];

    setTeamMembers(mockMembers);
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      // In a real implementation, this would create a user in your database
      // For now, we'll simulate adding a member
      const newMemberData: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        role: newMember.role,
        status: "active",
        created_at: new Date().toISOString(),
      };

      setTeamMembers((prev) => [...prev, newMemberData]);

      // Clear form and close dialog
      setNewMember({
        name: "",
        email: "",
        phone: "",
        role: "agent",
      });
      setShowAddDialog(false);

      toast({
        title: "Success",
        description: "Team member added successfully",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMember = async (member: TeamMember) => {
    setSaving(true);

    try {
      // In a real implementation, this would update the user in your database
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === member.id ? member : m))
      );

      setEditingMember(null);

      toast({
        title: "Success",
        description: "Team member updated successfully",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    setSaving(true);

    try {
      // In a real implementation, this would delete the user from your database
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));

      toast({
        title: "Success",
        description: "Team member removed successfully",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "agent":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleName = (roleId: string) => {
    const role = ROLES.find((r) => r.id === roleId);
    return role ? role.name : roleId;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage team members who can access your receptionist
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member to access your receptionist dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+13015550123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={saving || !newMember.name || !newMember.email}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Member"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members ({teamMembers.length})
          </CardTitle>
          <CardDescription>
            Manage access and permissions for your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      {member.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(member.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {getRoleName(member.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          member.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="capitalize">{member.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(member.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={editingMember?.id === member.id}
                        onOpenChange={(open) => !open && setEditingMember(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingMember(member)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Team Member</DialogTitle>
                            <DialogDescription>
                              Update team member information and permissions
                            </DialogDescription>
                          </DialogHeader>
                          {editingMember && (
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingMember.name}
                                  onChange={(e) =>
                                    setEditingMember((prev) =>
                                      prev
                                        ? { ...prev, name: e.target.value }
                                        : null
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-email">
                                  Email Address
                                </Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={editingMember.email}
                                  onChange={(e) =>
                                    setEditingMember((prev) =>
                                      prev
                                        ? { ...prev, email: e.target.value }
                                        : null
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-phone">Phone Number</Label>
                                <Input
                                  id="edit-phone"
                                  type="tel"
                                  value={editingMember.phone}
                                  onChange={(e) =>
                                    setEditingMember((prev) =>
                                      prev
                                        ? { ...prev, phone: e.target.value }
                                        : null
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <select
                                  id="edit-role"
                                  value={editingMember.role}
                                  onChange={(e) =>
                                    setEditingMember((prev) =>
                                      prev
                                        ? { ...prev, role: e.target.value }
                                        : null
                                    )
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                >
                                  {ROLES.map((role) => (
                                    <option key={role.id} value={role.id}>
                                      {role.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <select
                                  id="edit-status"
                                  value={editingMember.status}
                                  onChange={(e) =>
                                    setEditingMember((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            status: e.target.value as
                                              | "active"
                                              | "inactive",
                                          }
                                        : null
                                    )
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                >
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                </select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setEditingMember(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() =>
                                editingMember &&
                                handleUpdateMember(editingMember)
                              }
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {teamMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No team members yet</h3>
              <p className="text-muted-foreground mb-4">
                Add team members to help manage your receptionist
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Your First Team Member
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understand what each role can access and modify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLES.map((role) => (
              <div key={role.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{role.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                  <Badge className={getRoleBadgeColor(role.id)}>
                    {role.name.split(" ")[0]}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>View dashboard and reports</span>
                  </div>
                  {role.id === "viewer" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <span>Read-only access</span>
                    </div>
                  )}
                  {role.id === "agent" && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Handle escalated calls</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>View assigned calls</span>
                      </div>
                    </>
                  )}
                  {role.id === "manager" && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Manage receptionist settings</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>View all reports</span>
                      </div>
                    </>
                  )}
                  {role.id === "admin" && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Full system access</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Manage team members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Configure billing</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invitation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Team Members</CardTitle>
          <CardDescription>
            Send email invitations to team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Invitation Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={`https://app.zevaux.com/invite/${businessId}`}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://app.zevaux.com/invite/${businessId}`
                      );
                      toast({
                        title: "Copied",
                        description: "Invitation link copied to clipboard",
                        variant: "default",
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Default Role</Label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="agent">Agent</option>
                  <option value="viewer">Viewer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Expires In</Label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Send Email Invitations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
