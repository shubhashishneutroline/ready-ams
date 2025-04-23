import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import { UserCheck } from "lucide-react"

const ToggleSwitch = ({ name, label, icon }: any) => {
  const { watch, setValue } = useFormContext()
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex items-center gap-2">
        {<UserCheck className="size-4 text-gray-500" />}
        <Label>{label}</Label>
      </div>
      <Switch
        checked={watch(name)}
        onCheckedChange={(val: any) => setValue(name, val)}
      />
    </div>
  )
}

export default ToggleSwitch
