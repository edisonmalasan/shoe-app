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
  const [Files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

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

  //  upload files in cloudinary only on form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of Files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploaded_preset", "product_uploads");
      formData.append("folder", "products");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload",
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

    setIsUploading(false);
    setFiles([]);
    setPreviewUrls([]);
  };

  // remove image from the list
  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrl((prev) => prev.filter((_, index) => index !== indexToRemove));
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
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea placeholder="Write the description here" />
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
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-5">
              <Label>Product Image</Label>
              <CldUploadWidget
                uploadPreset="product_uploads"
                options={{
                  multiple: true,
                  maxFiles: 10,
                  sources: ["local", "url"],
                  clientAllowedFormats: ["jpg", "png", "jpeg"],
                  maxImageFileSize: 5000000, // 2MB
                  cropping: true,
                  croppingAspectRatio: 1,
                  folder: "products", // specify the path name in cloudinary
                  resourceType: "image", // resource type
                  // showAdvancedOptions: true,
                  // FOR SIGNED UPLOADS
                  // apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                  // cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                }}
                onSuccess={(result: any) => {
                  if (result.info?.secure_url) {
                    setImageUrl((prev) => [...prev, result.info.secure_url]);
                  }
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => open()}
                  >
                    Upload Image
                  </Button>
                )}
              </CldUploadWidget>

              <div className="flex flex-wrap gap-4 mt-3">
                {imageUrl.map((url, index) => (
                  <div className="relative group" key={index}>
                    <div className="relative w-24 h-24">
                      <CldImage
                        src={url}
                        width={100}
                        height={100}
                        alt={"Product image ${index + 1}"}
                        className="rounded-md border object-cover w-full h-full"
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
                  </div>
                ))}
              </div>

              <input
                type="hidden"
                name="images"
                value={JSON.stringify(imageUrl)} // convert the array to a JSON string USING stringify for form submission
              />
            </div>
          </div>
          <Button type="submit" className="mt-3">
            Create Product
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
