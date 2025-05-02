"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const handleClick = () => {
    if (route) {
      router.push(route)
    }
  }
  return (
    <div className="flex flex-col md:flex-row flex-1 w-full justify-between gap-2 md:gap-0">
      <div className="flex flex-col">
        <div className="text-md md:text-xl lg:text-2xl  font-semibold text-gray-700">
          {title}
        </div>
        <p className="text-sm md:text-base text-gray-600">{description}</p>
      </div>
      {newButton && handleClick && (
        <div className="flex items-end justify-end">
          <Button
            type="button"
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg h-8 md:h-9.5 flex gap-1 md:gap-2"
          >
            <Plus className="h-5 w-5" />
            {newButton}
          </Button>
        </div>
      )}
    </div>
  )
}
