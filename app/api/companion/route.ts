import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import checkSubscription from '@/lib/subscription';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { name, description, categoryId, instructions, seed, src } = body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (
      !name ||
      !description ||
      !categoryId ||
      !instructions ||
      !seed ||
      !src
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    //TODO: to the subscription check

    const isPro = await checkSubscription();
    if (!isPro) {
      return new NextResponse('Action not allowed', { status: 403 });
    }

    const companion = await prisma.companion.create({
      data: {
        userId: user.id,
        userName: user.firstName,
        description,
        name,
        instructions,
        seed,
        src,
        categoryId,
      },
    });

    return NextResponse.json(companion, { status: 201 });
  } catch (err) {
    console.log('Internal error', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
