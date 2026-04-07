"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Tables } from "@/lib/supabase/database.types";

export type UserRole = "client" | "provider" | "partner";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  phone: string;
  avatar_url: string | null;
}

interface SessionContextValue {
  user: SessionUser | null;
  authUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, meta: { name: string; role: UserRole }) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue>({
  user: null,
  authUser: null,
  isLoading: true,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  logout: async () => {},
});

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function profileToSessionUser(profile: Tables<"profiles">): SessionUser {
  const name = profile.name ?? "";
  return {
    id: profile.id,
    name,
    email: profile.email ?? "",
    role: profile.role,
    initials: profile.initials ?? initialsFromName(name),
    phone: profile.phone ?? "",
    avatar_url: profile.avatar_url,
  };
}

export function getRoleFromPath(pathname: string): UserRole | null {
  if (pathname.startsWith("/client")) return "client";
  if (pathname.startsWith("/provider")) return "provider";
  if (pathname.startsWith("/partner")) return "partner";
  return null;
}

export function getRoleDashboard(role: UserRole): string {
  const dashboards: Record<UserRole, string> = {
    client: "/client/dashboard",
    provider: "/provider/dashboard",
    partner: "/partner/dashboard",
  };
  return dashboards[role];
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const fetchProfile = useCallback(async (authUsr: User) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUsr.id)
      .single();

    if (data) {
      setUser(profileToSessionUser(data));
    } else {
      const name = authUsr.user_metadata?.name ?? "";
      const role = (authUsr.user_metadata?.role as UserRole) ?? "client";
      setUser({
        id: authUsr.id,
        name,
        email: authUsr.email ?? "",
        role,
        initials: initialsFromName(name),
        phone: "",
        avatar_url: null,
      });
    }
  }, [supabase]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAuthUser(session.user);
        await fetchProfile(session.user);
      }
      setIsLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
          await fetchProfile(session.user);
        } else {
          setAuthUser(null);
          setUser(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  useEffect(() => {
    if (isLoading) return;
    const requiredRole = getRoleFromPath(pathname);
    if (requiredRole && (!user || user.role !== requiredRole)) {
      router.replace("/");
    }
  }, [user, pathname, isLoading, router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    },
    [supabase],
  );

  const signup = useCallback(
    async (email: string, password: string, meta: { name: string; role: UserRole }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: meta.name, role: meta.role },
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    },
    [supabase],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthUser(null);
    router.push("/");
  }, [supabase, router]);

  return (
    <SessionContext.Provider value={{ user, authUser, isLoading, login, signup, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
