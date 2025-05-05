import {
  CalendarClock,
  ImageUp,
  ScrollText,
  UserRoundCog,
  Info,
} from "lucide-react"

export default function ServiceFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div>
        <div className="space-y-6">
          {/* Service Name */}
          <div className="flex items-center gap-2">
            <UserRoundCog className="size-5 text-gray-400" />
            <div className="w-full">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          {/* Description */}
          <div className="flex items-start gap-2">
            <ScrollText className="size-5 text-gray-400 mt-2" />
            <div className="w-full">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          {/* Image Upload */}
          <div className="flex items-center gap-2">
            <ImageUp className="size-5 text-gray-400" />
            <div className="w-full">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          {/* Availability Tabs */}
          <div className="flex items-center gap-2">
            <CalendarClock className="size-5 text-gray-400" />
            <div className="w-full">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          {/* Availability Note */}
          <div className="flex items-start gap-2 rounded-md bg-gray-100 py-2 px-3">
            <Info className="size-4 text-gray-400 mt-0.5" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Service Day Selector */}
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Service Hours Selector */}
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Toggle and Duration */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-col gap-3 md:flex-row justify-between mt-6">
        <div className="h-10 w-full sm:w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full sm:w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}
