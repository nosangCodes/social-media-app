import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function layout({ children }: Props) {
  const { user } = await validateRequest();
  if (user) redirect("/");
  return <section className="md:max-w-5xl mx-auto">{children}</section>;
}
