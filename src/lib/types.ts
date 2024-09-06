import { Prisma } from "@prisma/client";

export const postDataInclude = {
  user: {
    select: {
      displayName: true,
      username: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
