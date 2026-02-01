import { Suspense } from "react";
import { CalendarPicker } from "./CalendarPicker";
import { SearchBar } from "./SearchBar";
import { NavMenu } from "./NavMenu";
import { ThemeToggle } from "./theme-toggle";
import { Input } from "@/components/ui/input";

/**
 * 사이드바 내부 콘텐츠 (데스크톱/모바일 공통)
 */
export function SidebarContent() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground">
          Daybrary
        </h1>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Suspense
          fallback={
            <Input
              type="search"
              placeholder="검색..."
              className="pl-9"
              aria-label="일기 검색"
              disabled
            />
          }
        >
          <SearchBar />
        </Suspense>
        <CalendarPicker />
        <NavMenu />
      </div>
      <div className="mt-4 border-t border-sidebar-border pt-4">
        <ThemeToggle />
      </div>
    </>
  );
}
