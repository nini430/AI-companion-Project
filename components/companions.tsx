import { Companion } from '@prisma/client';
import React from 'react';
import Image from 'next/image';
import {MessagesSquare} from 'lucide-react'
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import Link from 'next/link';

interface ICompanionProps {
  data: (Companion & { _count: { messages: number } })[];
}

const Companions = ({ data }: ICompanionProps) => {
  if (data.length === 0) {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <div className="relative w-60 h-60">
          <Image src={'/empty.png'} alt="" fill className="grayscale" />
        </div>
        <p className='text-muted-foreground text-center'>No Companions found</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {data.map(item=>(
            <Card key={item.id} className='bg-primary/10 transition hover:opacity-75'>
                <Link href={`/chat/${item.id}`}>
                <CardHeader className='flex justify-center items-center text-center'>
                <div className='relative w-32 h-32'>
                    <Image fill src={item.src} alt=''/>
                </div>
                <p className='font-bold'>{item.name}</p>
                <p className='text-xs'>{item.description}</p>
            </CardHeader>
            <CardFooter className='flex justify-between items-center'>
                <p className='text-muted-foreground lowercase'>@{item.userName}</p>
                <div className='flex'>
                    <MessagesSquare/>
                    <p className='ml-2'>{item._count.messages}</p>
                </div>
            </CardFooter>
                </Link>
            
            </Card>
        ))}
    </div>
  );
};

export default Companions;
