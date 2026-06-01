import { INTERVIEW_TOTAL } from "@/lib/interview-questions";

type ProgressBarProps = {
  currentIndex: number;
};

export function ProgressBar({ currentIndex }: ProgressBarProps) {
  const percent = Math.round(((currentIndex + 1) / INTERVIEW_TOTAL) * 100);

  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-sm text-muted">
        <span>
          {currentIndex + 1} / {INTERVIEW_TOTAL}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
