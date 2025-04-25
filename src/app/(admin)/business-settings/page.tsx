"use client";
import { useState } from "react";
import Heading from "@/components/admin/heading";
import { CalendarDays } from "lucide-react";
import Breadcrumbs from "@/components/shared/bread-crumb";
import PageTabs from "@/features/business-detail/components/page-tabs";
import { Card } from "@/components/ui/card";
import BusinessSettingsForm from "@/features/business-detail/components/business-avaialability-form";
import BusinessDetailForm from "@/features/business-detail/components/business-detail-form";

const BusinessPage = () => {
  const [activeTab, setActiveTab] = useState("Business Detail");

  return (
    <main className="h-full flex flex-col">
      <Breadcrumbs />
      <div>
        <Heading
          title="Business Settings"
          description="Manage and Customize your business"
          icon={<CalendarDays />}
        />
      </div>
      <Card className="h-full overflow-x-hidden overflow-y-auto p-4 md:p-6">
        <PageTabs
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        {activeTab === "Business Detail" ? (
          <>
            <BusinessDetailForm />
          </>
        ) : (
          <BusinessSettingsForm />
        )}
      </Card>
    </main>
  );
};

export default BusinessPage;
