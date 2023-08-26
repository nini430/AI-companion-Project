import React from 'react';

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full h-full mx-auto max-w-4xl">{children}</div>;
};

export default ChatLayout;
