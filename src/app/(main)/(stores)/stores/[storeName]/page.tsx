import { SectionCards } from "@/components/section-cards";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { storeName } = await params;
  console.log(storeName);
  return <SectionCards />;
}
