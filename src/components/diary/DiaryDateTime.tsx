"use client";

interface DiaryDateTimeProps {
  diaryDate: string;
  createdAt: string;
  className?: string;
}

/**
 * 클라이언트에서 렌더링하여 사용자 로컬 시간대로 날짜/시간 표시
 * (서버 렌더 시 UTC로 표시되는 문제 해결)
 */
export function DiaryDateTime({
  diaryDate,
  createdAt,
  className,
}: DiaryDateTimeProps) {
  const dateStr = new Date(diaryDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = new Date(createdAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <span className={className}>
      {dateStr} {timeStr}
    </span>
  );
}
