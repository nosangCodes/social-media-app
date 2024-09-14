import Link from "next/link";
import React from "react";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithTooltip from "./user-link-with-tooltip";
type Props = {
  children: React.ReactNode;
};

export default function Linkify({ children }: Props) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

function LinkifyUrl({ children }: Props) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: Props) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <UserLinkWithTooltip username={username} key={key}>
            {match}
          </UserLinkWithTooltip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: Props) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9]+)/}
      component={(match, key) => {
        const hashtag = match.slice(1);
        return (
          <Link
            key={key}
            className="text-primary hover:underline"
            href={`/hashtags/${hashtag}`}
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}
