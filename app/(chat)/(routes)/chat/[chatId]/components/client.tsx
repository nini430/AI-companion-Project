'use client';

import ChatHeader from '@/components/chatHeader';
import { Companion, Message } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { useCompletion } from 'ai/react';
import ChatForm from '@/components/chat-form';
import ChatMessages from '@/components/chat-messages';
import { IChatMessageProps } from '@/components/chat-message';

interface IChatClientProps {
  companion: Companion & {
    messages: IChatMessageProps[];
    _count: { messages: number };
  };
}

const ChatClient = ({ companion }: IChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<IChatMessageProps[]>(
    companion.messages
  );
  const { handleSubmit, input, setInput, isLoading, handleInputChange } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      onFinish(prompt, completion) {
        const systemMessage:IChatMessageProps = {
          role: 'system',
          content: completion,
        };

        setMessages((prev) => [...prev, systemMessage]);

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage:IChatMessageProps = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    handleSubmit(e);
  };
  return (
    <div className="h-full flex flex-col p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        isLoading={isLoading}
        messages={messages}
        companion={companion}
      />
      <ChatForm
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        input={input}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatClient;
