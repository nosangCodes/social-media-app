import { validateRequest } from "@/auth";
import FollowButton from "@/components/follow-button";
import FollowerCount from "@/components/follower-count";
import TrendsSidebar from "@/components/trends-sidebar";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { cache, Suspense } from "react";
import UsersFeed from "./users-feed";
import { Loader2 } from "lucide-react";

type Props = {
  params: {
    username: string;
  };
};

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) {
    return notFound();
  }
  return user;
});

export async function generateMetadata({
  params: { username },
}: Props): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};
  const user = await getUser(username, loggedInUser.id);
  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function page({ params: { username } }: Props) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not allowed to view this page.
      </p>
    );
  }
  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile userData={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold capitalize">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UsersFeed userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  userData: UserData;
  loggedInUserId: string;
}

async function UserProfile({ loggedInUserId, userData }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: userData._count.followers,
    isFollowedByUser: userData.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow">
      <UserAvatar
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
        avatarUrl={userData.avatarUrl}
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {userData.displayName}
            </h1>
            <div className="text-muted-foreground">@{userData.username}</div>
          </div>
          <div>Member since {formatDate(userData.createdAt, "MMM d, yyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(userData._count.posts)}
              </span>
            </span>
            <FollowerCount userId={userData.id} initialState={followerInfo} />
          </div>
        </div>
        {userData.id === loggedInUserId ? (
          <Button>Edit profile</Button>
        ) : (
          <FollowButton userId={userData.id} initialState={followerInfo} />
        )}
      </div>
      {userData.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {userData.bio}
          </div>
        </>
      )}
    </div>
  );
}
