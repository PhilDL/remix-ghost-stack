import fs from "fs";
import path from "path";
import {
  nodes,
  parse,
  transform,
  type RenderableTreeNodes,
} from "@markdoc/markdoc";
import type { Post } from "@ts-ghost/content-api";
import { NodeHtmlMarkdown } from "node-html-markdown";

import { scheme as counter } from "~/markdoc/components/counter";

const config = {
  tags: {
    counter,
  },
  nodes: {
    fence: {
      attributes: {
        ...nodes.fence.attributes,
        filename: { type: String, optional: true },
        hidden: { type: Boolean, optional: true },
        active: { type: Boolean, optional: true },
        language: {
          type: String,
        },
      },
      render: "Fence",
    },
  },
  variables: {
    user: {
      paid_subscription: true,
    },
  },
};

export function parseMarkdown(markdown: string): RenderableTreeNodes {
  let parsed = parse(markdown);
  // console.log("parsed", parsed);
  // parsed.children = parsed.children.filter(
  //   (node) => node.tag !== "paid-content"
  // );
  return transform(parsed, config);
}

/**
 * Read content from a markdoc file in the folder `app/markdoc`
 * @param name Name of the file
 * @returns text content
 */
export const loadFile = (name: string) => {
  const filePath = path.join(process.cwd(), "app/markdoc", name);
  return fs.readFileSync(filePath, "utf8");
};

type MarkdownPost = Pick<
  Post,
  | "title"
  | "published_at"
  | "tags"
  | "feature_image"
  | "canonical_url"
  | "url"
  | "html"
  | "slug"
>;

export const frontMatterGenerator = (post: MarkdownPost): string => {
  if (!post) return "";
  const frontMatter = `---
title: ${post.title}
date: ${post.published_at}
tags: ${post.tags?.map((t) => t.name).join(", ")}
status: ${post.published_at ? "published" : "draft"}
feature_image: ${post.feature_image}
canonical_url: ${post.canonical_url || post.url}
---
`;
  return frontMatter;
};

export const membersContentParser = (
  content: string,
  options?: { membersOnlyContent?: boolean }
) => {
  let [outputHtml, htmlMembersOnly] = content.split("<!--members-only-->");
  if (options?.membersOnlyContent) {
    outputHtml += htmlMembersOnly ?? "";
  }
  return outputHtml;
};

export const convertPostToMarkdown = (
  post: MarkdownPost,
  options?: { membersOnlyContent?: boolean }
): string => {
  if (!post) return "";
  let html = membersContentParser(post.html, options);
  const content = NodeHtmlMarkdown.translate(html || "");
  const frontMatter = frontMatterGenerator(post);
  return `${frontMatter}\n${content}`;
};

export const htmlToMarkdoc = (
  html: string,
  options?: { membersOnlyContent?: boolean }
): string => {
  let outputHtml = membersContentParser(html, options);
  const content = NodeHtmlMarkdown.translate(outputHtml || "");
  return content;
};

export const createMarkdownFile = (
  post: MarkdownPost,
  outputFolder: string
): void => {
  const content = convertPostToMarkdown(post);
  fs.writeFile(`${outputFolder}/${post.slug}.md`, content, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

export const syncCreateMarkdownFile = (
  post: MarkdownPost,
  outputFolder: string
) => {
  const content = convertPostToMarkdown(post);
  fs.writeFileSync(`${outputFolder}/${post.slug}.md`, content);
};
