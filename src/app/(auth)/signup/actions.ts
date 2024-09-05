"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signupSchema, SignUpValues } from "@/lib/validations";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { email, password, username } = signupSchema.parse(credentials);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);
    const usernameExists = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (usernameExists) {
      return {
        error: "username is already taken",
      };
    }

    const emailExists = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (emailExists) {
      return {
        error: "email is already taken",
      };
    }

    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if(isRedirectError(error)) throw error
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
