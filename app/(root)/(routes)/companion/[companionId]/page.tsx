import React from 'react';
import prisma from '@/lib/prisma';
import CompanionForm from './components/CompanionForm';
import { RedirectToSignIn, auth } from '@clerk/nextjs';

interface ICompanionPageProps {
  params: {
    companionId: string;
  };
}

const CompanionIdPage = async ({ params }: ICompanionPageProps) => {
  const { userId } = auth();
  if (!userId) {
    return RedirectToSignIn;
  }
  const companion = await prisma.companion.findUnique({
    where: { id: params.companionId, userId },
  });
  const categories = await prisma.category.findMany({});

  return (
    <div className="p-4">
      <CompanionForm initialData={companion} categories={categories} />
    </div>
  );
};

export default CompanionIdPage;
