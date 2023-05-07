import { cn } from "~/ui/utils";

export const BoxedContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={cn("text-slate-500 dark:text-slate-300", className)}
      {...props}
    >
      {children}
    </section>
  );
};

export type BoxedContentTitleProps = React.HTMLAttributes<
  HTMLHeadingElement | HTMLDivElement
> & {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
};

export const BoxedContentTitle = ({
  children,
  className,
  as,
  ...props
}: BoxedContentTitleProps) => {
  const HeadingTag = as;
  return (
    <HeadingTag
      className={cn(
        "rounded-t border-x border-t border-slate-200 py-3 text-center text-lg font-extrabold text-slate-600 dark:border-slate-800 dark:text-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </HeadingTag>
  );
};

BoxedContentTitle.defaultProps = {
  as: "h2",
};

export const BoxedContentBody = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex flex-col divide-y divide-slate-200 rounded-b border border-slate-200 dark:divide-slate-800 dark:border-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

BoxedContent.BoxedContentTitle = BoxedContentTitle;
BoxedContent.BoxedContentBody = BoxedContentBody;

export default BoxedContent;
