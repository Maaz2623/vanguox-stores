import { getQueryClient, trpc } from "@/trpc/server";
import React, { Suspense } from "react";
import { ProductsContainer } from "../_components/products-container";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

const ShopPage = async ({ params }: PageProps) => {
  const { storeName } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.products.getProductCardDetails.queryOptions({
      storeName,
    })
  );

 
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>loading...</div>}>
          <ProductsContainer storeName={storeName} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default ShopPage;
