"use client"
import React from "react"
import IndividualSidebar from "@/components/individual/individual-sidebar"
import Header from "@/components/admin/header"

export default function IndividualLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header at the top */}
      <div className="bg-indigo-600 p-4">
        <Header />
      </div>
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <IndividualSidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}