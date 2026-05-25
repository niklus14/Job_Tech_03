"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { ProfileSection } from "@/components/dashboard/sections/profile";
import { JobsSection } from "@/components/dashboard/sections/jobs";
import { SkillsSection } from "@/components/dashboard/sections/skills";
import { CareerSection } from "@/components/dashboard/sections/career";
import { SalarySection } from "@/components/dashboard/sections/salary";
import { MarketSection } from "@/components/dashboard/sections/market";
import { InterviewSection } from "@/components/dashboard/sections/interview";
import { SettingsSection } from "@/components/dashboard/sections/settings";

export type Section = 
  | "overview" 
  | "profile" 
  | "jobs" 
  | "skills" 
  | "career" 
  | "salary" 
  | "market" 
  | "interview" 
  | "settings";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "profile":
        return <ProfileSection />;
      case "jobs":
        return <JobsSection />;
      case "skills":
        return <SkillsSection />;
      case "career":
        return <CareerSection />;
      case "salary":
        return <SalarySection />;
      case "market":
        return <MarketSection />;
      case "interview":
        return <InterviewSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
        }`}
      >
        <Header activeSection={activeSection} />
        <main className="flex-1 p-6 overflow-auto">
          <div
            key={activeSection}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
