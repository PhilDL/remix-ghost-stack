import React, { useEffect, useState } from "react";
import { NavbarListItem } from "./navbar-list-item";
import { NavbarListItemMobile } from "./navbar-list-item-mobile";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Link, NavLink, useNavigation } from "@remix-run/react";
import type { Settings } from "@ts-ghost/content-api";
import {
  CreditCard,
  LogIn,
  LogOut,
  Menu,
  Search,
  User,
  UserPlus,
} from "lucide-react";
import { nameInitials } from "~/ui/utils";
import { Theme, useTheme } from "~/ui/utils/theme-provider";

import { ThemeToggle } from "~/ui/components/theme-toggle";
import ThemeToggleIcon from "~/ui/components/theme-toggle-icon";
import { Button } from "~/ui/components";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/components/avatar";
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

import type { MemberSession } from "~/blog/services/auth.server";

const themes = [Theme.LIGHT, Theme.DARK];

export const Navbar = ({
  settings,
  user,
}: {
  settings: Settings;
  user: MemberSession | undefined | null;
}) => {
  const [theme, setTheme] = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const transition = useNavigation();

  useEffect(() => {
    if (transition.state === "idle") {
      setMobileMenuOpen(false);
    }
  }, [transition.state]);

  function handleChange() {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  }

  return (
    <nav className="flex items-center bg-white py-4 dark:bg-slate-950">
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
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <NavLink
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        to="/tag/owl"
                      >
                        <AspectRatio
                          ratio={4 / 3}
                          className="flex w-full items-center justify-center"
                        >
                          <img
                            src="https://codingdodo.com/content/images/2021/05/tag-owl.png"
                            alt="OWL"
                            className="max-h-24"
                          />
                        </AspectRatio>
                        <div className="mb-2 mt-4 text-lg font-medium">OWL</div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Compilation of articles about OWL the Odoo Web Library
                          starting from Odoo 14 onwards.
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <NavbarListItem to="/tag/odoo-16" title="Odoo 16">
                    Articles about the latest Odoo version
                  </NavbarListItem>
                  <NavbarListItem to="/tag/javascript" title="JavaScript">
                    Using the Odoo JavaScript Framework to build custom views
                    and widgets.
                  </NavbarListItem>
                  <NavbarListItem to="/tag/odoo-15" title="Odoo 15">
                    Articles about Odoo version 15
                  </NavbarListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink to="/courses">
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <span>Courses</span>
                </NavigationMenuLink>
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <NavLink to="/contact">Contact</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
      <div className="flex flex-1 items-center justify-end gap-1 text-slate-700 opacity-100 dark:text-slate-100 lg:gap-0.5">
        <Button variant={"ghost"} size={"sm"}>
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
              <SheetTitle>CodingDodo</SheetTitle>
              <SheetDescription>{settings.description}</SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[80%] w-full">
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <div>
                    <NavLink
                      className="flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      to="/tag/owl"
                    >
                      <div className="flex items-center justify-center">
                        <img
                          src="https://codingdodo.com/content/images/2021/05/tag-owl.png"
                          alt="OWL"
                          className="max-h-24"
                        />
                      </div>
                      <div className="mb-2 mt-4 text-lg font-medium">OWL</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Compilation of articles about OWL the Odoo Web Library
                        starting from Odoo 14 onwards.
                      </p>
                    </NavLink>
                  </div>
                </li>
                <NavbarListItemMobile to="/tag/odoo-16" title="Odoo 16">
                  Articles about the latest Odoo version
                </NavbarListItemMobile>
                <NavbarListItemMobile to="/tag/javascript" title="JavaScript">
                  Using the Odoo JavaScript Framework to build custom views and
                  widgets.
                </NavbarListItemMobile>
                <NavbarListItemMobile to="/tag/odoo-15" title="Odoo 15">
                  Articles about Odoo version 15
                </NavbarListItemMobile>
                <NavbarListItemMobile to="/courses" title="Courses">
                  Full courses about OWL, JavaScript Odoo development
                </NavbarListItemMobile>
                <NavbarListItemMobile to="/contact" title="Contact">
                  For business inquiries or just to say hello.
                </NavbarListItemMobile>
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
