import React from "react";
import { Navbar } from "./_components/navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="p-3">{children}</div>
    </div>
  );
}
