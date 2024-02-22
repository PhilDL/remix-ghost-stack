import { useEffect, useRef, useState } from "react";
import { useFetcher, useNavigate, useNavigation } from "@remix-run/react";
import type { Author, Post, Tag } from "@ts-ghost/content-api";
import {
  Book,
  Loader2Icon,
  TagIcon,
  Tags,
  User,
  UserCircle,
} from "lucide-react";

import { Button } from "~/ui/components";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from "~/ui/components/command";

export const CommandBar = () => {
  const [open, setOpen] = useState(false);
  const commandRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const command = useFetcher();
  const [pages, setPages] = useState<string[]>([]);
  const page = pages[pages.length - 1];
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (command.state === "idle") {
      setSearch("");
      commandRef.current?.focus();
    }
  }, [command.state]);

  useEffect(() => {
    if (navigation.state === "idle") {
      setPages([]);
      setSearch("");
      setOpen(false);
    }
  }, [navigation.state]);

  useEffect(() => {
    if (command.formData?.get("search")) {
      setPages((p) => [...p, command.formData?.get("search") as string]);
    }
  }, [command.formData]);

  return (
    <div
      onKeyDown={(e) => {
        // Backspace goes to previous page when search is empty
        console.log(search);
        if (e.key === "Backspace" && !search) {
          console.log("backspace");
          e.preventDefault();
          setPages((pages) => pages.slice(0, -1));
        }
      }}
    >
      <Button
        variant="outline"
        className={
          "relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        }
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search content...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={
            page ? `Search ${page}...` : "Type a command or search..."
          }
          currentPage={page || undefined}
          value={search}
          onValueChange={setSearch}
          disabled={command.state !== "idle" || navigation.state !== "idle"}
          aria-disabled={
            command.state !== "idle" || navigation.state !== "idle"
          }
          ref={commandRef}
        />
        <CommandList>
          {command.state === "idle" && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {!page && (
            <>
              <CommandGroup heading="Suggestions">
                <CommandItem
                  onSelect={() => {
                    command.submit(
                      { search: "tags" },
                      { action: "/action/command", method: "get" }
                    );
                  }}
                >
                  <Tags className="mr-2 size-4" />
                  <span>Search Tags</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    command.submit(
                      { search: "authors" },
                      { action: "/action/command", method: "get" }
                    );
                  }}
                >
                  <UserCircle className="mr-2 size-4" />
                  <span>Search Authors</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    command.submit(
                      { search: "posts" },
                      { action: "/action/command", method: "get" }
                    );
                  }}
                >
                  <Book className="mr-2 size-4" />
                  <span>Search Posts</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem
                  onSelect={() => {
                    navigate(`/account`);
                  }}
                  disabled={navigation.state !== "idle"}
                >
                  <User className="mr-2 size-4" />
                  <span>Profile</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
          {page === "tags" && (
            <>
              {command.state !== "idle" ? (
                <CommandLoading>
                  <Loader2Icon className="mr-2 size-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Loading...</span>
                </CommandLoading>
              ) : (
                <>
                  {command.data?.tags.map((tag: Tag) => (
                    <CommandItem
                      key={tag.slug}
                      onSelect={() => {
                        navigate(`/tag/${tag.slug}`);
                      }}
                      disabled={navigation.state !== "idle"}
                    >
                      <TagIcon className="mr-2 size-4" />
                      <span>{tag.name}</span>
                    </CommandItem>
                  ))}
                </>
              )}
            </>
          )}
          {page === "authors" && (
            <>
              {command.state !== "idle" ? (
                <CommandLoading>
                  <Loader2Icon className="mr-2 size-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Loading...</span>
                </CommandLoading>
              ) : (
                <>
                  {command.data?.authors.map((author: Author) => (
                    <CommandItem
                      key={author.slug}
                      onSelect={() => {
                        navigate(`/author/${author.slug}`);
                      }}
                      disabled={navigation.state !== "idle"}
                    >
                      <UserCircle className="mr-2 size-4" />
                      <span>{author.name}</span>
                    </CommandItem>
                  ))}
                </>
              )}
            </>
          )}
          {page === "posts" && (
            <>
              {command.state !== "idle" ? (
                <CommandLoading>
                  <Loader2Icon className="mr-2 size-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Loading...</span>
                </CommandLoading>
              ) : (
                <>
                  {command.data?.posts.map((post: Post) => (
                    <CommandItem
                      key={post.slug}
                      onSelect={() => {
                        navigate(`/${post.slug}`);
                      }}
                      disabled={navigation.state !== "idle"}
                    >
                      <div className="flex flex-col px-2">
                        <span>{post.title}</span>
                        <p className="text-sm text-muted-foreground">
                          {post.custom_excerpt || post.excerpt}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};
