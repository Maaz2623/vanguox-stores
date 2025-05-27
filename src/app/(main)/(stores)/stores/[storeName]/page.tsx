"use client";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{
    storeName: string;
  }>();

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.products.getProductsByStoreName.queryOptions({
      storeName: params.storeName,
    })
  );

  return <DataTable data={data} storeName={params.storeName} />;
}
