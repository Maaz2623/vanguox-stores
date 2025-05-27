import React from "react";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <div className="px-3">
        {children}
      </div>
    </div>
  );
}
