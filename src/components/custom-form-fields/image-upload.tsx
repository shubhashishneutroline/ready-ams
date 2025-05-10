"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useState } from "react"
import { Trash2 } from "lucide-react"; 

interface FileUploadFieldProps {
  name: string
  label: string
  placeholder?: string
  className?: string
  icon?: LucideIcon
}

const FileUploadField = ({
  name,
  label,
  placeholder,
  className,
  icon: Icon,
}: FileUploadFieldProps) => {
  const { setValue, watch } = useFormContext();
   const imageUrl = watch(name);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        console.log('data',data)
        setValue(name, data.data.url);
        setValue(`${name}FileId`, data.data.fileId);
      } else {
        setUploadError("Upload failed");
      }
    } catch (error) {
      console.log('err',error)
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const fileId = watch(`${name}FileId`);
    if (fileId) {
      await fetch("/api/delete-image", {
        method: "DELETE",
        body: JSON.stringify({ fileId }),
      });
    }
    setValue(name, "");
    setValue(`${name}FileId`, "");
  };

return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-gray-500" />}
        {label}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <span>Uploading...</span>}
      {uploadError && <span className="text-red-500">{uploadError}</span>}
      {imageUrl && (
        <div className="relative inline-block mt-2">
          <img src={imageUrl} alt="Cover" width={200} className="rounded" />
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
            title="Delete image"
            disabled={uploading}
          >
            <Trash2 className="text-red-500 w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadField