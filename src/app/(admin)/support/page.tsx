"use client"

import { useState } from "react"
import PageTabs from "@/features/business-detail/components/page-tabs"
import { Card } from "@/components/ui/card"
import ContactInformationForm from "@/features/help-support/components/contact-info"
import FAQSection from "@/features/help-support/components/faq"
import AdminSupportForm from "@/features/help-support/components/admin-support"
import Breadcrumbs from "@/components/shared/bread-crumb"
import Heading from "@/components/admin/heading"
import { UserCog } from "lucide-react"
const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("Contact Information")
  const [mActiveTab, setMActiveTab] = useState("Contact")

  const tabs = [
    "Contact Information",
    "Frequently Asked Questions (FAQs)",
    "Admin Support",
  ]
  const mTabs = ["Contact", "FAQs", "Support"]

  return (
    <div>
      <Breadcrumbs />
      <div>
        <Heading
          title="Support"
          description="Manage your support and customer service "
          icon={<UserCog />}
        />
      </div>
      <Card className="h-full overflow-y-auto p-4 md:p-6">
        <PageTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          customTabs={tabs}
          clasName="hidden md:block"
        />
        <PageTabs
          activeTab={mActiveTab}
          onTabChange={setMActiveTab}
          customTabs={mTabs}
          clasName="block md:hidden"
        />
        {(activeTab === "Contact Information" || activeTab === "Contact ") && (
          <ContactInformationForm />
        )}
        {(activeTab === "Frequently Asked Questions (FAQs)" ||
          activeTab === "FAQs") && <FAQSection />}
        {(activeTab === "Admin Support" || activeTab === "Support") && (
          <AdminSupportForm />
        )}
      </Card>
    </div>
  )
}

export default SupportPage
