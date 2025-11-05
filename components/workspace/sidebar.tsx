"use client";

import { Plus, Home, Search, LayoutGrid, Moon, Sun, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const navItems = [
    { icon: Home, label: "Home", href: "/workspace" },
    { icon: Search, label: "Search", href: "#" },
    { icon: LayoutGrid, label: "Projects", href: "#" },
    { icon: Clock, label: "Recent", href: "#" },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col w-16 border-r bg-background h-full sticky top-0",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center py-4 space-y-4">
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-lg hover:bg-primary/10"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center space-y-2 py-4">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-lg hover:bg-primary/10"
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col items-center py-4 space-y-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-lg hover:bg-primary/10"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-lg hover:bg-primary/10"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
          U
        </div>
      </div>
    </aside>
  );
}
