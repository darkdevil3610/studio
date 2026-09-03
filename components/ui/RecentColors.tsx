"use client";

/**
 * Recent colors: a click-to-reuse swatch row so a user's working palette
 * is always one tap away. With a node selected, a swatch recolors it;
 * without a selection it copies the hex to the clipboard. Recents persist
 * across sessions (see store/recentColors).
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { HistoryIcon, TrashIcon } from "@/components/ui/icons";
import { useMeshStore } from "@/store/meshStore";
import { useRecentColors } from "@/store/recentColors";

export function RecentColors() {
  const colors = useRecentColors((s) => s.colors);
  const remove = useRecentColors((s) => s.remove);
  const clear = useRecentColors((s) => s.clear);
  const seed = useRecentColors((s) => s.seed);

  const doc = useMeshStore((s) => s.doc);
  const selectedId = useMeshStore((s) => s.selectedId);
  const setNodeColor = useMeshStore((s) => s.setNodeColor);
  const commit = useMeshStore((s) => s.commit);

  // First run: seed recents from the colors already in the document.
  useEffect(() => {
    seed(doc.nodes.map((n) => n.color));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (hex: string) => {
    if (selectedId) {
      commit();
      setNodeColor(selectedId, hex);
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(hex);
    }
  };

  if (colors.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <HistoryIcon className="text-faint" />
          Recent colors
        </span>
        <button
          type="button"
          onClick={clear}
          aria-label="Clear recent colors"
          title="Clear recent colors"
          className="flex items-center gap-1 text-[10px] text-faint outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus"
        >
          <TrashIcon className="h-3 w-3" />
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {colors.map((hex) => (
          <motion.button
            key={hex}
            type="button"
            whileTap={{ scale: 0.88 }}
            aria-label={`Use ${hex}`}
            title={selectedId ? `Apply ${hex}` : `Copy ${hex}`}
            onClick={() => apply(hex)}
            onContextMenu={(e) => {
              e.preventDefault();
              remove(hex);
            }}
            className="h-6 w-6 cursor-pointer rounded-md border border-glass-border shadow-sm outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-focus"
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
      <p className="text-[10px] leading-relaxed text-faint">
        {selectedId
          ? "Click to recolour the selected point · right-click to remove."
          : "Select a point, then click a swatch to apply it."}
      </p>
    </div>
  );
}
