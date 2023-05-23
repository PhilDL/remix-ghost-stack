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
import type { Settings, Tag } from "@ts-ghost/content-api";
import {
  Calculator,
  Calendar,
  CreditCard,
  Loader2Icon,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings as SettingsIcon,
  Smile,
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
  Command,
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
    if (command.submission?.formData?.get("search")) {
      setPages([...pages, command.submission.formData.get("search") as string]);
    }
  }, [command.submission]);

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
        <Button variant={"ghost"} size={"sm"} onClick={(e) => setOpen(true)}>
          <Search className="h-6 w-6 " />
        </Button>
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
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
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
                      { action: "action/command", method: "post" }
                    );
                  }}
                >
                  <Tags className="mr-2 h-4 w-4" />
                  <span>Search Tags</span>
                </CommandItem>
                <CommandItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Search Authors</span>
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
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading...</span>
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
        </CommandList>
      </CommandDialog>
    </nav>
  );
};
