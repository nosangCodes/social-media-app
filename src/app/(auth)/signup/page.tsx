import { Metadata } from "next";
import React from "react";
import SignUpImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import SignUpForm from "./sign-up-form";
import Link from "next/link";

type Props = {};

export const metadata: Metadata = {
  title: "Sign up",
};

export default function page({}: Props) {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="max-2-[64rem] flex h-full max-h-[40rem] w-full overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to backbok</h1>
            <p className="text-muted-foreground">
              Lorem ipsum <span className="italic">dolor</span> sit amet.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link
              className="mt-2 block text-center hover:underline"
              aria-label="login page link"
              href={"/login"}
            >
              Already have an account? <span>Login</span>
            </Link>
          </div>
        </div>
        <Image
          src={SignUpImage}
          alt="sign up image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
