import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';

interface UserDropdownProps {
  name: string | null;
  email: string | null;
  imageUrl: string | null;
}

export function UserDropdown({ name, email, imageUrl }: UserDropdownProps) {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full p-0"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={imageUrl || ""} alt={name || "User"} />
            <AvatarFallback>
              {name ? name.charAt(0).toUpperCase() : email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-3 border-b">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={imageUrl || ""} alt={name || "User"} />
              <AvatarFallback>
                {name ? name.charAt(0).toUpperCase() : email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="font-medium truncate">{name || email || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm p-2 mt-1"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
}