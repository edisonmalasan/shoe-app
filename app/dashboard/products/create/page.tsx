"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { useState, useRef } from "react";

export default function CreateProductRoute() {
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);

      setPreviewUrls((prev) => [
        ...prev,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  // remove image from the list
  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrl((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  //  upload files in cloudinary only on form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);

    const uploadedUrls: string[] = [];

    // upload each file to Cloudinary
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "product_uploads");
      formData.append("folder", "products");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    // submit product data with uploaded image
    const formData = new FormData(event.target as HTMLFormElement);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        images: uploadedUrls,
      }),
    });

    // reset the form and state after submission
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setIsUploading(false);
    setFiles([]);
    setPreviewUrls([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-4">
        <Button variant={"outline"} size={"icon"} asChild>
          <Link href={"/dashboard/products"}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="font-semibold text-xl">New Product</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            You can create your product using this form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>Name</Label>
              <Input
                type="text"
                className="w-full"
                placeholder="Product Name"
                name="name"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea
                placeholder="Write the description here"
                name="description"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Price</Label>
              <div className="relative flex items-center gap-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₱
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-7"
                  name="price"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-5">
              <Label>Product Images</Label>

              {/* Hidden file input */}
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
              />

              {/* upload button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Images
              </Button>

              {/* prev images */}
              <div className="flex flex-wrap gap-4 mt-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="rounded-md border object-cover w-24 h-24"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-6 w-full" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Create Product"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
