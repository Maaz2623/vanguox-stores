"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadThing } from "@/lib/uploadthing"; // your generated helpers
import { useRef, useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { UploadProgressToast } from "./custom-toasts/upload-progress-toast";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export const AddProductDialog = ({
  open,
  setOpen,
  storeName,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  storeName: string;
}) => {
  const trpc = useTRPC();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [currentFile, setCurrentFile] = useState("");
  const toastIdRef = useRef<string | number | null>(null);
  const mutation = useMutation(trpc.products.createProduct.mutationOptions());

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const imageUrls = res?.map((f) => f.ufsUrl) ?? [];

      const newProduct = {
        ...form.getValues(),
        images: imageUrls,
      };

      console.log("Submitted product:", newProduct);

      toast.success("Product uploaded!");
      form.reset();
      setImages([]);
      setImagePreviews([]);
      setUploadProgress(0);
      setOpen(false);
    },
    onUploadError: (error) => {
      console.error("Upload failed:", error);
      toast.error("Upload failed.");
    },
    onUploadBegin: (fileName: string) => {
      setCurrentFile(fileName);
      setUploadProgress(0); // Reset progress at start

      toastIdRef.current = toast.custom(() => (
        <UploadProgressToast fileName={fileName} progress={0} />
      ));
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);

      // Re-trigger the toast with updated progress
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = toast.custom(() => (
          <UploadProgressToast fileName={currentFile} progress={p} />
        ));
      }
    },
    uploadProgressGranularity: "fine",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.filter(
      (file) =>
        !images.some((img) => img.name === file.name && img.size === file.size)
    );

    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [
      ...prev,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  console.log(storeName);

  const onSubmit = async (data: FormValues) => {
    if (images.length === 0) {
      toast.warning("Please add at least one image.");
      return;
    }

    const uploaded = await startUpload(images);

    if (!uploaded) {
      toast.error("Upload failed or cancelled.");
      return;
    }

    console.log(storeName);

    const createProduct = mutation.mutateAsync(
      {
        title: data.title,
        description: data.description,
        images: uploaded.map((images) => images.ufsUrl),
        storeName: storeName,
      },
      {
        onSuccess: (data) => {
          console.log(data);
        },
      }
    );

    toast.promise(createProduct, {
      loading: "Creating your product",
      success: "Product has been created.",
      error: "Something went wrong",
    });

    // ✅ Form and UI reset is handled in onClientUploadComplete
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Images</FormLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {imagePreviews.length > 0 && (
                <div className="flex h-[200px] flex-wrap gap-2 mt-2">
                  <ScrollArea className="h-full w-full">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative">
                        <Image
                          src={src}
                          alt={`Preview ${i + 1}`}
                          width={120}
                          height={120}
                          className="rounded-md border object-cover aspect-square"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setImages((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            );
                            setImagePreviews((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            );
                          }}
                          className="h-5 w-5 bg-white rounded-full absolute -top-0.5 -right-0.5 border"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </div>

            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                  setImages([]);
                  setImagePreviews([]);
                  setUploadProgress(0);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
