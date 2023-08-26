'use client'

import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import qs from 'query-string'
import React from 'react';
import {useRouter,useSearchParams} from 'next/navigation'

interface ICategoryProps {
  data: Category[] | null;
}

const Categories = ({ data }: ICategoryProps) => {
  const router=useRouter();
  const searchParams=useSearchParams();

  const categoryId=searchParams.get('categoryId');

  const onClick=(id:string|undefined)=>{
    const query={
      categoryId:id
    }
    const url=qs.stringifyUrl({
      url:window.location.href,
      query
    },{skipNull:true})

    router.push(url);
  }
  return (
    <div className="w-full flex overflow-x-auto p-2">
      <button
        onClick={()=>onClick(undefined)}
        className={cn(`
            flex
            text-center
            items-center
            bg-primary/10
            hover:opacity-75
            transition
            px-10
            py-4
            rounded-full
        `,
        !categoryId ? 'bg-primary/25':'bg-primary/10'
        )}
      >
        Newest
      </button>
      {data &&
        data.map((category) => (
          <button
            onClick={()=>onClick(category.id)}
            key={category.id}
            className={cn(`
            flex
            text-center
            items-center
            bg-primary/10
            hover:opacity-75
            transition
            px-10
            py-4
            rounded-full
            mx-3
        `,
        category.id===categoryId ? 'bg-primary/25':'bg-primary/10'
        )}
          >
            {category.name}
          </button>
        ))}
    </div>
  );
};

export default Categories;
