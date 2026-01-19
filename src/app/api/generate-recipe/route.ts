import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: 'Ingredientes são necessários' }, { status: 400 });
    }

    const prompt = `Você é um Chef Gourmet especializado em padaria e confeitaria. 
    Crie uma receita criativa usando (mas não limitada a) estes ingredientes disponíveis: ${ingredients.join(', ')}.
    A receita deve focar em reduzir o desperdício e ser lucrativa para uma padaria.
    
    Responda em formato JSON com a seguinte estrutura:
    {
      "title": "Nome da Receita",
      "description": "Uma breve descrição atraente focada em lucro e redução de desperdício",
      "difficulty": "Fácil|Médio|Difícil",
      "ingredients": [
        "quantidade e nome do ingrediente"
      ],
      "steps": [
        "passo a passo detalhado"
      ],
      "estimatedCost": "valor em R$",
      "preparationTime": "tempo total"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um chef assistente expert especializado em padarias inteligentes." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('OpenAI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
