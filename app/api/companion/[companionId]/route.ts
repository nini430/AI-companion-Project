import prisma from '@/lib/prisma';
import checkSubscription from '@/lib/subscription';
import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { name, description, categoryId, instructions, seed, src } = body;

    if (!params.companionId) {
      return new NextResponse('Companion id is required', { status: 400 });
    }

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

    //TODO: check for subscription

    const isPro = await checkSubscription();
    if (!isPro) {
      return new NextResponse('Action not allowed', { status: 403 });
    }

    const companion = await prisma.companion.update({
      where: { id: params.companionId, userId: user.id },
      data: {
        userId: user.id,
        userName: user.firstName,
        categoryId,
        name,
        description,
        instructions,
        seed,
        src,
      },
    });

    return NextResponse.json(companion, { status: 200 });
  } catch (err) {
    console.log(err, 'Internal error');
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    const companion = await prisma.companion.delete({
      where: {
        userId,
        id: params.companionId,
      },
    });

    return NextResponse.json(companion, { status: 200 });
  } catch (err) {
    console.log('Something went wrong', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
