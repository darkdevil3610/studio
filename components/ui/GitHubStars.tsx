"use client";

import { useEffect, useState } from "react";
import { GithubIcon, StarIcon } from "@/components/ui/icons";

export function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/zoxilsi/studio")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href="https://github.com/zoxilsi/studio"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub Repository"
      className="hidden md:inline-flex h-8 items-center gap-1.5 rounded-full border border-glass-border bg-glass-soft px-3 text-muted transition-colors duration-150 hover:bg-hover hover:text-ink"
    >
      <GithubIcon className="h-4 w-4 shrink-0" />
      <StarIcon className="h-3.5 w-3.5 shrink-0" />
      {stars !== null && (
        <span className="tabular-nums font-mono text-[11px] font-semibold">{stars}</span>
      )}
    </a>
  );
}
