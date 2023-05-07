import { SocialLinks } from "../primitives/social-links";
import type { Settings } from "@ts-ghost/content-api";

import { BoxedContent } from "~/blog/components/primitives/boxed-content";

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
      <BoxedContent.BoxedContentBody className="gap-4 divide-none p-4">
        <p>{settings.description}</p>
        <SocialLinks
          className="flex justify-start gap-2"
          facebook="#"
          twitter="#"
          linkedin="#"
          github="#"
          rss="#"
        />
      </BoxedContent.BoxedContentBody>
    </BoxedContent>
  );
};
