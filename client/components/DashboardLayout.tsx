import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import BottomNav from "./BottomNav";
import { cn } from "../lib/utils";
import GlobalSearch from "./GlobalSearch";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  FileText,
  Users,
  Calendar,
  LogOut,
  Settings,
  User,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
    icon: BookOpen,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Notes",
    href: "/dashboard/notes",
    icon: FileText,
  },
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
];

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: (typeof navigationItems)[0];
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.title}
    </Link>
  );
}

function Sidebar({ className }: { className?: string }) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r bg-gradient-to-b from-sidebar to-sidebar/90",
        className,
      )}
    >
      <div className="flex h-14 items-center border-b/50 px-4 backdrop-blur">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-sidebar-foreground">SkyTrack</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
          />
        ))}
      </nav>
    </div>
  );
}

function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden shadow-sm">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-14 items-center border-b/50 px-4 backdrop-blur">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BookOpen className="h-4 w-4" />
            </div>
            <span>SkyTrack</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={location.pathname === item.href}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:bg-accent/60"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col space-y-0.5">
            <p className="truncate font-medium leading-tight">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/dashboard/profile">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Ajustes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardLayout() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-16 items-center px-3 lg:px-6 bg-transparent">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex h-12 items-center justify-between rounded-full bg-background/70 backdrop-blur px-2 shadow-sm">
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="hidden md:flex items-center gap-2 px-2 text-sm font-semibold text-foreground/90">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/90 text-primary-foreground shadow-sm">
                    <BookOpen className="h-3.5 w-3.5" />
                  </span>
                  <span>SkyTrack</span>
                </Link>
              </div>
              <div className="flex-1 flex justify-center px-2">
                <div className="hidden md:block w-full max-w-md">
                  {/* Global Search */}
                  <GlobalSearch />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-6 lg:pb-28">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
