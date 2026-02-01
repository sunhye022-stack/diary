"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 500;

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [inputValue, setInputValue] = useState(urlSearch);

  useEffect(() => {
    setInputValue(urlSearch);
  }, [urlSearch]);

  const updateUrl = useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }
      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(url);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== urlSearch) {
        updateUrl(inputValue);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue, urlSearch, updateUrl]);

  return (
    <div className={cn("relative", className)}>
      <Search
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        placeholder="검색..."
        className="pl-9"
        aria-label="일기 검색"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
