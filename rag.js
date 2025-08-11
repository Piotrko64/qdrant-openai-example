require("dotenv").config();
const readline = require("readline");
const { QdrantClient } = require("@qdrant/js-client-rest");
const { OpenAI } = require("openai");
const { COLLENTION_NAME } = require("./config");

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_KEY,
});
async function getRelevantContext(question) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const results = await qdrant.search(COLLENTION_NAME, {
    vector: embedding.data[0].embedding,
    limit: 3,
  });

  return results.map((hit) => hit.payload.text).join("\n---\n");
}

async function askWithContext(question) {
  const context = await getRelevantContext(question);

  const messages = [
    {
      role: "system",
      content:
        "Jesteś pomocnym asystentem. Odpowiadasz tylko na podstawie dostarczonego kontekstu.",
    },
    {
      role: "user",
      content: `Oto kontekst:\n${context}\n\nPytanie: ${question}`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.2,
  });

  console.log(
    "\n💡 Odpowiedź GPT:\n",
    response.choices[0].message.content.trim()
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("❓ Zadaj pytanie na podstawie dokumentów: ", async (question) => {
  await askWithContext(question);
  rl.close();
});
