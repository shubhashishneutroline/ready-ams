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
  const { control, setValue } = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ url: string; fileId: string } | null>(null);
  
  const uploadImage = async (file: File) => {
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
        setUploadedImage({ url: data.data.url, fileId: data.data.fileId });
        setValue(name, data.url);
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

  const deleteImage = async () => {
    console.log('uploadedImage',uploadedImage)
    if (!uploadedImage?.fileId) return;
    try {
      const res = await fetch("/api/delete-image", {
        method: "DELETE",
        body: JSON.stringify({ fileId: uploadedImage.fileId }),
      });
      const data = await res.json();
      if (res.ok) {
        setUploadedImage(null);
        setValue(name, ""); // Clear the URL from the form
        setValue(`${name}FileId`, ""); // Clear the fileId if you store it
      } else {
        setUploadError(data.error || "Delete failed");
      }
    } catch (error) {
      setUploadError("Delete failed");
    }
  };


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="flex gap-2 items-center">
            {Icon && <Icon className="size-4 text-gray-500" />}
            <FormLabel>{label}</FormLabel>
          </div>
          <FormControl>
            <Input
              type="file"
              placeholder={placeholder}
              className={cn("w-max", className)}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) {
                  uploadImage(file);
                }
              }}
              disabled={uploading || !!uploadedImage}
            />
          </FormControl>
          {uploading && <p>Uploading...</p>}
          {uploadError && <p className="text-red-500">{uploadError}</p>}
          {uploadedImage && (
            <div className="relative inline-block mt-2">
              <img src={uploadedImage.url} alt="Uploaded" width={200} className="rounded" />
              <button
                type="button"
                onClick={deleteImage}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                title="Delete image"
                disabled={uploading}
              >
                <Trash2 className="text-red-500 w-5 h-5" />
              </button>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FileUploadField