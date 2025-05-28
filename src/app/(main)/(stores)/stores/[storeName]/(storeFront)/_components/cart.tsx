"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

interface CartProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  storeName: string;
}

export const Cart = ({ open, setOpen, storeName }: CartProps) => {
  const trpc = useTRPC();

  const { data: cart } = useSuspenseQuery(
    trpc.carts.getCartByStoreName.queryOptions({
      storeName,
    })
  );

  const { data, isLoading } = useQuery(
    trpc.carts.getCartItemsByCartId.queryOptions({
      cartId: cart.id,
    })
  );

  if (isLoading) return <div>loading...</div>;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        {JSON.stringify(data)}
      </SheetContent>
    </Sheet>
  );
};
