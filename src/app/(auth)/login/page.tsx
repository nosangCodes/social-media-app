import Image from "next/image";
import Link from "next/link";
import React from "react";
import LoginImage from "@/assets/login-image.jpg";
import LoginForm from "./login-form";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="max-2-[64rem] flex h-full max-h-[40rem] w-full overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Log in to Piclogue</h1>
            <p className="text-muted-foreground">
              Lorem ipsum <span className="italic">dolor</span> sit amet.
            </p>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link
              className="mt-2 block text-center hover:underline"
              aria-label="login page link"
              href={"/signup"}
            >
              Create an account? <span>Sign up</span>
            </Link>
          </div>
        </div>
        <Image
          src={LoginImage}
          alt="sign up image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
