import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { recipientName, senderName, style, category } = await req.json();

  const stylePrompts: Record<string, string> = {
    romantic: 'deeply romantic, poetic, and passionate',
    funny: 'hilariously funny, witty, and playful with jokes',
    emotional: 'deeply emotional, heartfelt, and moving',
    cute: 'adorably cute, sweet, and wholesome',
    'best-friend': 'like a best friend talking to another, nostalgic and fun',
    sibling: 'like a loving sibling, full of memories and inside jokes',
    formal: 'professional, dignified, and respectful',
    'heart-touching': 'deeply sentimental and heart-touching with meaningful words',
  };

  const categoryContext: Record<string, string> = {
    birthday: 'birthday wish',
    anniversary: 'anniversary message',
    'best-friend': 'best friend appreciation message',
    couple: 'romantic message for partner',
    farewell: 'heartfelt farewell message',
    friendship: 'friendship appreciation message',
    proposal: 'marriage proposal message',
    'memory-collection': 'message about shared memories',
  };

  const prompt = `Write a beautiful, personal ${categoryContext[category] || 'wish'} for ${recipientName} from ${senderName}. 
Make it ${stylePrompts[style] || 'heartfelt'}. 
Write 3-5 sentences. Make it feel personal, authentic, and memorable. 
Don't use generic phrases. Add relevant emojis naturally throughout. 
Return ONLY the message text, no quotes or labels.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error('AI API error');
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    return NextResponse.json({ wish: text });
  } catch {
    // Fallback wishes
    const fallbacks: Record<string, string> = {
      romantic: `My dearest ${recipientName}, every sunrise reminds me of you — warm, beautiful, and full of promise 🌅. You are the poetry my heart has always wanted to write, the song my soul hums in quiet moments 💕. With you, every ordinary day turns into something extraordinary. Forever grateful you're mine. Love, ${senderName} ❤️`,
      funny: `Dear ${recipientName}, after careful scientific research and 3 bowls of cereal, I've concluded you are officially the BEST human I know 😂🏆. Sure, you're a little chaotic, slightly dramatic, and annoyingly lovable — but that's exactly why I love you! Here's to another year of your legendary existence! 🎉 — ${senderName}`,
      emotional: `${recipientName}, there are moments in life that redefine everything, and knowing you is one of mine 🥺. You've brought so much light, laughter, and love into my world without even trying. I hope this day reminds you just how deeply you are cherished and how beautifully you touch every life around you 💗. With all my love, ${senderName}`,
      cute: `Hi ${recipientName}! 🌸 Just wanted to remind you that you're basically sunshine in human form ☀️ and the world is just a bit more magical because you're in it! You deserve all the cake, all the hugs, and every happy thing 🎂🤗. Sending you the biggest virtual squeeze! Love, ${senderName} 💖`,
    };

    const wish =
      fallbacks[style] ||
      `Dear ${recipientName}, wishing you all the happiness, love, and magic this world has to offer 🌟. You deserve every beautiful thing coming your way. With love, ${senderName} 💕`;
    return NextResponse.json({ wish });
  }
}
