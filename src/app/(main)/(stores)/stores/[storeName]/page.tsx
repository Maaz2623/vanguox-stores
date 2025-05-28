import { SectionCards } from "./_components/(store-admin-dashboard)/section-cards";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { storeName } = await params;
  console.log(storeName);
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionCards />
        </div>
      </div>
    </div>
  );
}
