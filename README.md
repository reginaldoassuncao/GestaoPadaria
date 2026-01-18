# PanificAI - Gestão Inteligente de Padaria

Este é um sistema de gestão para padarias que utiliza Inteligência Artificial para otimizar a produção e reduzir o desperdício.

## Tecnologias Utilizadas

- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **Firebase** (Firestore & Auth)
- **OpenAI API** (GPT-4o-mini)
- **Lucide React** (Ícones)
- **Recharts** (Gráficos)

## Funcionalidades

1. **Dashboard (Visão Geral):** Monitoramento de itens em estoque, valor total e insights gerados por IA para a produção do dia.
2. **Controle de Estoque:** Gestão completa de ingredientes com busca, controle de quantidade e alertas de estoque baixo.
3. **Assistente Criativo (Chef IA):** Geração de receitas inteligentes baseadas em ingredientes em excesso ou próximos da validade para maximizar lucro.

## Como Iniciar

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env.local` com suas credenciais:
   - `OPENAI_API_KEY` (Sua chave da OpenAI)
   - `NEXT_PUBLIC_FIREBASE_*` (Suas credenciais do projeto Firebase)

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

- `src/app`: Páginas e rotas da API.
- `src/components`: Componentes Reativos da interface.
- `src/lib`: Configurações de bibliotecas (Firebase, OpenAI, Utils).
- `src/app/globals.css`: Tema personalizado inspirado em panificação.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
