'use client';

import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { Menu, Sparkles } from 'lucide-react';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './mode-toggle';
import MobileSidebar from './mobilesidebar';
import useProModal from '@/hooks/use-pro-modal';

const font = Poppins({
  weight: '600',
  subsets: ['latin'],
});

interface INavbarBarProps {
  isPro: boolean;
}
const Navbar = ({ isPro }: INavbarBarProps) => {
  const proModal = useProModal();
  return (
    <div className="fixed flex w-full justify-between items-center bg-secondary broder-bottom border-primary/10 py-2 px-4">
      <div className="flex items-center h-16">
        <MobileSidebar />
        <Link href="/">
          <h1
            className={cn(
              'font-bold md:text-3xl textprimary text-xl md:block hidden',
              font.className
            )}
          >
            Companion.ai
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {!isPro && (
          <Button onClick={proModal.onOpen} variant="premium">
            Upgrade <Sparkles className="w-4 h-4 ml-4" />
          </Button>
        )}
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
