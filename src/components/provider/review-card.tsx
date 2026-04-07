"use client";

import { Star, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ReviewData {
  id: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  text: string;
  date: string;
  projectTitle?: string;
  verified?: boolean;
}

interface ReviewCardProps {
  review: ReviewData;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <div className={cn("bg-card rounded-2xl p-6 border border-border/40 shadow-card hover:shadow-md transition-shadow", className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            {review.clientAvatar ? (
              <img src={review.clientAvatar} alt={review.clientName} className="w-full h-full object-cover" />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {review.clientName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-bold text-foreground">{review.clientName}</p>
            {review.projectTitle && (
              <p className="text-meta text-muted-foreground font-medium">{review.projectTitle}</p>
            )}
          </div>
        </div>
        <span className="text-label text-muted-foreground">{review.date}</span>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < review.rating ? "text-warning fill-warning" : "text-border"
            )}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium mb-4">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Verified badge */}
      {review.verified && (
        <div className="flex items-center gap-1.5 text-label text-success">
          <CheckCircle className="w-3.5 h-3.5" />
          Verified by Primme
        </div>
      )}
    </div>
  );
}
