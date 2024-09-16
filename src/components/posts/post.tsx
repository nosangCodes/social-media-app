import { PostData } from "@/lib/types";
import React from "react";
import UserAvatar from "../user-avatar";
import Link from "next/link";
import { cn, formatrelativeDate } from "@/lib/utils";
import PostMoreButton from "./post-more-button";
import { useSession } from "@/app/(main)/session-provider";
import Linkify from "../linkify";
import UserTooltip from "../user-tooltip";
import { Media } from "@prisma/client";
import Image from "next/image";

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
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
    </article>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        alt="Image preview"
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        height={500}
        width={500}
        src={media.url}
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
          src={media.url}
          aria-label="video preview"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type.</p>;
}

interface MediaPreviewsProps {
  attachments: Array<Media>;
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 3 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <MediaPreview key={attachment.id} media={attachment} />
      ))}
    </div>
  );
}
