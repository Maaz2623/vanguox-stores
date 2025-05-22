"use client";
import { authClient } from "@/lib/auth-client";
import { Bebas_Neue } from "next/font/google";
import { UserDropdown } from "./user-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoresDropdown } from "./stores-button";
import { Button } from "@/components/ui/button";
import { StoreIcon } from "lucide-react";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

export const Navbar = () => {
  const session = authClient.useSession();
  const userImage = session.data?.user?.image;

  return (
    <div className="w-full px-3 py-4">
      <div className="rounded-md h-14 border px-4 flex items-center justify-between bg-white">
        <div className="cursor-pointer">
          <h1 className={`${bebasNeue.className} text-3xl tracking-wider`}>
            VANGUOX
          </h1>
        </div>

        <div className="flex justify-between items-center gap-x-2">
          <StoresDropdown>
            <Button variant={`outline`} size={`icon`}>
              <StoreIcon />
            </Button>
          </StoresDropdown>
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
