"use client"

import { useServiceStore } from "@/app/(admin)/service/_store/service-store"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"

interface TablePageHeaderProps {
  title: string
  description: string
  newButton?: string
  route?: string
}

export default function TablePageHeader({
  title,
  description,
  newButton,
  route,
}: TablePageHeaderProps) {
  const router = useRouter()
  const { fetchServices } = useServiceStore()
  const [isNavigating, setIsNavigating] = useState(false)

  // Prefetch route and fetch services on mount
  useEffect(() => {
    if (route) {
      router.prefetch(route)
    }
    fetchServices()
  }, [router, route, fetchServices])

  const handleClick = useCallback(() => {
    if (route) {
      setIsNavigating(true)
      router.push(route)
      // Reset navigating state after a short delay to allow transition
      setTimeout(() => setIsNavigating(false), 500)
    }
  }, [route, router])

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full justify-between gap-2 md:gap-0">
      <div className="flex flex-col">
        <div className="text-md md:text-xl lg:text-2xl font-semibold text-gray-700">
          {title}
        </div>
        <p className="text-sm md:text-base text-gray-600">{description}</p>
      </div>
      {newButton && route && (
        <div className="flex items-end justify-end">
          <Button
            type="button"
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg h-8 md:h-9.5 flex gap-1 md:gap-2 transition-transform duration-200 active:translate-y-0.5"
            disabled={isNavigating}
            aria-busy={isNavigating}
            aria-label={
              isNavigating ? "Navigating to create appointment" : newButton
            }
          >
            {isNavigating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                {newButton}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
