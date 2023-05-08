import { Link } from "@remix-run/react";
import { Facebook, Github, Linkedin, Rss, Twitter } from "lucide-react";

export type SocialLinksProps = {
  className?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  rss?: string;
};

export const SocialLinks = ({
  className,
  facebook,
  twitter,
  linkedin,
  github,
  rss,
}: SocialLinksProps) => {
  return (
    <div className={className}>
      {facebook && (
        <Link
          to={facebook}
          className="flex h-8 w-8 items-center justify-center rounded bg-blue-800 hover:bg-blue-600"
        >
          <Facebook className="h-4 w-4 text-white" />
          <span className="sr-only">Facebook Profile</span>
        </Link>
      )}
      {twitter && (
        <Link
          to={twitter}
          className="flex h-8 w-8 items-center justify-center rounded bg-cyan-500 hover:bg-cyan-300"
        >
          <Twitter className="h-4 w-4 text-white" />
          <span className="sr-only">Twitter Profile</span>
        </Link>
      )}
      {linkedin && (
        <Link
          to={linkedin}
          className="flex h-8 w-8 items-center justify-center rounded bg-blue-500 hover:bg-blue-300"
        >
          <Linkedin className="h-4 w-4 text-white" />
          <span className="sr-only">LinkedIn Profile</span>
        </Link>
      )}
      {github && (
        <Link
          to={github}
          className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 hover:bg-gray-600"
        >
          <Github className="h-4 w-4 text-white" />
          <span className="sr-only">GitHub Organization</span>
        </Link>
      )}
      {rss && (
        <Link
          to={rss}
          className="flex h-8 w-8 items-center justify-center rounded bg-red-500 hover:bg-red-300"
        >
          <Rss className="h-4 w-4 text-white" />
          <span className="sr-only">RSS Feed</span>
        </Link>
      )}
    </div>
  );
};
