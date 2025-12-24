import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Moon, Sun, LogOut, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const ProfileMenu = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.'
    });
  };

  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            className="w-10 h-10 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-5 h-5 text-foreground/70" />
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md border-border/50">
          <DropdownMenuLabel className="text-foreground/80">
            <div className="flex flex-col">
              <span>Profile</span>
              {user?.email && (
                <span className="text-xs font-normal text-muted-foreground truncate">
                  {user.email}
                </span>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>Dark Mode</span>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
              onClick={(e) => e.stopPropagation()}
            />
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
              onClick={(e) => e.stopPropagation()}
            />
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <HelpCircle className="w-4 h-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};
