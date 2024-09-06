import { PostData } from "@/lib/types";
import React from "react";
import UserAvatar from "../user-avatar";
import Link from "next/link";
import { formatrelativeDate } from "@/lib/utils";

type Props = {
  post: PostData;
};

export default function Post({ post }: Props) {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Link
          aria-label="user profile link"
          href={`/users/${post.user.username}`}
        >
          <UserAvatar avatarUrl={post.user.avatarUrl} />
        </Link>
        <div>
          <Link
            className="block font-medium hover:underline"
            aria-label="user profile link"
            href={`/users/${post.user.username}`}
          >
            {post.user.displayName}
          </Link>
          <Link
            className="block text-sm text-muted-foreground hover:underline"
            aria-label="post page"
            href={`/posts/${post.id}`}
          >
            {formatrelativeDate(post.createdAt)}
          </Link>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}


