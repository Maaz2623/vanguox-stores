"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ShoppingCartIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Cart } from "../../(storeFront)/_components/cart";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function SiteHeader({ storeName }: { storeName: string }) {
  const pathname = usePathname();

  const [cartOpen, setCartOpen] = useState(false);

  const trpc = useTRPC();

  const { data: cart } = useSuspenseQuery(
    trpc.carts.getCartByStoreName.queryOptions({
      storeName,
    })
  );

  const { data: cartItems } = useQuery(
    trpc.carts.getCartItemsByCartId.queryOptions({
      cartId: cart.id,
    })
  );

  const isActive = pathname.includes("/shop");

  return (
    <header className="flex h-14 pr-4 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear ">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
      </div>
      {isActive && cart && cartItems && (
        <>
          <Cart open={cartOpen} setOpen={setCartOpen} storeName={storeName} />
          <Button
            variant={`outline`}
            size={`icon`}
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            {cartItems.length !== 0 && (
              <span className="absolute text-xs bg-destructive rounded-full p-0.5 font-semibold text-white size-5 -top-2 -right-2">
                {cartItems.length}
              </span>
            )}
            <ShoppingCartIcon />
          </Button>
        </>
      )}
    </header>
  );
}
