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
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { useState } from "react";

export default function CreateProductRoute() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <form>
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
          </div>

          <div className="flex flex-col gap-3 mt-5">
            <Label>Product Image</Label>
            <CldUploadWidget
              uploadPreset="product_uploads"
              options={{
                multiple: true,
                maxFiles: 10,
                clientAllowedFormats: ["jpg", "png", "jpeg"],
                maxImageFileSize: 2000000, // 10MB
                // FOR SIGNED UPLOADS
                //apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                //cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              }}
              onSuccess={(result: any) => {
                setImageUrl(result.info.secure_url);
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

            {imageUrl && (
              <CldImage
                src={imageUrl}
                width="200"
                height="200"
                alt="Product Image"
                className="mt-2 rounded-md border"
              />
            )}
          </div>
          <Button type="submit" className="mt-4">
            Create Product
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
