"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const integrations = [
  {
    name: "Google Meet",
    provider: "GOOGLE_MEET",
    icon: "/icons/google-meet-icon.png",
  },

  {
    name: "Webex",
    provider: "WEBEX",
    icon: "/icons/webex-logo-24780.png",
  },
  {
    name: "Zoom",
    provider: "ZOOM",
    icon: "/icons/zoom-call-icon.png",
  },
  {
    name: "Microsoft Teams",
    provider: "MICROSOFT_TEAMS",
    icon: "/icons/microsoft-teams-icon.png",
    note: "Requires a Microsoft Teams/Office 365 license to create meetings.",
  },
  {
    name: "GoTo Meeting",
    provider: "GOTO_MEETING",
    icon: "/icons/goTo.png",
    note: "Requires an active GoTo Meeting license to create meetings.",
  },
];

export default function VideoIntegrations() {

  const handleConnect = async (provider: string) => {
    // Call your backend to get the OAuth URL for the selected provider
    const res = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider }),
    });
    const data = await res.json();
    console.log('data',data);
    if (data.authUrl) {
      window.location.href = data.authUrl; // Redirect to OAuth URL
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-6">Video Integrations</h2>
      <div className="grid grid-cols-1 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.provider}
            className="flex items-center justify-between border rounded p-4"
          >
            <div className="flex items-center gap-4">
              <Image
                src={integration.icon}
                alt={integration.name}
                width={36}
                height={36}
              />
              <span className="font-semibold">{integration.name}</span>
            </div>
              {integration.note && (
              <p className="text-xs text-gray-500 mt-1 text-right max-w-[180px]">
                {integration.note}
              </p>
            )}
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              onClick={() => handleConnect(integration.provider)}
            >
              Connect
            </button>
          
          </div>
        ))}
      </div>
    </div>
  );
}
