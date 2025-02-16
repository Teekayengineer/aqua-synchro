
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
        "h-screen sticky top-0 bg-card border-r border-white/10 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center gap-4">
          <img 
            src="/lovable-uploads/463c8d26-7cb2-4465-a222-5dbccc71c495.png" 
            alt="AquaSync Logo" 
            className="h-8 w-8 object-contain"
          />
          {!isCollapsed && (
            <span className="font-semibold text-xl bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              Water Authority
            </span>
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
                  "hover:bg-primary/10",
                  isActive 
                    ? "bg-primary/15 text-primary" 
                    : "text-muted-foreground"
                )
              }
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 text-muted-foreground hover:text-primary hover:bg-primary/10"
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
