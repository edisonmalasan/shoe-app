import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { UploadDropzone } from "@/app/lib/uploadthing";

export default function CreateProductRoute() {
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

            <div className="flex flex-col gap-3">
              <Label>Featured Product</Label>
              <Switch />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Status</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Images</Label>
              <UploadDropzone endpoint={"imageUploader"} />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
