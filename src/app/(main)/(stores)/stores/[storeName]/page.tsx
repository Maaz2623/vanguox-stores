import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductsTable } from "./_components/products-table";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { storeName } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.products.getProductsByStoreName.queryOptions({
      storeName: storeName,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>loading...</div>}>
        <ProductsTable storeName={storeName} />
      </Suspense>
    </HydrationBoundary>
  );
}
