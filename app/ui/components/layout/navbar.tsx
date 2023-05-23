import React, { Fragment, useEffect, useRef, useState } from "react";
import { NavbarListItem } from "./navbar-list-item";
import { NavbarListItemMobile } from "./navbar-list-item-mobile";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  Link,
  NavLink,
  useFetcher,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import type { Author, Post, Settings, Tag } from "@ts-ghost/content-api";
import {
  Book,
  CreditCard,
  Loader2Icon,
  LogIn,
  LogOut,
  Menu,
  TagIcon,
  Tags,
  User,
  UserCircle,
  UserPlus,
} from "lucide-react";
import { nameInitials } from "~/ui/utils";
import { Theme, useTheme } from "~/ui/utils/theme-provider";

import { Button } from "~/ui/components";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/components/avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
  CommandShortcut,
} from "~/ui/components/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/ui/components/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "~/ui/components/navigation-menu";
import { ScrollArea } from "~/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/ui/components/sheet";
import { ThemeToggle } from "~/ui/components/theme-toggle";
import ThemeToggleIcon from "~/ui/components/theme-toggle-icon";

import type { MemberSession } from "~/services/auth.server";

const themes = [Theme.LIGHT, Theme.DARK];

const menus = [
  {
    label: "TypeScript",
    href: "/tag/typescript",
    image:
      "https://digitalpress.fra1.cdn.digitaloceanspaces.com/0bwz1yk/2023/05/ts-logo-512.png",
    description: "Compilation of articles about TypeScript.",
  },
  {
    label: "@ts-ghost",
    href: "/tag/ts-ghost",
    description: "@ts-ghost are Fully type safe tools for Ghost CMS.",
  },
  {
    label: "Remix",
    href: "/tag/remix",
    description: "Remix is a modern React web framework.",
  },
  {
    label: "JavaScript",
    href: "/tag/javascript",
    description: "Always bet on JavaScript",
  },
];

export const Navbar = ({
  settings,
  user,
}: {
  settings: Settings;
  user: MemberSession | undefined | null;
}) => {
  const [theme, setTheme] = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const commandRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const command = useFetcher();
  const [pages, setPages] = useState<string[]>([]);
  const page = pages[pages.length - 1];
  const transition = useNavigation();
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
    if (transition.state === "idle") {
      setMobileMenuOpen(false);
    }
  }, [transition.state]);

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
      setPages([...pages, command.formData.get("search") as string]);
    }
  }, [command.formData]);

  function handleChange() {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  }

  return (
    <nav
      className="flex items-center bg-white py-4 dark:bg-slate-950"
      onKeyDown={(e) => {
        // Backspace goes to previous page when search is empty
        if (e.key === "Backspace" && !search) {
          e.preventDefault();
          setPages((pages) => pages.slice(0, -1));
        }
      }}
    >
      <div className="flex flex-1 flex-row justify-start gap-4">
        <Link to="/">
          <img
            src={settings.logo ?? ""}
            alt={settings.title}
            className="max-h-10 w-auto"
          />
        </Link>
        <NavigationMenu className="hidden justify-start lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Collection</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  {menus.map((menu) => (
                    <Fragment key={menu.href}>
                      {menu.image ? (
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <NavLink
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              to={menu.href}
                            >
                              <AspectRatio
                                ratio={4 / 3}
                                className="flex w-full items-center justify-center"
                              >
                                <img
                                  src={menu.image}
                                  alt={menu.label}
                                  className="max-h-24"
                                />
                              </AspectRatio>
                              <div className="mb-2 mt-4 text-lg font-medium">
                                {menu.label}
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                {menu.description}
                              </p>
                            </NavLink>
                          </NavigationMenuLink>
                        </li>
                      ) : (
                        <NavbarListItem
                          to={menu.href}
                          title={menu.label}
                          key={menu.href}
                        >
                          {menu.description}
                        </NavbarListItem>
                      )}
                    </Fragment>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {settings.navigation.map((item) => (
              <NavigationMenuItem key={item.url}>
                <NavLink to={item.url}>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    asChild
                  >
                    <span>{item.label}</span>
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
      <div className="flex flex-1 items-center justify-end gap-1 text-slate-700 opacity-100 dark:text-slate-100 lg:gap-0.5">
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
                        { action: "/action/command", method: "post" }
                      );
                    }}
                  >
                    <Tags className="mr-2 h-4 w-4" />
                    <span>Search Tags</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => {
                      command.submit(
                        { search: "authors" },
                        { action: "/action/command", method: "post" }
                      );
                    }}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Search Authors</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => {
                      command.submit(
                        { search: "posts" },
                        { action: "/action/command", method: "post" }
                      );
                    }}
                  >
                    <Book className="mr-2 h-4 w-4" />
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
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <CommandShortcut>⌘P</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
            {page === "tags" && (
              <>
                {command.state !== "idle" ? (
                  <CommandLoading>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
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
                        <TagIcon className="mr-2 h-4 w-4" />
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
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
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
                        <UserCircle className="mr-2 h-4 w-4" />
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
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
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
        <ThemeToggle className="hidden lg:flex" />
        <Sheet onOpenChange={setMobileMenuOpen} open={mobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"sm"} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent position="right" size={"xl"}>
            <SheetHeader>
              <SheetTitle>{settings.title}</SheetTitle>
              <SheetDescription>{settings.description}</SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[80%] w-full">
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                {menus.map((menu) => (
                  <Fragment key={menu.href}>
                    {menu.image ? (
                      <li className="row-span-3">
                        <div>
                          <NavLink
                            className="flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            to={menu.href}
                          >
                            <div className="flex items-center justify-center">
                              <img
                                src={menu.image}
                                alt={menu.label}
                                className="max-h-24"
                              />
                            </div>
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {menu.label}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {menu.description}
                            </p>
                          </NavLink>
                        </div>
                      </li>
                    ) : (
                      <NavbarListItemMobile to={menu.href} title={menu.label}>
                        {menu.description}
                      </NavbarListItemMobile>
                    )}
                  </Fragment>
                ))}
              </ul>
            </ScrollArea>

            {/* <SheetFooter>Footer</SheetFooter> */}
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"sm"}>
              {user ? (
                <Avatar className="h-8 w-8 hover:cursor-pointer">
                  <AvatarImage src={user.avatar_image} />
                  <AvatarFallback>
                    {nameInitials(user.name || user.email)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-6 w-6 hover:cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user ? (
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign-In</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/join">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Join</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator className="lg:hidden" />
            <DropdownMenuGroup className="lg:hidden">
              {themes.map((t) => (
                <DropdownMenuItem key={t} onClick={handleChange} asChild>
                  <label>
                    <ThemeToggleIcon
                      theme={t}
                      checked={theme === t}
                      className="mr-2 h-4 w-4"
                    />
                    <span>{t === "light" ? "Light" : "Dark"}</span>
                    <input
                      type="radio"
                      name="theme-toggle-user"
                      className="absolute inset-0 z-[-1] opacity-0"
                      checked={theme === t}
                      value={t}
                      title={`Use ${t} theme`}
                      aria-label={`Use ${t} theme`}
                      onChange={handleChange}
                    />
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {user && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
