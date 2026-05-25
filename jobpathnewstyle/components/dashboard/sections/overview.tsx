"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { CareerScoreCard } from "@/components/dashboard/career-score-card";
import { DailyDigest } from "@/components/dashboard/daily-digest";
import { ProfileStrength } from "@/components/dashboard/profile-strength";
import { RecentMatches } from "@/components/dashboard/recent-matches";
import { Briefcase, Target, TrendingUp, Award } from "lucide-react";

export function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Career Score & Daily Digest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CareerScoreCard />
        <div className="lg:col-span-2">
          <DailyDigest />
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Uyğun İşlər"
          value="24"
          change="+8 bu həftə"
          changeType="positive"
          icon={Briefcase}
          delay={0}
        />
        <MetricCard
          title="İşə Götürülmə Ehtimalı"
          value="78%"
          change="+5% son ayda"
          changeType="positive"
          icon={Target}
          delay={1}
        />
        <MetricCard
          title="Bazar Uyğunluğu"
          value="92%"
          change="+12%"
          changeType="positive"
          icon={TrendingUp}
          delay={2}
        />
        <MetricCard
          title="Tamamlanan Müsahibə"
          value="12"
          change="+3 bu ay"
          changeType="positive"
          icon={Award}
          delay={3}
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileStrength />
        <RecentMatches />
      </div>
    </div>
  );
}
