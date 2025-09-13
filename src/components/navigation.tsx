import { Home, MapPin, AlertTriangle, BarChart3, FileText, User } from "lucide-react";

interface NavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export function Navigation({ activeScreen, onScreenChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alerts' },
    { id: 'simulation', icon: BarChart3, label: 'Simulate' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onScreenChange(id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              activeScreen === id
                ? 'text-primary bg-accent/50'
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}