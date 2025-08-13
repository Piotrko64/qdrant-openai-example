import "dotenv/config";
import readline from "readline";
import { COLLENTION_NAME } from "./config.js";
import { openai } from "./helpers/openai-init.js";
import { qdrant } from "./helpers/qdrant-init.js";

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
