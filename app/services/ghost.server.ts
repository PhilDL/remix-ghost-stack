import { TSGhostAdminAPI } from "@ts-ghost/admin-api";
import { TSGhostContentAPI } from "@ts-ghost/content-api";
import { cachified, verboseReporter } from "cachified";
import invariant from "tiny-invariant";
import { env } from "~/env";

import { cache } from "~/services/cache.server";

// Feel free to get more aggressive with these values

const SETTINGS_CACHE_DURATION = 300_000; // 5 minutes
const FEATURED_POSTS_CACHE_DURATION = 300_000; // 5 minutes
const HOMEPAGE_CACHE_DURATION = 300_000; // 5 minutes
const TIERS_CACHE_DURATION = 300_000; // 5 minutes

const api = new TSGhostContentAPI(
  env.GHOST_URL,
  env.GHOST_CONTENT_API_KEY,
  "v5.0"
);

export const featuredPostsPreview = () => {
  return api.posts
    .browse({ limit: 5, filter: "featured:true" })
    .fields({
      title: true,
      slug: true,
      feature_image: true,
      published_at: true,
    })
    .fetch();
};

export const cachedFeaturedPostsPreview = async () => {
  return cachified({
    key: "featuredPostsPreview",
    cache: cache,
    getFreshValue: featuredPostsPreview,
    ttl: FEATURED_POSTS_CACHE_DURATION, // 5 mins
    reporter: verboseReporter(),
  });
};

export const getIndexPageData = async () => {
  const api = new TSGhostContentAPI(
    env.GHOST_URL,
    env.GHOST_CONTENT_API_KEY,
    "v5.0"
  );
  const [posts, tags, featuredPosts, authors, settings] = await Promise.all([
    api.posts
      .browse({ limit: 10 })
      .include({ tags: true, authors: true })
      .fetch(),
    api.tags
      .browse({
        order: "count.posts DESC",
        filter: "visibility:public",
        limit: 3,
      })
      .include({ "count.posts": true })
      .fetch(),
    cachedFeaturedPostsPreview(),
    api.authors.browse({ limit: 5 }).include({ "count.posts": true }).fetch(),
    cachedGetSiteSettings(),
  ]);
  invariant(posts.success, "Failed to fetch posts");
  invariant(tags.success, "Failed to fetch tags");
  invariant(featuredPosts.success, "Failed to fetch featured posts");
  invariant(authors.success, "Failed to fetch authors");
  invariant(settings, "Failed to fetch settings");
  return {
    posts: posts.data,
    postsMeta: posts.meta,
    tags: tags.data,
    featuredPosts: featuredPosts.data,
    authors: authors.data,
    settings: settings,
  };
};
export const cachedGetIndexPageData = async () => {
  return cachified({
    key: "getIndexPageData",
    cache: cache,
    getFreshValue: getIndexPageData,
    // 5 minutes until cache gets invalid
    // Optional, defaults to Infinity
    ttl: HOMEPAGE_CACHE_DURATION,
    reporter: verboseReporter(),
  });
};

export const getAuthorPage = async (slug: string) => {
  const api = new TSGhostContentAPI(
    env.GHOST_URL,
    env.GHOST_CONTENT_API_KEY,
    "v5.0"
  );
  const [posts, author] = await Promise.all([
    api.posts
      .browse({ limit: 10, filter: `primary_author:${slug}` })
      .include({ tags: true, authors: true })
      .fetch(),
    api.authors
      .read({
        slug,
      })
      .include({ "count.posts": true })
      .fetch(),
  ]);
  invariant(posts.success, "Failed to fetch posts");
  invariant(author.success, "Failed to fetch author");
  return {
    posts: posts.data,
    author: author.data,
    postsMeta: posts.meta,
  };
};

