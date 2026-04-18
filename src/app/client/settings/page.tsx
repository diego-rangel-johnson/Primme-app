"use client";

import { User, Bell, Shield, LogOut, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/context/session-context";
import { createClient } from "@/lib/supabase/client";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ClientSettingsPage() {
  const { user, logout } = useSession();
  const [formValues, setFormValues] = useState({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [notifProject, setNotifProject] = useState(true);
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifMessage, setNotifMessage] = useState(true);
  const [notifMilestone, setNotifMilestone] = useState(true);
  const [notifTeam, setNotifTeam] = useState(true);

  useEffect(() => {
    if (!user) return;
    setFormValues({
      fullName: user.name,
      email: user.email,
      phone: user.phone,
    });
  }, [user]);

  const updateField = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (!user) return;
    setFormValues({
      fullName: user.name,
      email: user.email,
      phone: user.phone,
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formValues.fullName.trim()) errs.fullName = "Name is required.";
    const emailVal = formValues.email.trim();
    if (!emailVal) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) errs.email = "Invalid email.";
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!user) {
      toast.error("You must be signed in to save settings.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const name = formValues.fullName.trim();
    const initials = initialsFromName(name);

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        email: emailVal,
        phone: formValues.phone.trim() || null,
        initials,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to save: " + error.message);
      return;
    }

    setSaved(true);
    toast.success("Settings saved successfully!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Notification preferences updated!");
  };

  return (
    <>
      <header className="lg:sticky lg:top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 lg:px-8 py-5">
        <h2 className="text-h1 font-display text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and notification settings.
        </p>
      </header>

      <div className="p-8">
        <Tabs defaultValue="account" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <TabsList className="flex flex-col w-full h-auto bg-transparent p-0 space-y-2">
                <TabsTrigger
                  value="account"
                  className="w-full flex items-center gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20"
                >
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5">
                    <User className="w-4 h-4" />
                  </span>
                  <span className="font-semibold">Account</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="w-full flex items-center gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20"
                >
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5">
                    <Bell className="w-4 h-4" />
                  </span>
                  <span className="font-semibold">Notifications</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="w-full flex items-center gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20"
                >
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5">
                    <Shield className="w-4 h-4" />
                  </span>
                  <span className="font-semibold">Security</span>
                </TabsTrigger>
              </TabsList>
              <Separator className="my-4" />
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full gap-3 rounded-2xl justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3"
              >
                <span className="inline-flex items-center justify-center rounded-lg bg-destructive/10 p-1.5">
                  <LogOut className="w-4 h-4" />
                </span>
                <span className="font-semibold">Sign Out</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <TabsContent value="account" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground">Account Information</h3>
                </div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-6">
                  Manage your personal details.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="fullName"
                        className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formValues.fullName}
                        onChange={(e) => {
                          updateField("fullName", e.target.value);
                          setFormErrors((p) => ({ ...p, fullName: "" }));
                        }}
                        className={formErrors.fullName ? "border-destructive" : ""}
                      />
                      {formErrors.fullName && (
                        <p className="text-xs text-destructive mt-1">{formErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formValues.email}
                        onChange={(e) => {
                          updateField("email", e.target.value);
                          setFormErrors((p) => ({ ...p, email: "" }));
                        }}
                        className={formErrors.email ? "border-destructive" : ""}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-destructive mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="phone"
                        className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formValues.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={saved ? "default" : "brand"}
                      type="submit"
                      disabled={saving}
                      className={`h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold gap-2 min-w-[140px] ${
                        saved
                          ? "bg-success hover:bg-success text-success-foreground ring-success/20 shadow-success/20"
                          : ""
                      }`}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : saved ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </span>
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground">Notification Preferences</h3>
                </div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-8">
                  Choose what updates you want to receive.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">Project updates</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Milestones, status changes, and timeline alerts.
                      </p>
                    </div>
                    <Switch checked={notifProject} onCheckedChange={setNotifProject} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">Payment notifications</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Deposits, releases, and invoice reminders.
                      </p>
                    </div>
                    <Switch checked={notifPayment} onCheckedChange={setNotifPayment} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">Message alerts</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        New messages from providers and your team.
                      </p>
                    </div>
                    <Switch checked={notifMessage} onCheckedChange={setNotifMessage} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">Milestone completions</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        When phases are marked complete.
                      </p>
                    </div>
                    <Switch checked={notifMilestone} onCheckedChange={setNotifMilestone} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">Team activity</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Invites, role changes, and collaborator updates.
                      </p>
                    </div>
                    <Switch checked={notifTeam} onCheckedChange={setNotifTeam} />
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <Button
                    variant="brand"
                    onClick={handleSaveNotifications}
                    disabled={saving}
                    className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold gap-2 min-w-[180px]"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </span>
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground">Security</h3>
                </div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-6">
                  Update your password to keep your account secure.
                </p>

                <div className="space-y-5 max-w-xl">
                  <div>
                    <Label
                      htmlFor="currentPassword"
                      className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"
                    >
                      Current Password
                    </Label>
                    <Input id="currentPassword" type="password" placeholder="Enter current password" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="newPassword"
                        className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"
                      >
                        New Password
                      </Label>
                      <Input id="newPassword" type="password" placeholder="Min. 6 characters" />
                    </div>
                    <div>
                      <Label
                        htmlFor="confirmPassword"
                        className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"
                      >
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" placeholder="Repeat new password" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button
                      variant="brand"
                      className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold gap-2"
                      onClick={() =>
                        toast.info("Password change will use Supabase Auth in a future update.")
                      }
                    >
                      <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                        <Shield className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </span>
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
