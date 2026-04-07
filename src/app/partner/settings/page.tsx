"use client";

import {
  User,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  Loader2,
  Check,
  Building,
  Plus,
  Trash2,
  Smartphone,
  Monitor,
  Globe,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/context/session-context";
import { createClient } from "@/lib/supabase/client";

export default function PartnerSettingsPage() {
  const { user, logout } = useSession();
  const defaultFormValues = {
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  };
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Notification states
  const [notifReferralVerified, setNotifReferralVerified] = useState(true);
  const [notifCommission, setNotifCommission] = useState(true);
  const [notifTierChange, setNotifTierChange] = useState(true);
  const [notifNewsletter, setNotifNewsletter] = useState(false);
  const [notifWeeklySummary, setNotifWeeklySummary] = useState(true);
  const [notifFrequency, setNotifFrequency] = useState<"immediate" | "daily" | "weekly">("immediate");

  // Payout states
  const [autoWithdraw, setAutoWithdraw] = useState(false);
  const [autoWithdrawAmount, setAutoWithdrawAmount] = useState("500");

  // Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);

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
    const { error } = await supabase
      .from("profiles")
      .update({
        name: formValues.fullName.trim(),
        email: emailVal,
        phone: formValues.phone.trim() || null,
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

  const handleCancel = () => {
    setFormValues(defaultFormValues);
    setFormErrors({});
  };

  const updateField = (field: keyof typeof defaultFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Notification preferences updated!");
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSecuritySaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSecuritySaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated successfully!");
  };

  const payoutMethods = [
    { id: "bank-4291", type: "Bank Transfer", detail: "Ending in 4291", icon: Building, isDefault: true },
  ];

  const activeSessions = [
    { id: 1, device: "MacBook Pro", icon: Monitor, location: "Miami, FL", ip: "192.168.1.***", lastActive: "Active now" },
    { id: 2, device: "iPhone 15 Pro", icon: Smartphone, location: "Miami, FL", ip: "10.0.0.***", lastActive: "2 hours ago" },
    { id: 3, device: "Chrome on Windows", icon: Globe, location: "New York, NY", ip: "172.16.0.***", lastActive: "3 days ago" },
  ];

  const activityLog = [
    { id: 1, action: "Password changed", date: "Mar 15, 2024", ip: "192.168.1.***" },
    { id: 2, action: "Login from new device (iPhone 15 Pro)", date: "Mar 10, 2024", ip: "10.0.0.***" },
    { id: 3, action: "Payout method updated", date: "Feb 28, 2024", ip: "192.168.1.***" },
    { id: 4, action: "Email address changed", date: "Feb 15, 2024", ip: "192.168.1.***" },
  ];

  return (
    <>
      <header className="lg:sticky lg:top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 lg:px-8 py-5">
        <h2 className="text-h1 font-display text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account preferences and payout settings.</p>
      </header>

      <div className="p-8">
        <Tabs defaultValue="account" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <TabsList className="flex flex-col w-full h-auto bg-transparent p-0 space-y-2">
                <TabsTrigger value="account" className="w-full flex items-center gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><User className="w-4 h-4" /></span>
                  <span className="font-semibold">Account</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full flex items-center gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><Bell className="w-4 h-4" /></span>
                  <span className="font-semibold">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="payout" className="w-full flex items-center gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><CreditCard className="w-4 h-4" /></span>
                  <span className="font-semibold">Payout Methods</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full flex items-center gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><Shield className="w-4 h-4" /></span>
                  <span className="font-semibold">Security</span>
                </TabsTrigger>
              </TabsList>
              <Separator className="my-4" />
              <Button variant="ghost" onClick={logout} className="w-full gap-3 rounded-2xl justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3">
                <span className="inline-flex items-center justify-center rounded-lg bg-destructive/10 p-1.5"><LogOut className="w-4 h-4" /></span>
                <span className="font-semibold">Sign Out</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {/* Account Tab */}
            <TabsContent value="account" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground">Account Information</h3>
                </div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-6">Manage your personal details.</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Full Name</Label>
                      <Input id="fullName" type="text" value={formValues.fullName} onChange={(e) => { updateField("fullName", e.target.value); setFormErrors((p) => ({ ...p, fullName: "" })); }} className={formErrors.fullName ? "border-destructive" : ""} />
                      {formErrors.fullName && <p className="text-xs text-destructive mt-1">{formErrors.fullName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Email Address</Label>
                      <Input id="email" type="email" value={formValues.email} onChange={(e) => { updateField("email", e.target.value); setFormErrors((p) => ({ ...p, email: "" })); }} className={formErrors.email ? "border-destructive" : ""} />
                      {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Phone Number</Label>
                      <Input id="phone" type="tel" value={formValues.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="partnerId" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Partner ID</Label>
                      <Input id="partnerId" type="text" value="PARTNER-0892" disabled />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <Button variant="ghost" type="button" onClick={handleCancel} className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300">Cancel</Button>
                    <Button variant={saved ? "default" : "brand"} type="submit" disabled={saving} className={`h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold gap-2 min-w-[140px] ${saved ? "bg-success hover:bg-success text-success-foreground ring-success/20 shadow-success/20" : ""}`}>
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : saved ? <><Check className="w-4 h-4" />Saved!</> : <><span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1"><Check className="w-3.5 h-3.5" strokeWidth={2.5} /></span>Save Changes</>}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground">Notification Preferences</h3>
                </div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-8">Choose what notifications you receive and how often.</p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">New Referral Verified</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Get notified when a referred user completes verification.</p>
                    </div>
                    <Switch checked={notifReferralVerified} onCheckedChange={setNotifReferralVerified} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">Commission Processed</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Receive alerts when commissions are credited to your balance.</p>
                    </div>
                    <Switch checked={notifCommission} onCheckedChange={setNotifCommission} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">Tier Change Alerts</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Get notified when you&apos;re close to a tier upgrade or downgrade.</p>
                    </div>
                    <Switch checked={notifTierChange} onCheckedChange={setNotifTierChange} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">Partner Newsletter</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Monthly newsletter with tips, updates, and partner success stories.</p>
                    </div>
                    <Switch checked={notifNewsletter} onCheckedChange={setNotifNewsletter} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-foreground">Weekly Performance Summary</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Get a weekly report of your referral performance and earnings.</p>
                    </div>
                    <Switch checked={notifWeeklySummary} onCheckedChange={setNotifWeeklySummary} />
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Email Frequency</p>
                    <div className="flex gap-3">
                      {(["immediate", "daily", "weekly"] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setNotifFrequency(freq)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                            notifFrequency === freq
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/50"
                          }`}
                        >
                          {freq === "immediate" ? "Immediate" : freq === "daily" ? "Daily Digest" : "Weekly Digest"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <Button variant="brand" onClick={handleSaveNotifications} disabled={saving} className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold gap-2 min-w-[180px]">
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1"><Check className="w-3.5 h-3.5" strokeWidth={2.5} /></span>Save Preferences</>}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Payout Tab */}
            <TabsContent value="payout" className="mt-0 space-y-6">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-h2 font-display text-foreground">Payout Methods</h3>
                  </div>
                  <Button variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold" onClick={() => toast.info("Add payout method dialog would open here.")}>
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1"><Plus className="w-4 h-4" strokeWidth={2.5} /></span>
                    Add Method
                  </Button>
                </div>

                <div className="space-y-4">
                  {payoutMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className="relative p-5 rounded-2xl border-2 border-primary bg-primary/5 shadow-md shadow-primary/5 transition-all duration-300 overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl -mr-8 -mt-8" />
                        <div className="flex items-center gap-4 relative z-10 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-inner">
                            <Icon className="w-6 h-6" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-base text-foreground">{method.type}</p>
                            <p className="text-label text-muted-foreground mt-0.5">{method.detail}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => toast.info("Remove payout method confirmation would open here.")}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between border-t border-primary/10 pt-3 mt-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            <Check className="w-4 h-4" /> Default Method
                          </div>
                          <span className="px-2.5 py-1 bg-primary text-primary-foreground text-label rounded-lg shadow-card font-bold">
                            Active
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-sm text-muted-foreground font-medium">
                    <span className="font-bold text-foreground">Supported methods:</span> Bank Transfer, PayPal, Wise. Minimum withdrawal amount is <span className="font-bold text-foreground">$50.00</span>.
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-h3 font-display text-foreground mb-6">Auto-Withdraw</h4>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all mb-4">
                  <div className="flex-1 mr-4">
                    <p className="font-bold text-foreground">Enable Auto-Withdraw</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Automatically withdraw when your balance exceeds a threshold.</p>
                  </div>
                  <Switch checked={autoWithdraw} onCheckedChange={setAutoWithdraw} />
                </div>
                {autoWithdraw && (
                  <div className="p-4 rounded-xl border border-border/40 bg-muted/30">
                    <Label htmlFor="autoAmount" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Withdraw when balance exceeds
                    </Label>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-foreground">$</span>
                      <Input
                        id="autoAmount"
                        type="number"
                        value={autoWithdrawAmount}
                        onChange={(e) => setAutoWithdrawAmount(e.target.value)}
                        className="w-32"
                        min="50"
                      />
                      <Button variant="brand" onClick={() => toast.success("Auto-withdraw threshold saved!")} className="h-10 px-5 rounded-2xl ring-1 ring-inset ring-white/15 shadow-md shadow-primary/20 font-semibold">
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-0 space-y-6">
              {/* Change Password */}
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground">Change Password</h3>
                </div>
                <form className="space-y-5" onSubmit={handleSavePassword}>
                  <div>
                    <Label htmlFor="currentPw" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Current Password</Label>
                    <Input id="currentPw" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="newPw" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">New Password</Label>
                      <Input id="newPw" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPw" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Confirm New Password</Label>
                      <Input id="confirmPw" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button variant="brand" type="submit" disabled={securitySaving} className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold gap-2 min-w-[180px]">
                      {securitySaving ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</> : <><span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1"><Shield className="w-3.5 h-3.5" strokeWidth={2.5} /></span>Update Password</>}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Two-Factor Auth */}
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h4 className="text-h3 font-display text-foreground">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Add an extra layer of security to your account with 2FA.</p>
                    </div>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={(v) => { setTwoFactor(v); toast.success(v ? "2FA enabled! You'll receive setup instructions via email." : "2FA has been disabled."); }} />
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-h3 font-display text-foreground">Active Sessions</h4>
                  <Button variant="ghost" className="h-12 px-5 rounded-2xl border border-destructive/30 font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300" onClick={() => toast.success("All other sessions have been revoked.")}>
                    <span className="inline-flex items-center justify-center rounded-lg bg-destructive/10 p-1.5 mr-1"><AlertTriangle className="w-4 h-4" /></span>
                    Revoke All
                  </Button>
                </div>
                <div className="space-y-3">
                  {activeSessions.map((session) => {
                    const Icon = session.icon;
                    return (
                      <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border/50">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground text-sm">{session.device}</p>
                          <p className="text-label text-muted-foreground">{session.location} &middot; {session.ip}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-bold ${session.lastActive === "Active now" ? "text-success" : "text-muted-foreground"}`}>
                            {session.lastActive}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-h3 font-display text-foreground mb-6">Recent Activity</h4>
                <div className="space-y-3">
                  {activityLog.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/80 transition-all">
                      <div>
                        <p className="font-bold text-foreground text-sm">{entry.action}</p>
                        <p className="text-label text-muted-foreground">IP: {entry.ip}</p>
                      </div>
                      <span className="text-sm text-muted-foreground font-semibold">{entry.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
