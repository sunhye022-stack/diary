"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Monitor, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEME_ORDER = ["light", "dark", "system"] as const;
type ThemeValue = (typeof THEME_ORDER)[number];

const THEME_CONFIG: Record<ThemeValue, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "라이트" },
  dark: { icon: Moon, label: "다크" },
  system: { icon: Monitor, label: "시스템" },
};

function getNextTheme(current: string | undefined): ThemeValue {
  const idx = THEME_ORDER.indexOf((current ?? "system") as ThemeValue);
  const nextIdx = (idx + 1) % THEME_ORDER.length;
  return THEME_ORDER[nextIdx];
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme ?? "system") as ThemeValue;
  const config = THEME_CONFIG[currentTheme];
  const Icon = config.icon;

  const handleClick = () => {
    const next = getNextTheme(theme);
    setTheme(next);
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn("text-sidebar-foreground", className)}
        aria-label="테마 변경"
        disabled
      >
        <Monitor className="size-4" aria-hidden />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      className={cn("text-sidebar-foreground", className)}
      aria-label={`테마 변경: ${config.label} (클릭 시 다음 테마로 전환)`}
      title={`현재: ${config.label}`}
    >
      <Icon className="size-4" aria-hidden />
    </Button>
  );
}
