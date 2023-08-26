import { NextResponse } from 'next/server';
import { currentUser, auth } from '@clerk/nextjs';

import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { absolutePath } from '@/lib/utils';

const settingsUrl = absolutePath('/settings');

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse('unauthenticated', { status: 401 });
    }

    const userSubscription = await prisma.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'Companion PRO',
              description: 'Create Custom AI Companion',
            },
            unit_amount: 999,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });
    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (err) {
    console.log('[STRIPE_GET]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
