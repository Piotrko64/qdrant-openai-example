import "dotenv/config";
import fs from "fs";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { COLLENTION_NAME, TEXT_TO_EMBEDDING } from "./config.js";
import { openai } from "./helpers/openai-init.js";
import { qdrant } from "./helpers/qdrant-init.js";

function chunkTextWithOverlap(text, chunkSize = 600, overlap = 100) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  let allChunks = [];
  let currentText = paragraphs.join("\n");

  let startIndex = 0;
  while (startIndex < currentText.length) {
    let endIndex = startIndex + chunkSize;

    if (endIndex > currentText.length) {
      endIndex = currentText.length;
    }

    let chunk = currentText.substring(startIndex, endIndex);
    allChunks.push(chunk);

    if (endIndex === currentText.length) {
      break;
    }
    startIndex += chunkSize - overlap;

    if (startIndex < 0) {
      startIndex = 0;
    }
  }

  return allChunks;
}

async function run() {
  const text = fs.readFileSync(TEXT_TO_EMBEDDING, "utf8");
  const chunks = chunkTextWithOverlap(text, 800, 120);

  const collections = await qdrant.getCollections();
  const exists = collections.collections?.some(
    (c) => c.name === COLLENTION_NAME
  );

  if (!exists) {
    await qdrant.createCollection(COLLENTION_NAME, {
      vectors: { size: 1536, distance: "Cosine" },
    });
  }

  for (const chunk of chunks) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
    });

    const embedding = embeddingResponse.data[0].embedding;

    await qdrant.upsert(COLLENTION_NAME, {
      points: [
        {
          id: uuidv4(),
          vector: embedding,
          payload: {
            text: chunk,
            source: TEXT_TO_EMBEDDING,
          },
        },
      ],
    });

    console.log("✅ Zapisano fragment.");
  }
}

run().catch((err) => {
  console.error("❌ Błąd:", err);
});
