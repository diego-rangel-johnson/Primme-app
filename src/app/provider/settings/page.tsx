"use client";

import { Building, Bell, Shield, FileText, Scale, Check, LogOut, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/context/session-context";
import { createClient } from "@/lib/supabase/client";

const DEFAULTS = {
  companyName: "Rivera Finishes LLC",
  industry: "Painting & Coating",
  description: "Specializing in high-end residential painting and luxury interior specialist for over 12 years.",
};

export default function ProviderSettingsPage() {
  const { user, logout } = useSession();
  const [companyName, setCompanyName] = useState(DEFAULTS.companyName);
  const [industry, setIndustry] = useState(DEFAULTS.industry);
  const [description, setDescription] = useState(DEFAULTS.description);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [_formErrors, setFormErrors] = useState<Record<string, string>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = "Company name is required.";
    if (!industry.trim()) errs.industry = "Industry is required.";
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!user) {
      toast.error("You must be signed in to save settings.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const trimmedName = companyName.trim();
    const nameParts = trimmedName.split(/\s+/).filter(Boolean);
    const initials =
      nameParts.length === 0
        ? "?"
        : nameParts.length === 1
          ? nameParts[0].slice(0, 2).toUpperCase()
          : (nameParts[0][0]! + nameParts[nameParts.length - 1][0]!).toUpperCase();

    const { error } = await supabase
      .from("profiles")
      .update({
        name: trimmedName,
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
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaved(false), 2000);
  }, [companyName, industry, user]);

  const handleCancel = useCallback(() => {
    setCompanyName(DEFAULTS.companyName);
    setIndustry(DEFAULTS.industry);
    setDescription(DEFAULTS.description);
    setSaved(false);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="lg:sticky lg:top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 lg:px-8 py-5">
        <h2 className="text-h1 font-display text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your business information and account preferences.
        </p>
      </header>

      {/* Content */}
      <div className="p-8">
        <Tabs defaultValue="business" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <TabsList className="flex flex-col w-full h-auto bg-transparent p-0 space-y-2">
                <TabsTrigger value="business" className="w-full gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><Building className="w-4 h-4" /></span>
                  <span className="font-semibold text-sm">Business Info</span>
                </TabsTrigger>
                <TabsTrigger value="leads" className="w-full gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><FileText className="w-4 h-4" /></span>
                  <span className="font-semibold text-sm">Lead Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><Bell className="w-4 h-4" /></span>
                  <span className="font-semibold text-sm">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><Shield className="w-4 h-4" /></span>
                  <span className="font-semibold text-sm">Security</span>
                </TabsTrigger>
                <TabsTrigger value="legal" className="w-full gap-3 rounded-2xl justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5"><Scale className="w-4 h-4" /></span>
                  <span className="font-semibold text-sm">Legal & Insurance</span>
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
            {/* Business Info */}
            <TabsContent value="business" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground">Business Profile</h3>
                </div>

                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-6">
                  Update your company information and details.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="companyName" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Industry
                      </Label>
                      <Input
                        id="industry"
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Business Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
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
                        saved ? "bg-success text-success-foreground hover:bg-success hover:text-success-foreground ring-success/20 shadow-success/20" : ""
                      }`}
                    >
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : saved ? <><Check className="w-4 h-4" />Saved!</> : <><span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1"><Check className="w-3.5 h-3.5" strokeWidth={2.5} /></span>Save Changes</>}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Leads Tab */}
            <TabsContent value="leads" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-12 h-12 text-neutral-400" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground mb-2">Lead Preferences Settings</h3>
                  <p className="text-muted-foreground">Configure your lead preferences here.</p>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-12 h-12 text-neutral-400" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground mb-2">Notifications Settings</h3>
                  <p className="text-muted-foreground">Configure your notifications preferences here.</p>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-12 h-12 text-neutral-400" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground mb-2">Security Settings</h3>
                  <p className="text-muted-foreground">Configure your security preferences here.</p>
                </div>
              </div>
            </TabsContent>

            {/* Legal Tab */}
            <TabsContent value="legal" className="mt-0">
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scale className="w-12 h-12 text-neutral-400" />
                  </div>
                  <h3 className="text-h2 font-display text-foreground mb-2">Legal & Insurance Settings</h3>
                  <p className="text-muted-foreground">Configure your legal & insurance preferences here.</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
