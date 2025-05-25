"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRef, useState } from "react";

interface CreateStoreDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CreateStoreDialog = ({
  open,
  setOpen,
}: CreateStoreDialogProps) => {
  const queryClient = useQueryClient();
  const [shopName, setShopName] = useState("");

  const createButtonRef = useRef<HTMLButtonElement>(null); // 👈 add this

  const trpc = useTRPC();
  const mutation = useMutation(trpc.stores.createStore.mutationOptions());
  const router = useRouter();

  const handleCreateStore = async () => {
    const subdomainRegex = /^[a-z][a-z0-9-]{2,29}$/;
    if (!subdomainRegex.test(shopName)) {
      toast.error(
        "Store name must be 3–30 characters, lowercase, and URL-safe."
      );
      return;
    }

    const createStore = mutation.mutateAsync(
      { name: shopName },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(
            trpc.stores.getStoresByUser.queryOptions()
          );
          setShopName("");
          setOpen(false);
          router.push(`/stores/${data.name}`);
        },
      }
    );

    toast.promise(createStore, {
      loading: "Creating your store",
      success: "Store has been created. Redirecting...",
      error: "Something went wrong",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new store</DialogTitle>
            <DialogDescription>
              Give your store a unique name. You can change this later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="shop-name">Shop Name</Label>
              <Input
                disabled={mutation.isPending}
                id="shop-name"
                placeholder="e.g. FreshMart, PixelHub..."
                onChange={(e) => setShopName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={mutation.isPending}
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              ref={createButtonRef}
              disabled={mutation.isPending}
              onClick={handleCreateStore}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
