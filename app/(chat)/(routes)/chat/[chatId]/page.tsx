import prisma from '@/lib/prisma';
import { auth, RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import ChatClient from './components/client';

interface IChatIdPageProps {
  params: {
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: IChatIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return RedirectToSignIn;
  }
  const companion=await prisma.companion.findUnique({
    where:{
        id:params.chatId,
    },
    include:{
        messages:{
            where:{
                userId
            },
            orderBy:{
                createdAt:'asc'
            }
        },
        _count:{
            select:{
                messages:true
            }
        }
    },

  })

  if (!companion) {
    return redirect('/');
  }

  return (
    <ChatClient companion={companion}/>
  );
};

export default ChatIdPage;
