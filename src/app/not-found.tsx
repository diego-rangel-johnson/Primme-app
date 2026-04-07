"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-display font-display text-foreground mb-2">404</h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>
        <h2 className="text-h2 font-display text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved. Check the URL or navigate back.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
        <p className="mt-12 text-xs text-muted-foreground">
          Primme Platform &mdash; If this issue persists, contact support.
        </p>
      </div>
    </div>
  );
}
