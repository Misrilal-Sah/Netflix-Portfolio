"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/actions/upload";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Optional additional className on the wrapper div */
  className?: string;
}

async function resizeAndConvertToWebP(file: File, maxPx = 1920): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        const ratio = Math.min(maxPx / width, maxPx / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/webp",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };
    img.src = objectUrl;
  });
}

function isGifFile(file: File): boolean {
  return file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
}

export function ImageUploadField({ label, value, onChange, className }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File too large (max 10 MB)");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setUploading(true);
    try {
      let uploadFile: File;
      let filename: string;

      if (isGifFile(file)) {
        filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.gif`;
        uploadFile = new File([file], filename, { type: "image/gif" });
      } else {
        // Resize & convert to WebP in the browser for non-GIF assets
        const blob = await resizeAndConvertToWebP(file);
        if (blob.size > 2 * 1024 * 1024) {
          toast.error("Resized image still exceeds 2 MB");
          return;
        }
        filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.webp`;
        uploadFile = new File([blob], filename, { type: "image/webp" });
      }

      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("filename", filename);

      const publicUrl = await uploadImage(formData);
      onChange(publicUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div className={className}>
      <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border border-dashed rounded-sm transition-colors",
          dragging
            ? "border-[#E50914] bg-[rgba(229,9,20,0.05)]"
            : "border-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.25)]"
        )}
      >
        {value ? (
          /* Preview row */
          <div className="p-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-16 h-10 object-cover rounded-sm bg-[#0a0a0a] flex-shrink-0"
            />
            <span className="flex-1 text-[10px] text-[#555] font-mono truncate">{value}</span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1 text-[#555] hover:text-white transition-colors flex-shrink-0"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          /* Drop zone */
          <div className="py-6 flex flex-col items-center gap-2 text-center">
            <Upload size={20} className={uploading ? "text-[#E50914] animate-bounce" : "text-[#555]"} />
            {uploading ? (
              <p className="text-[#808080] text-xs">Uploading…</p>
            ) : (
              <>
                <p className="text-[#555] text-xs">
                  Drag &amp; drop or{" "}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-[#E50914] hover:underline focus:outline-none"
                  >
                    choose file
                  </button>
                </p>
                <p className="text-[#333] text-xs">GIF preserved (animated). PNG/JPG/WebP auto-converted to WebP, max 10 MB</p>
              </>
            )}
          </div>
        )}

        {/* Uploading progress bar */}
        {uploading && value === "" && (
          <div className="px-3 pb-3">
            <div className="h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="h-full bg-[#E50914] animate-pulse w-full" />
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
}
