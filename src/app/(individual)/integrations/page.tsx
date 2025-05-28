// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const integrations = [
//   {
//     name: "Google Meet",
//     provider: "GOOGLE_MEET",
//     icon: "/icons/google-meet-icon.png",
//   },

//   {
//     name: "Webex",
//     provider: "WEBEX",
//     icon: "/icons/webex-logo-24780.png",
//   },
//   {
//     name: "Zoom",
//     provider: "ZOOM",
//     icon: "/icons/zoom-call-icon.png",
//   },
//   {
//     name: "Microsoft Teams",
//     provider: "MICROSOFT_TEAMS",
//     icon: "/icons/microsoft-teams-icon.png",
//     note: "Requires a Microsoft Teams/Office 365 license to create meetings.",
//   },
//   {
//     name: "GoTo Meeting",
//     provider: "GOTO_MEETING",
//     icon: "/icons/goTo.png",
//     note: "Requires an active GoTo Meeting license to create meetings.",
//   },
// ];

// export default function VideoIntegrations() {

//  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);

//    // Async function to fetch the connected providers
//   const fetchConnectedProviders = async () => {
//     try {
//       const res = await fetch('/api/integrations');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setConnectedProviders(data.providers || []);
//     } catch (error) {
//       console.error('Error fetching connected providers:', error);
//     }
//   };

//   // Call the async function inside useEffect
//   useEffect(() => {
//     fetchConnectedProviders();
//   }, []);


//   const handleConnect = async (provider: string) => {
//     // Call your backend to get the OAuth URL for the selected provider
//     const res = await fetch("/api/integrations", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ provider }),
//     });
//     const data = await res.json();
//     console.log('data',data);
//     if (data.authUrl) {
//       window.location.href = data.authUrl; // Redirect to OAuth URL
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow p-8">
//       <h2 className="text-2xl font-bold mb-6">Video Integrations</h2>
//       <div className="grid grid-cols-1 gap-6">
//         {integrations.map((integration) => {
//           const isConnected = connectedProviders.includes(integration.provider);
//           return (
//             <div
//               key={integration.provider}
//               className="flex items-center justify-between border rounded p-4"
//             >
//               <div className="flex items-center gap-4">
//                 <Image
//                   src={integration.icon}
//                   alt={integration.name}
//                   width={36}
//                   height={36}
//                 />
//                 <span className="font-semibold">{integration.name}</span>
//               </div>
//               {integration.note && (
//                 <p className="text-xs text-gray-500 mt-1 text-right max-w-[180px]">
//                   {integration.note}
//                 </p>
//               )}
//               {isConnected ? (
//                 <button
//                   className="bg-green-600 text-white px-4 py-2 rounded cursor-default"
//                   disabled
//                 >
//                   Connected
//                 </button>
//               ) : (
//                 <button
//                   className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//                   onClick={() => handleConnect(integration.provider)}
//                 >
//                   Connect
//                 </button>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeadingIndividual from "@/components/individual/individual-heading";
import { Video, CheckCircle, Link as LinkIcon, ExternalLink } from "lucide-react"; // Icons
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Shadcn Card
import { Badge } from "@/components/ui/badge"; // Shadcn Badge for "Connected" status

const integrationProviders = [ // Renamed to avoid conflict with component name
  {
    name: "Google Meet",
    provider: "GOOGLE_MEET",
    icon: "/icons/google-meet-icon.png", // Ensure these paths are correct in your public folder
    description: "Connect your Google account to schedule and join meetings seamlessly.",
  },
  {
    name: "Zoom",
    provider: "ZOOM",
    icon: "/icons/zoom-call-icon.png",
    description: "Integrate with Zoom for robust video conferencing and webinar capabilities.",
  },
  {
    name: "Microsoft Teams",
    provider: "MICROSOFT_TEAMS",
    icon: "/icons/microsoft-teams-icon.png",
    description: "Link Microsoft Teams for team collaboration and video meetings.",
    note: "Requires a Microsoft Teams/Office 365 license.",
  },
  {
    name: "Webex",
    provider: "WEBEX",
    icon: "/icons/webex-logo-24780.png",
    description: "Connect with Webex for secure business meetings and events.",
  },
  {
    name: "GoTo Meeting",
    provider: "GOTO_MEETING",
    icon: "/icons/goTo.png",
    description: "Use GoTo Meeting for reliable online meetings and screen sharing.",
    note: "Requires an active GoTo Meeting license.",
  },
];

export default function VideoIntegrationsPage() { // Renamed component for clarity
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null); // To show loading on specific button

  const fetchConnectedProviders = async () => {
    try {
      const res = await fetch('/api/integrations');
      if (!res.ok) {
        console.error('Failed to fetch connected providers:', res.statusText);
        // Handle error visually if needed, e.g., show a toast
        return;
      }
      const data = await res.json();
      setConnectedProviders(data.providers || []);
    } catch (error) {
      console.error('Error fetching connected providers:', error);
    }
  };

  useEffect(() => {
    fetchConnectedProviders();
  }, []);

  const handleConnect = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl; 
      } else {
        console.error("Failed to get auth URL for", provider, data.message || "");
        // Handle error visually, e.g., show a toast message
      }
    } catch (error) {
      console.error("Error initiating connection for", provider, error);
       // Handle error visually
    }
    // No setLoadingProvider(null) here, as page redirects
  };

  // Theme consistency
  const themeColor = "blue";
  const headingIconColor = `text-${themeColor}-600 dark:text-${themeColor}-400`;
  const connectButtonBg = `bg-${themeColor}-600 dark:bg-${themeColor}-500`;
  const connectButtonHoverBg = `hover:bg-${themeColor}-700 dark:hover:bg-${themeColor}-600`;

  return (
    <div className="space-y-8">
      <HeadingIndividual
        title="Video Integrations"
        description="Connect your favorite video conferencing tools to streamline your workflow."
        icon={<Video className={`w-8 h-8 ${headingIconColor}`} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationProviders.map((integration) => {
          const isConnected = connectedProviders.includes(integration.provider);
          const isLoading = loadingProvider === integration.provider;

          return (
            <Card key={integration.provider} className="flex flex-col dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                <div className="flex-shrink-0 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <Image
                    src={integration.icon}
                    alt={`${integration.name} icon`}
                    width={40} // Slightly larger icon
                    height={40}
                    className="rounded-md" // if icons are not already rounded
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">{integration.name}</CardTitle>
                  {isConnected && (
                    <Badge variant="outline" className="mt-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600">
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                      Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {integration.description}
                </p>
                {integration.note && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400/80 italic">
                    Note: {integration.note}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-4">
                {isConnected ? (
                  <Button
                    variant="outline"
                    className="w-full cursor-default border-green-500 dark:border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                    disabled
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Successfully Connected
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${connectButtonBg} ${connectButtonHoverBg} text-white`}
                    onClick={() => handleConnect(integration.provider)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect {integration.name}
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
