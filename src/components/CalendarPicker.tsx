"use client";

import { useState, useEffect } from "react";
import { enUS } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function CalendarPicker({ className }: { className?: string }) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setDate(new Date());
  }, []);

  return (
    <div
      className={cn(
        "flex max-w-full justify-center overflow-hidden rounded-md border border-sidebar-border px-2 py-2",
        className
      )}
    >
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        locale={enUS}
        className="[--cell-size:1.5rem]"
      />
    </div>
  );
}
