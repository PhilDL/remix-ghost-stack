import type { Settings } from "@ts-ghost/content-api";

import { BoxedContent } from "~/ui/components/boxed-content";

export type SiteDescriptionProps = {
  className?: string;
  settings: Settings;
  titleElement: "h1" | "div";
};

export const SiteDescription = ({
  className,
  settings,
  titleElement,
}: SiteDescriptionProps) => {
  return (
    <BoxedContent className={className}>
      <BoxedContent.BoxedContentTitle as={titleElement}>
        {settings.title}
      </BoxedContent.BoxedContentTitle>
      <BoxedContent.BoxedContentBody className="gap-4 divide-none lg:px-4">
        <p>{settings.description}</p>
      </BoxedContent.BoxedContentBody>
    </BoxedContent>
  );
};
