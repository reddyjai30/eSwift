import { Moon, Sun, Bell, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

interface ProfileScreenProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ isDarkMode, onThemeToggle, onLogout }: ProfileScreenProps) {
  const user = {
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john.doe@example.com',
  };

  return (
    <div className="px-4 pt-4 pb-6 space-y-6">
      {/* User Profile */}
      <div className="bg-[var(--bg-paper)] rounded-[var(--r-12)] p-4 shadow-e-1">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 bg-[var(--primary)] text-white">
            <AvatarFallback className="bg-[var(--primary)] text-white text-xl">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-[var(--text-primary)]">{user.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{user.phone}</p>
            <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="font-bold text-[var(--text-primary)] mb-3 px-1">Settings</h3>
        
        <div className="bg-[var(--bg-paper)] rounded-[var(--r-12)] shadow-e-1 divide-y divide-[var(--divider)]">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
              <div>
                <p className="font-medium text-[var(--text-primary)]">Dark Mode</p>
                <p className="text-xs text-[var(--text-secondary)]">Toggle dark theme</p>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={onThemeToggle} />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">Notifications</p>
                <p className="text-xs text-[var(--text-secondary)]">Order updates & offers</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Order Notifications */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">Order Alerts</p>
                <p className="text-xs text-[var(--text-secondary)]">Push notifications for orders</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Support & Legal */}
      <div>
        <h3 className="font-bold text-[var(--text-primary)] mb-3 px-1">Support & Legal</h3>
        
        <div className="bg-[var(--bg-paper)] rounded-[var(--r-12)] shadow-e-1 divide-y divide-[var(--divider)]">
          {/* Help & Support */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface)] transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-[var(--text-secondary)]" />
              <p className="font-medium text-[var(--text-primary)]">Help & Support</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>

          {/* Terms & Conditions */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface)] transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
              <p className="font-medium text-[var(--text-primary)]">Terms & Conditions</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>

          {/* Privacy Policy */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface)] transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
              <p className="font-medium text-[var(--text-primary)]">Privacy Policy</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 bg-[var(--bg-paper)] rounded-[var(--r-12)] p-4 shadow-e-1 text-[var(--error)] font-medium hover:bg-[var(--error)]/5 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

      {/* App Version */}
      <div className="text-center">
        <p className="text-xs text-[var(--text-secondary)]">eSwift v1.0.0</p>
      </div>
    </div>
  );
}
