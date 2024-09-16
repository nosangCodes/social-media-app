import SearchField from "@/components/search-field";
import UserButton from "@/components/user-button";
import Link from "next/link";
import React from "react";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 md:gap-5 px-2 py-3 md:px-5">
        <Link href={"/"} className="text-2xl font-bold text-primary">
          Piclogue
        </Link>
        <div className="flex flex-row gap-x-2 sm:ms-auto">
          <SearchField />
          <UserButton className="sm:ms-auto" />
        </div>
      </div>
    </header>
  );
}
