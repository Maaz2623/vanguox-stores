import React, { Suspense } from "react";
import { Navbar } from "./_components/navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.stores.getStoresByUser.queryOptions());

  return (
    <div className="bg-gray-50">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <Navbar />
        </Suspense>
      </HydrationBoundary>
      <div className="px-5">{children}</div>
    </div>
  );
}
