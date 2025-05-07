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
import CustomerTicketPage from "@/features/help-support/components/customer-ticket-page"

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("Contact Information")

  const tabMap: Record<string, string> = {
    Contact: "Contact Information",
    FAQs: "Frequently Asked Questions (FAQs)",
    Issues: "Customer Support",
    Support: "Admin Support",
  }

  const tabs = [
    "Contact Information",
    "Frequently Asked Questions (FAQs)",
    "Customer Support",
    "Admin Support",
  ]

  const mTabs = ["Contact", "FAQs", "Issues", "Support"]

  const handleMobileTabChange = (mobileTab: string) => {
    const mapped = tabMap[mobileTab]
    if (mapped) setActiveTab(mapped)
  }

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
        {/* Desktop Tabs */}
        <PageTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          customTabs={tabs}
          clasName="hidden md:block"
        />

        {/* Mobile Tabs */}
        <PageTabs
          activeTab={
            Object.keys(tabMap).find((key) => tabMap[key] === activeTab) ||
            "Contact"
          }
          onTabChange={handleMobileTabChange}
          customTabs={mTabs}
          clasName="block md:hidden"
        />

        {activeTab === "Contact Information" && <ContactInformationForm />}
        {activeTab === "Frequently Asked Questions (FAQs)" && <FAQSection />}
        {activeTab === "Customer Support" && <CustomerTicketPage />}
        {activeTab === "Admin Support" && <AdminSupportForm />}
      </Card>
    </div>
  )
}

export default SupportPage
