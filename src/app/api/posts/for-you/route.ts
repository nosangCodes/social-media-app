import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ errpr: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errpr: "Internal server error" },
      { status: 500 },
    );
  }
};
