"use client";

import { useEffect, useState } from "react";
import { createClient } from "./client";
import type { Tables } from "./database.types";

const supabase = createClient();

export function useProjects(userId: string | undefined) {
  const [data, setData] = useState<Tables<"projects">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data: rows }) => {
        setData(rows ?? []);
        setLoading(false);
      });
  }, [userId]);

  return { data, loading };
}

export function usePayments(userId: string | undefined) {
  const [data, setData] = useState<Tables<"payments">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data: rows }) => {
        setData(rows ?? []);
        setLoading(false);
      });
  }, [userId]);

  return { data, loading };
}

export function useReferrals(partnerId: string | undefined) {
  const [data, setData] = useState<Tables<"referrals">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partnerId) return;
    supabase
      .from("referrals")
      .select("*")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .then(({ data: rows }) => {
        setData(rows ?? []);
        setLoading(false);
      });
  }, [partnerId]);

  return { data, loading };
}

export function useConversations(userId: string | undefined) {
  const [data, setData] = useState<
    (Tables<"conversations"> & {
      participants: Tables<"conversation_participants">[];
      last_message?: Tables<"messages">;
    })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", userId)
      .then(async ({ data: participations }) => {
        if (!participations?.length) {
          setLoading(false);
          return;
        }
        const convIds = participations.map((p) => p.conversation_id);
        const { data: convs } = await supabase
          .from("conversations")
          .select("*, conversation_participants(*)")
          .in("id", convIds)
          .order("created_at", { ascending: false });
        const mapped = (convs ?? []).map((c) => ({
          ...c,
          participants: (c as Record<string, unknown>).conversation_participants as Tables<"conversation_participants">[],
        }));
        setData(mapped);
        setLoading(false);
      });
  }, [userId]);

  return { data, loading };
}

export function useMessages(conversationId: string | undefined) {
  const [data, setData] = useState<Tables<"messages">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data: rows }) => {
        setData(rows ?? []);
        setLoading(false);
      });
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setData((prev) => [...prev, payload.new as Tables<"messages">]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return { data, loading };
}

export function useBenefits() {
  const [data, setData] = useState<Tables<"benefits">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("benefits")
      .select("*")
      .order("tier_required", { ascending: true })
      .then(({ data: rows }) => {
        setData(rows ?? []);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}
