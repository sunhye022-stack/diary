"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "./SidebarContent";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* 데스크톱: 항상 표시되는 사이드바 */}
      <aside
        className="hidden w-56 min-w-0 flex-col overflow-x-hidden border-r border-sidebar-border bg-sidebar p-4 md:flex"
        aria-label="사이드바"
      >
        <SidebarContent />
      </aside>

      {/* 콘텐츠 영역 (모바일 헤더 + 메인) */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* 모바일: 햄버거 메뉴 헤더 */}
        <header className="flex items-center gap-2 border-b border-sidebar-border bg-sidebar px-4 py-3 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="메뉴 열기"
                className="text-sidebar-foreground"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-64 flex-col border-sidebar-border bg-sidebar p-4"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">Daybrary 메뉴</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col pt-4">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold text-sidebar-foreground">
            Daybrary
          </h1>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
