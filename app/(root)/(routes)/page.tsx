import Categories from '@/components/categories';
import Companions from '@/components/companions';
import SearchInput from '@/components/search-input';
import prisma from '@/lib/prisma';

interface IRootProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: IRootProps) => {
  const categories = await prisma?.category.findMany({});
  const data = await prisma.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
  return (
    <div className="h-full p-10">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  );
};

export default RootPage;
