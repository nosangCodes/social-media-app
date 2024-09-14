import { PostData } from "@/lib/types";
import React from "react";
import UserAvatar from "../user-avatar";
import Link from "next/link";
import { formatrelativeDate } from "@/lib/utils";
import PostMoreButton from "./post-more-button";
import { useSession } from "@/app/(main)/session-provider";
import Linkify from "../linkify";
import UserTooltip from "../user-tooltip";

type Props = {
  post: PostData;
};

export default function Post({ post }: Props) {
  const { user } = useSession();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link
              aria-label="user profile link"
              href={`/users/${post.user.username}`}
            >
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                className="block font-medium hover:underline"
                aria-label="user profile link"
                href={`/users/${post.user.username}`}
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              className="block text-sm text-muted-foreground hover:underline"
              aria-label="post page"
              href={`/posts/${post.id}`}
            >
              {formatrelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {user.id === post.userId && (
          <PostMoreButton
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
            post={post}
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
    </article>
  );
}
