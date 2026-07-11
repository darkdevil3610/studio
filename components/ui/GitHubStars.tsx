"use client";

import { useEffect, useState } from "react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";

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
    <Button
      variant="outline"
      size="sm"
      className="hidden md:flex"
      onClick={() => window.open("https://github.com/zoxilsi/studio", "_blank")}
      aria-label="Star on GitHub"
    >
      <GithubIcon className="h-4 w-4" />
      <span className="font-medium">Star on GitHub</span>
      {stars !== null && (
        <>
          <span className="w-px h-3.5 bg-glass-border opacity-50 mx-0.5" />
          <span className="tabular-nums font-mono text-[11px] font-semibold">{stars}</span>
        </>
      )}
    </Button>
  );
}
