"use client";
import useFollowerInfo from "@/hooks/user-follower-info";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import React from "react";

type Props = {
  userId: string;
  initialState: FollowerInfo;
};

export default function FollowerCount({ initialState, userId }: Props) {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}
