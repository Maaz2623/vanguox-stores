import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

export const Navbar = () => {
  return (
    <div className="w-full px-3 py-4">
      <div className="rounded-md h-14 border px-4 flex items-center justify-between bg-white">
        <div className="cursor-pointer">
          <h1 className={`${bebasNeue.className} text-3xl tracking-wider`}>
            VANGUOX
          </h1>
        </div>

        <div className="flex justify-between items-center gap-x-2">
          <Button variant={`outline`} size={`icon`}>
            <ShoppingCartIcon />
          </Button>
          <Button variant={`outline`} size={`icon`}>
            <ShoppingCartIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
