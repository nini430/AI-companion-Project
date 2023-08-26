'use client';

import { ChangeEvent, FormEvent } from 'react';
import { ChatRequestOptions } from 'ai';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SendHorizonal } from 'lucide-react';

interface IChatFormProps {
  input: string;
  isLoading: boolean;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
}

const ChatForm = ({
  input,
  isLoading,
  handleInputChange,
  onSubmit,
}: IChatFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-x-2 border-t border-primary/10 p-4">
      <Input
        value={input}
        placeholder="Type a message"
        onChange={handleInputChange}
        className="rounded-lg bg-primary/10"
        disabled={isLoading}
      />
      <Button disabled={isLoading} className='bg-secondary' variant='ghost' >
        <SendHorizonal className='w-6 h-6'/>
      </Button>
    </form>
  );
};

export default ChatForm;
