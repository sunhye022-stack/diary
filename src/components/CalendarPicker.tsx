"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ko } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDiaryDatesMap } from "@/app/actions/diary";
import { EMOTION_OPTIONS, WEATHER_OPTIONS } from "@/lib/diary-constants";

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function CalendarPicker({ className }: { className?: string }) {
  const router = useRouter();
  const [month, setMonth] = useState<Date>(new Date());
  const [datesMap, setDatesMap] = useState<
    Record<
      string,
      {
        id: string;
        title: string;
        created_at: string;
        emotion: string | null;
        weather: string | null;
      }[]
    >
  >({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDiaries, setModalDiaries] = useState<
    {
      id: string;
      title: string;
      created_at: string;
      emotion: string | null;
      weather: string | null;
    }[]
  >([]);

  useEffect(() => {
    getDiaryDatesMap().then(setDatesMap);
  }, []);

  const hasDiaryDates = useMemo(() => {
    return Object.keys(datesMap).map((dateStr) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    });
  }, [datesMap]);

  const disabledMatcher = useMemo(() => {
    return (date: Date) => {
      const key = formatDateKey(date);
      return !datesMap[key] || datesMap[key].length === 0;
    };
  }, [datesMap]);

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return;
    const key = formatDateKey(date);
    const diaries = datesMap[key];
    if (!diaries || diaries.length === 0) return;

    if (diaries.length === 1) {
      router.push(`/diary/${diaries[0].id}`);
    } else {
      setModalDiaries(diaries);
      setModalOpen(true);
    }
  };

  const handleDiarySelect = (id: string) => {
    setModalOpen(false);
    router.push(`/diary/${id}`);
  };

  return (
    <>
      <div
        className={cn(
          "flex max-w-full justify-center overflow-hidden rounded-md border border-sidebar-border px-2 py-2",
          className
        )}
      >
        <Calendar
          mode="single"
          selected={undefined}
          onSelect={handleDaySelect}
          month={month}
          onMonthChange={setMonth}
          locale={ko}
          disabled={disabledMatcher}
          modifiers={{ hasDiary: hasDiaryDates }}
          modifiersClassNames={{ hasDiary: "day-with-diary" }}
          className="[--cell-size:1.5rem]"
        />
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>일기 선택</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            {modalDiaries.map((diary) => {
              const emotionEmoji =
                diary.emotion &&
                (EMOTION_OPTIONS.find((e) => e.value === diary.emotion)?.emoji ??
                  diary.emotion);
              const weatherEmoji =
                diary.weather &&
                (WEATHER_OPTIONS.find((w) => w.value === diary.weather)
                  ?.emoji ?? diary.weather);
              return (
                <Button
                  key={diary.id}
                  variant="outline"
                  className="flex h-auto flex-col items-start gap-0.5 py-3 text-left font-normal"
                  onClick={() => handleDiarySelect(diary.id)}
                >
                  <span className="flex items-center gap-2">
                    {diary.title || "(제목 없음)"}
                    {(emotionEmoji || weatherEmoji) && (
                      <span className="flex gap-0.5 text-base">
                        {emotionEmoji}
                        {weatherEmoji}
                      </span>
                    )}
                  </span>
                  {diary.created_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(diary.created_at).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
