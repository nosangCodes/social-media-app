"use client";

import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import UserTooltip from "./user-tooltip";
import { Loader2 } from "lucide-react";
import { HTTPError } from "ky";
import Link from "next/link";

interface Props extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({ children, username }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link
        className="text-primary hover:underline"
        href={`/users/${username}`}
      >
        {children}
      </Link>
    );
  }
  return (
    <UserTooltip user={data}>
      <Link
        className="text-primary hover:underline"
        href={`/users/${username}`}
      >
        {children}
      </Link>
    </UserTooltip>
  );
}
