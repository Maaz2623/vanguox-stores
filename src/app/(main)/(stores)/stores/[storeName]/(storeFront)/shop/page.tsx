import { getQueryClient, trpc } from "@/trpc/server";
import React from "react";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

const ShopPage = async ({ params }: PageProps) => {
  const { storeName } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.products.getProductsByStoreName.queryOptions({
      storeName,
    })
  );

  return <div>Shop Page</div>;
};

export default ShopPage;
