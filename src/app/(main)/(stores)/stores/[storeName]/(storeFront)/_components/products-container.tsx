"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "./product-card";

export const ProductsContainer = ({ storeName }: { storeName: string }) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.products.getProductCardDetails.queryOptions({
      storeName,
    })
  );

  console.log(data);

  return (
    <div className="flex gap-8 flex-wrap justify-center">
      {data.map((product) => (
        <ProductCard
          id={product.id}
          key={product.id}
          title={product.title}
          description={product.description}
          price={"200"}
          rating={5}
          storeName={product.storeName}
          imageUrl={product.images[0]}
        />
      ))}
    </div>
  );
};
