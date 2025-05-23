import React from "react";
import { Navbar } from "./_components/navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Navbar />
      <div className="px-3">{children}</div>
    </div>
  );
}
