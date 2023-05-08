import { cn } from "~/ui/utils";

export const BoxedContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section className={cn(className)} {...props}>
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
        "rounded-t  py-3 text-left lg:px-4 text-lg font-extrabold ",
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
        "flex flex-col divide-y divide-slate-100 rounded-b dark:divide-slate-900 text-muted-foreground",
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
