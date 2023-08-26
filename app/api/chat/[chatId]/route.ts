import { StreamingTextResponse, LangChainStream } from 'ai';
import { CallbackManager } from 'langchain/callbacks';
import { Replicate } from 'langchain/llms/replicate';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';

import { rateLimit } from '@/lib/rate-limit';
import { MemoryManager } from '@/lib/memory';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await req.json();
    const user = await currentUser();

    if (!user || !user.id || !user.firstName) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const identifier = req.url + '-' + user.id;
    const { success } = await rateLimit(identifier);
    if (!success) {
      return new NextResponse('Message calls exceeded', { status: 429 });
    }

    const companion = await prisma.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            role: 'user',
            content: prompt,
            userId: user.id,
          },
        },
      },
    });
    if (!companion) {
      return new NextResponse('Companion not found', { status: 404 });
    }

    const name = companion.id;
    const companion_file_name = name + '.txt';

    const companionKey = {
      companionName: name,
      modelName: 'llama2-13b',
      userId: user.id,
    };

    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(companionKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, '\n\n', companionKey);
    }

    await memoryManager.writeToHistory('User: ' + prompt + '\n', companionKey);

    const recentChats = await memoryManager.readLatestHistory(companionKey);

    const similarDocs = await memoryManager.vectorSearch(
      recentChats,
      companion_file_name
    );
    let relevantHistory = '';
    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join('\n');
    }

    const { handlers } = LangChainStream();

    const model = new Replicate({
      model:
        'a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5',
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN!,
      callbacks: CallbackManager.fromHandlers(handlers),
    });
    model.verbose = true;
    const resp = String(
      await model
        .call(
          `
            ONLY generate plain sentences without prefix of who is speaking, DO NOT use ${companion.name}: prefix

            ${companion.instructions}

            Below are the relevant details about ${companion.name}'s past and the conversation you are in.
            ${relevantHistory}

            ${relevantHistory}\n${companion.name}:
        `
        )
        .catch(console.error)
    );

    const cleaned = resp.replaceAll(',', '');
    const chunks = cleaned.split('\n');
    const response = chunks[0];

    await memoryManager.writeToHistory('' + response.trim(), companionKey);

    var Readable = require('stream').Readable;

    let s = new Readable();
    s.push(response);
    s.push(null);

    if (response !== undefined && response.length > 1) {
      await memoryManager.writeToHistory('' + response.trim(), companionKey);
    }

    await prisma.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            role: 'system',
            content: response.trim(),
            userId: user.id,
          },
        },
      },
    });

    return new StreamingTextResponse(s);
  } catch (err) {
    console.log('CHAT_[POST] error');
    return new NextResponse('Internal error', { status: 500 });
  }
}
