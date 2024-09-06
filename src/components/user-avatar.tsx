import React from "react";
import avatarUrlPlaceholder from "@/assets/avatar-placeholder.png";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  avatarUrl?: string | null;
  size?: number;
};

export default function UserAvatar({ className, avatarUrl, size }: Props) {
  return (
    <Image
      src={avatarUrl || avatarUrlPlaceholder}
      alt="avatar image"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
