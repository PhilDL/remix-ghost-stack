import { cn } from "~/ui/utils";

export function formatDate(date: string) {
  const publishedDate = new Date(date);
  return publishedDate.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type PublishedAtProps = React.HTMLAttributes<HTMLTimeElement> & {
  date: string;
};

export const PublishedAt = ({ className, date }: PublishedAtProps) => {
  return (
    <time
      className={cn("text-xs text-slate-500 dark:text-slate-400", className)}
      dateTime={date}
    >
      {formatDate(date)}
    </time>
  );
};
