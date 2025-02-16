
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  FileText,
  Users,
  LogOut,
  Menu,
  DropletIcon,
} from "lucide-react";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/authority" },
    { name: "All Users", icon: Users, path: "/authority/users" },
    { name: "Reports", icon: FileText, path: "/authority/reports" },
    { name: "Settings", icon: Settings, path: "/authority/settings" },
  ];

  return (
    <div
      className={cn(
        "h-screen sticky top-0 bg-card border-r transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center gap-4">
          <DropletIcon className="h-8 w-8 text-primary shrink-0" />
          {!isCollapsed && (
            <span className="font-semibold text-xl">Water Authority</span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-6"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                  "hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-4"
            onClick={() => {
              // Handle logout
            }}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};
