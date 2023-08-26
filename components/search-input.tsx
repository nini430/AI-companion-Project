'use client';

import qs from 'query-string';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import useDebounce from '@/hooks/useDebounce';

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>('');
  const categoryId = searchParams.get('categoryId');
  const name = searchParams.get('name');
  const debouncedValue = useDebounce(value, 500);
  useEffect(() => {
    const query = {
      name: debouncedValue,
      categoryId,
    };
    const url = qs.stringifyUrl({
      url: window.location.pathname,
      query,
    },{skipEmptyString:true,skipNull:true});
    router.push(url);
  }, [debouncedValue, router, categoryId]);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div className="relative">
      <Search className="text-muted-foreground w-4 h-4 absolute top-3 left-3" />
      <Input
        onChange={onChange}
        value={value}
        className="pl-10 bg-primary/10"
        placeholder="Search... "
      />
    </div>
  );
};

export default SearchInput;
