"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";

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

  const { data: cartItems, isLoading } = useQuery(
    trpc.carts.getCartItemsByCartId.queryOptions({
      cartId: cart.id,
    })
  );

  if (isLoading || !cartItems) return <div>loading...</div>;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="px-3">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">Your Cart</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Review your selected items before checking out.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="mt-6 flex flex-col gap-4 h-[70vh]">
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground mt-10">
              Your cart is empty.
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 pr-2 h-[200px]">
                <div className="flex flex-col gap-y-4">
                  {cartItems.map((item) => (
                    <CartProductCard key={item.id} productId={item.productId} />
                  ))}
                </div>
              </ScrollArea>
              <Separator />
            sss</>
          )}

          {cartItems.length > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{2000}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => console.log("checkout")}
                >
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

type CartProductCard = {
  productId: string;
};

const CartProductCard = ({ productId }: CartProductCard) => {
  const trpc = useTRPC();

  const { data: product } = useQuery(
    trpc.products.getProductById.queryOptions({
      productId,
    })
  );

  if (!product) return <div>loading...</div>;

  return (
    <div
      key={product.id}
      className="flex gap-4 bg-gray-100 px-3 py-2 rounded-lg items-center"
    >
      <Image
        src={product.images[0]}
        alt={product.title}
        width={50}
        height={50}
        className="w-16 h-16 rounded-md object-cover"
      />
      <div className="flex-1">
        <h4 className="font-medium text-sm">{product.title}</h4>
        <div className="text-xs text-muted-foreground">
          ₹{20} × {2}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Button size="icon" variant="ghost" className="hover:bg-white">
            <MinusIcon className="w-4 h-4 " />
          </Button>
          <span className="text-sm">2</span>
          <Button size="icon" variant="ghost" className="hover:bg-white">
            <PlusIcon className="w-4 h-4 " />
          </Button>
        </div>
      </div>
      <div className="font-medium text-sm">₹2000</div>
    </div>
  );
};
