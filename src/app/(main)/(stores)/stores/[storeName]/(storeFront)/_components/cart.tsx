"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface CartProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  storeName: string;
}

export const Cart = ({ open, setOpen, storeName }: CartProps) => {
  const trpc = useTRPC();

  const isMobile = useIsMobile();

  const queryClient = useQueryClient();

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

  const mutation = useMutation(trpc.orders.createOrder.mutationOptions());

  if (isLoading || !cartItems) return <div>loading...</div>;

  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const handleCreateOrder = () => {
    const createOrder = mutation.mutateAsync(
      {
        storeName: storeName,
        cartId: cart.id,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          setOpen(false);
          queryClient.invalidateQueries(
            trpc.carts.getCartByStoreName.queryOptions({
              storeName,
            })
          );
        },
      }
    );

    toast.promise(createOrder, {
      loading: "Creating order.",
      success: "Order has been created.",
      error: "Something went wrong",
    });
  };

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="px-3 h-[800px]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-semibold">
            Your Cart
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            Review your selected items before checking out.
          </DrawerDescription>
        </DrawerHeader>
        <Separator />
        <div className="mt-6 flex flex-col gap-4 h-[50%]">
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground mt-10">
              Your cart is empty.
            </div>
          ) : (
            <>
              <ScrollArea
                className={cn("flex-1 pr-2 h-[200px]", isMobile && "h-[150px]")}
              >
                <div className="flex flex-col gap-y-4">
                  {cartItems.map((item) => (
                    <CartProductCard
                      storeName={storeName}
                      quantity={item.quantity}
                      key={item.id}
                      productId={item.productId}
                    />
                  ))}
                </div>
              </ScrollArea>
              <Separator />
            </>
          )}
        </div>
        <div>
          <DrawerFooter>
            {cartItems.length > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleCreateOrder}>
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

type CartProductCard = {
  storeName: string;
  productId: string;
  quantity: number;
};

const CartProductCard = ({
  productId,
  quantity,
  storeName,
}: CartProductCard) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const mutation = useMutation(trpc.carts.addToCart.mutationOptions());

  const decrementMutation = useMutation(
    trpc.carts.decrementFromCart.mutationOptions()
  );

  const { data: product } = useQuery(
    trpc.products.getProductById.queryOptions({
      productId,
    })
  );

  if (!product) return <div>loading...</div>;

  const incrementProduct = () => {
    const addToCart = mutation.mutateAsync(
      {
        storeName,
        productId: product.id,
      },
      {
        onSuccess: (data) => {
          console.log("refreshing cart items");
          queryClient.invalidateQueries(
            trpc.carts.getCartItemsByCartId.queryOptions({
              cartId: data.cartId,
            })
          );
        },
      }
    );

    toast.promise(addToCart, {
      loading: "Adding product to cart.",
      success: "Product has been added to cart",
      error: "Something went wrong",
    });
  };

  const decrementProduct = () => {
    const removeFromCart = decrementMutation.mutateAsync(
      {
        storeName,
        productId: product.id,
      },
      {
        onSuccess: (data) => {
          console.log("refreshing cart items");
          queryClient.invalidateQueries(
            trpc.carts.getCartItemsByCartId.queryOptions({
              cartId: data.cartId,
            })
          );
        },
      }
    );

    toast.promise(removeFromCart, {
      loading: "Updating cart...",
      success: "Product quantity updated",
      error: "Something went wrong",
    });
  };

  return (
    <div
      key={product.id}
      className="flex gap-4 border px-3 py-2 rounded-lg items-center"
    >
      <Image
        src={product.images[0]}
        alt={product.title}
        width={50}
        height={50}
        className="w-16 h-16 rounded-md object-cover border"
      />
      <div className="flex-1">
        <h4 className="font-medium text-sm">{product.title}</h4>
        <div className="text-xs text-muted-foreground">
          ₹{product.price} × {quantity}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Button
            onClick={decrementProduct}
            size="icon"
            variant="ghost"
            className="hover:bg-white"
          >
            <MinusIcon className="w-4 h-4 " />
          </Button>
          <span className="text-sm">{quantity}</span>
          <Button
            onClick={incrementProduct}
            size="icon"
            variant="ghost"
            className="hover:bg-white"
          >
            <PlusIcon className="w-4 h-4 " />
          </Button>
        </div>
      </div>
      <div className="font-medium text-sm">
        ₹{Number(product.price) * quantity}
      </div>
    </div>
  );
};
