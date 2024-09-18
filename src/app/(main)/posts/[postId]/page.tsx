import { validateRequest } from "@/auth";
import FollowButton from "@/components/follow-button";
import Linkify from "@/components/linkify";
import Post from "@/components/posts/post";
import UserAvatar from "@/components/user-avatar";
import UserTooltip from "@/components/user-tooltip";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PageProps {
  params: {
    postId: string;
  };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) return notFound();
  return post;
});

export async function generateMetadata({
  params: { postId },
}: PageProps): Promise<Metadata> {
  const { user } = await validateRequest();
  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName} | ${post.content.slice(0, 50) + "..."}`,
  };
}

export default async function page({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();
  if (!user)
    return (
      <p className="text-destructive">
        Yuu&apos;re not authorized to visit this page.
      </p>
    );
  const post = await getPost(postId, user.id);

  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </div>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <UserTooltip user={user}>
        <Link
          className="flex items-center gap-3"
          href={`/users/${user.username}`}
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div className="flex flex-col items-start">
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser?.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.some(
              (f) => f.followerId === loggedInUser?.id,
            ),
          }}
        />
      )}
    </div>
  );
}
