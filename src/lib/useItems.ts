import { useCallback, useEffect, useState } from "react";
import { fetchItems } from "./api";
import type { Post } from "../features/post/postSlice";

// Loads HN items by id while `enabled`; `reload` refetches the same ids.
export function useItems(ids: number[] | undefined, enabled = true) {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(0);
  const key = ids?.join(",") ?? "";

  useEffect(() => {
    if (!enabled || !key) return;

    let cancelled = false;
    setLoading(true);
    fetchItems(key.split(",").map(Number)).then((result) => {
      if (cancelled) return;
      setItems(result);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [key, enabled, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { items, loading, reload };
}