export const getTagPage = async (slug: string) => {
  const api = new TSGhostContentAPI(
    env.GHOST_URL,
    env.GHOST_CONTENT_API_KEY,
    "v5.0"
  );
  const [posts, tag] = await Promise.all([
    api.posts
      .browse({ limit: 10, filter: `tags:${slug}` })
      .include({ tags: true, authors: true })
      .fetch(),
    api.tags
      .read({
        slug,
      })
      .include({ "count.posts": true })
      .fetch(),
  ]);
  if (!tag.success) {
    throw new Response(tag.errors.map((m) => m.message).join(","), {
      status: 404,
      statusText: "Not Found",
    });
  }
  if (!posts.success) {
    throw new Response(posts.errors.map((m) => m.message).join(","), {
      status: 404,
      statusText: "Not Found",
    });
  }
  return {
    posts: posts.data,
    postsMeta: posts.meta,
    tag: tag.data,
  };
};

export const getSiteSettings = async () => {
  const api = new TSGhostContentAPI(
    env.GHOST_URL,
    env.GHOST_CONTENT_API_KEY,
    "v5.0"
  );
  const settings = await api.settings.fetch();
  invariant(settings.success, "Failed to fetch settings");
  return settings.data;
};

export const cachedGetSiteSettings = async () => {
  return cachified({
    key: "getSiteSettings",
    cache: cache,
    getFreshValue: getSiteSettings,
    ttl: SETTINGS_CACHE_DURATION,
    reporter: verboseReporter(),
  });
};

export const getAdminSettings = async () => {
  const api = new TSGhostAdminAPI(
    env.GHOST_URL,
    env.GHOST_ADMIN_API_KEY,
    "v5.0"
  );
  const settings = await api.settings.fetch();
  invariant(settings.success, "Failed to fetch settings");
  return settings.data;
};

export const getGhostTiers = async () => {
  const api = new TSGhostAdminAPI(
    env.GHOST_URL,
    env.GHOST_ADMIN_API_KEY,
    "v5.0"
  );
  const tiers = await api.tiers
    .browse({
      filter: "active:true+type:paid",
    })
    .include({ benefits: true, monthly_price: true, yearly_price: true })
    .fetch();
  invariant(tiers.success, "Failed to fetch tiers");
  return tiers.data;
};

export const cachedGetGhostTiers = async () => {
  return cachified({
    key: "getGhostTiers",
    cache: cache,
    getFreshValue: getGhostTiers,
    ttl: TIERS_CACHE_DURATION,
    reporter: verboseReporter(),
  });
};

export const getMemberActiveSubscriptions = async (memberId: string) => {
  const api = new TSGhostAdminAPI(
    env.GHOST_URL,
    env.GHOST_ADMIN_API_KEY,
    "v5.0"
  );
  const subscriptions = await api.members
    .read({ id: memberId })
    .fields({ subscriptions: true })
    .fetch();
  invariant(subscriptions.success, "Failed to fetch subscriptions");
  return subscriptions.data.subscriptions.filter(
    (sub) => sub.status === "active"
  );
};

export const getMember = async (memberId: string) => {
  const api = new TSGhostAdminAPI(
    env.GHOST_URL,
    env.GHOST_ADMIN_API_KEY,
    "v5.0"
  );
  const membersQuery = await api.members.read({ id: memberId }).fetch();
  invariant(membersQuery.success, "Failed to fetch membersQuery");
  return membersQuery.data;
};

export const getAllTags = async () => {
  const api = new TSGhostContentAPI(
    env.GHOST_URL,
    env.GHOST_CONTENT_API_KEY,
    "v5.0"
  );
  const tags = await api.tags
    .browse({
      filter: "visibility:public",
    })
    .include({ "count.posts": true })
    .fetch();
  if (!tags.success) {
    console.log(tags);
  }
  invariant(tags.success, "Failed to fetch tags");
  return {
    tags: tags.data.filter((t) => (t.count?.posts || 0) > 0),
  };
};

export const getAllAuthors = async () => {
  const api = new TSGhostContentAPI(
    env.GHOST_URL,
    env.GHOST_CONTENT_API_KEY,
    "v5.0"
  );
  const authors = await api.authors
    .browse({
      limit: "all",
    })
    .include({ "count.posts": true })
    .fetch();
  if (!authors.success) {
    console.log(authors);
  }
  invariant(authors.success, "Failed to fetch authors");
  return {
    authors: authors.data.filter((t) => (t.count?.posts || 0) > 0),
  };
};
