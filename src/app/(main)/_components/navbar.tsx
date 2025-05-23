import { Bebas_Neue } from "next/font/google";
import { UserDropdown } from "./user-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoresDropdown } from "./stores-dropdown";
import { Button } from "@/components/ui/button";
import { StoreIcon } from "lucide-react";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

export const Navbar = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.stores.getStoresByUser.queryOptions());

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userImage = session?.user.image;

  return (
    <div className="w-full px-3 py-4">
      <div className="rounded-md h-14 border px-4 flex items-center justify-between bg-white">
        <div className="cursor-pointer">
          <h1 className={`${bebasNeue.className} text-3xl tracking-wider`}>
            VANGUOX
          </h1>
        </div>

        <div className="flex justify-between items-center gap-x-2">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense>
              <StoresDropdown>
                <Button variant={`outline`} size={`icon`}>
                  <StoreIcon />
                </Button>
              </StoresDropdown>
            </Suspense>
          </HydrationBoundary>
          <UserDropdown>
            <Avatar className="cursor-pointer">
              {userImage && <AvatarImage src={userImage} />}
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </UserDropdown>
        </div>
      </div>
    </div>
  );
};
