import { useLocation } from "wouter";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function UserAvatarDropdown() {
  const [, navigate] = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("indexflow_admin_session");
    localStorage.removeItem("indexflow_session");
    localStorage.removeItem("indexflow_workspace_id");
    navigate("/");
  };

  const handleAccountClick = () => {
    navigate("/account");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-user-avatar">
          <Avatar>
            <AvatarFallback data-testid="avatar-fallback">U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel data-testid="label-my-account">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div data-testid="menu-theme-toggle">
          <ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleAccountClick}
          data-testid="menu-item-account"
        >
          <Settings className="w-4 h-4 mr-2" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          data-testid="menu-item-sign-out"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
