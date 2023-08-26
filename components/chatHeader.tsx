import axios from 'axios';
import { Companion, Message } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import BotAvatar from './bot-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from './ui/use-toast';
import { auth, useUser } from '@clerk/nextjs';
import { IChatMessageProps } from './chat-message';

interface IChatHeaderProps {
  companion: Companion & {
    messages: IChatMessageProps[];
    _count: {
      messages: number;
    };
  };
}

const ChatHeader = ({ companion }: IChatHeaderProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const onDelete = async () => {
    try {
      await axios.delete(`/api/companion/${companion.id}`);
      toast({
        description: 'Success',
      });
      router.refresh();
      router.push('/');
    } catch (err) {
      toast({
        variant: 'destructive',
        description: 'something went wrong',
      });
    }
  };
  return (
    <div className="w-full pb-4 flex justify-between items-center border-b border-primary/10">
      <div className="flex items-center gap-x-2">
        <Button onClick={() => router.back()} size="icon" variant="ghost">
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <BotAvatar src={companion.src} />
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{companion.name}</p>
            <div className="flex items-center">
              <MessagesSquare className="mr-1" />
              {companion._count.messages}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {' '}
            Created By {companion.userName}
          </p>
        </div>
      </div>
      {user?.id === companion.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/companion/${companion.id}`)}
              className="cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer">
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ChatHeader;
