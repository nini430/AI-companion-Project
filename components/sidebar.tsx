'use client';

import useProModal from '@/hooks/use-pro-modal';
import { cn } from '@/lib/utils';
import { Home, Settings, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const routes = [
  {
    icon: Home,
    label: 'Home',
    pro: false,
    link: '/',
  },
  {
    icon: Plus,
    label: 'Create New',
    pro: true,
    link: '/companion/new',
  },
  {
    icon: Settings,
    label: 'Settings',
    pro: false,
    link: '/settings',
  },
];

interface ISidebarProps {
  isPro:boolean;
}

const Sidebar = ({isPro}:ISidebarProps) => {
  const router = useRouter();
  const proModal=useProModal();
  const onNavigate = (url: string, pro: boolean) => {

    if(pro && !isPro) {
      return proModal.onOpen();
    }
    router.push(url);
  };
  return (
    <div className="p-4 h-full flex flex-col items-center bg-secondary">
      <div className="flex flex-col gap-y-3">
        {routes.map((route) => (
          <div
            onClick={() => onNavigate(route.link, route.pro)}
            key={route.link}
            className={cn(
              'p-2 flex cursor-pointer flex-col items-center gap-y-1 text-muted-foreground transition hover:text-primary hover:bg-primary/10'
            )}
          >
            <route.icon className="w-5 h-5" />
            <p className="text-center">{route.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
