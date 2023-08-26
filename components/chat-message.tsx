import { useTheme } from 'next-themes';
import { BeatLoader } from 'react-spinners';

import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';
import BotAvatar from './bot-avatar';
import UserAvatar from './user-avatar';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';

export interface IChatMessageProps {
  role: 'user' | 'system';
  isLoading?: boolean;
  content?: string;
  src?: string;
}

const ChatMessage = ({ role, isLoading, content, src }: IChatMessageProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();

  const onCopy = () => {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content);

    toast({
      description: 'Message copied to the clipboard!',
    });
  };
  return (
    <div
      className={cn(
        'px-4 py-2 group rounded-md flex items-start gap-x-2',
        role === 'user' && 'justify-end'
      )}
    >
      {role !== 'user' && src && <BotAvatar src={src} />}
      <div className="py-2 px-4 rounded-md bg-primary/10">
        <p>
          {isLoading ? (
            <BeatLoader
              color={theme === 'light' ? 'black' : 'white'}
              size={5}
            />
          ) : (
            content
          )}
        </p>
      </div>
      {role === 'user' && <UserAvatar />}
      {role === 'system' && content && (
        <Button
         onClick={onCopy}
          className="opacity-0 group-hover:opacity-100 transition"
          variant="ghost"
          size="icon"
        >
          <Copy className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatMessage;
