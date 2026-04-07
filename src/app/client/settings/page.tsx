"use client";

import { User, Bell, Shield, LogOut, Camera, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/context/session-context";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user, logout } = useSession();
  const nameParts = user?.name.split(" ") ?? ["", ""];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateIdentity = (form: FormData): boolean => {
    const errs: Record<string, string> = {};
    if (!form.get("firstName")?.toString().trim()) errs.firstName = "First name is required.";
    if (!form.get("lastName")?.toString().trim()) errs.lastName = "Last name is required.";
    const emailVal = form.get("email")?.toString().trim() ?? "";
    if (!emailVal) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) errs.email = "Invalid email format.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleIdentitySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!validateIdentity(form)) return;
    if (!user?.id) {
      toast.error("You must be signed in to save settings.");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          name: `${form.get("firstName")?.toString().trim()} ${form.get("lastName")?.toString().trim()}`.trim(),
          email: form.get("email")?.toString().trim(),
          phone: form.get("phone")?.toString().trim(),
        })
        .eq("id", user.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      setSaved(true);
      toast.success("Settings saved successfully!");
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    "Project updates": true,
    "Payment notifications": true,
    "Message alerts": true,
    "Milestone completions": true,
    "Team activity": true,
  });

  return (
    <>
      {/* Header */}
      <header className="lg:sticky lg:top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 lg:px-8 py-5">
        <h2 className="text-h1 font-display">
          System <span className="text-primary">Preferences</span>
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your security and interface settings.
        </p>
      </header>

      {/* Content */}
      <div className="p-8">
        <Tabs defaultValue="identity" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <TabsList className="flex flex-col w-full h-auto bg-transparent p-0 space-y-2">
                <TabsTrigger value="identity" className="w-full gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><User className="w-4 h-4" /></span>
                  <span className="font-semibold">Identity</span>
                </TabsTrigger>
                <TabsTrigger value="alerts" className="w-full gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><Bell className="w-4 h-4" /></span>
                  <span className="font-semibold">Alerts</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><Shield className="w-4 h-4" /></span>
                  <span className="font-semibold">Security</span>
                </TabsTrigger>
              </TabsList>

              <Separator className="my-4" />
              <div className="pt-4 mt-4">
                <Button variant="ghost" onClick={() => logout()} className="w-full gap-3 rounded-2xl justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3">
                  <span className="inline-flex items-center justify-center rounded-lg bg-destructive/10 p-1.5"><LogOut className="w-4 h-4" /></span>
                  <span className="font-semibold">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {/* Identity Form */}
            <TabsContent value="identity" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-h2 font-display text-foreground">IDENTITY MATRIX</h3>
                  </div>
                  <StatusBadge variant="success">● Authority Mode</StatusBadge>
                </div>

                {/* Profile Picture */}
                <div className="mb-8">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-12 h-12 text-neutral-400" />
                      </div>
                      <Button size="icon" className="absolute bottom-0 right-0 rounded-full">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">{user?.name ?? "User"}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-success rounded-full"></span>
                        ELITE TIER HOMEOWNER
                      </p>
                      <Button variant="ghost" className="mt-2 h-10 px-4 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300">
                        <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1"><User className="w-3.5 h-3.5 text-primary" /></span>
                        Update Profile
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleIdentitySubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">First Name</Label>
                      <Input id="firstName" name="firstName" type="text" defaultValue={firstName} className={errors.firstName ? "border-destructive" : ""} />
                      {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Last Name</Label>
                      <Input id="lastName" name="lastName" type="text" defaultValue={lastName} className={errors.lastName ? "border-destructive" : ""} />
                      {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={user?.email ?? ""} className={errors.email ? "border-destructive" : ""} />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Phone</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={user?.phone ?? ""} />
                  </div>
                  <div className="pt-6 flex justify-end">
                    <Button variant={saved ? "default" : "brand"} type="submit" disabled={saving} className={`h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold gap-2 min-w-[140px] ${saved ? "bg-success text-success-foreground hover:bg-success ring-success/20 shadow-success/20" : ""}`}>
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : saved ? <><Check className="w-4 h-4" />Saved!</> : <><span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1"><Check className="w-3.5 h-3.5" strokeWidth={2.5} /></span>Save Changes</>}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground">Notification Settings</h3>
                </div>

                <div className="space-y-4">
                  {Object.keys(notifications).map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <Label htmlFor={`notif-${item}`} className="font-semibold text-muted-foreground cursor-pointer">{item}</Label>
                      <Switch
                        id={`notif-${item}`}
                        checked={notifications[item]}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground">Security Settings</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="currentPassword" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                    />
                  </div>

                  <div className="pt-6 flex justify-end">
                    <Button variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
                      <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1"><Shield className="w-3.5 h-3.5" strokeWidth={2.5} /></span>
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
