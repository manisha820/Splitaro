import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems: { id: Screen; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Home', icon: 'home' },
    { id: 'group-detail', label: 'Groups', icon: 'groups' },
    { id: 'tracker', label: 'Track', icon: 'location_on' },
    { id: 'chat', label: 'Messages', icon: 'chat_bubble' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/90 backdrop-blur-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2rem]">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 ${
              isActive 
                ? 'bg-primary/10 text-primary rounded-2xl scale-110' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span 
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-wider mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
