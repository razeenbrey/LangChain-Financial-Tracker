import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { QueryResult } from "chromadb";
import { store } from "./appService.js";

// gemni init
const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.8-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
});

// prompt template
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful bookeeping personal assistant. Answer the user's question based ONLY on the following context. If you don't know the answer, say you don't know.\n\nContext:\n{context}",
  ],
    ["human", "{question}"],
]);

// helper to convert QueryResult to string
function formatDocuments(queryResult: QueryResult): string{
  // into single string
  const docs = queryResult.documents?.[0] || [];
  return docs.join("\n\n---\n\n");
};

// rag chain
const ragChain = RunnableSequence.from([
  // get user query, get docs, format prompt
  async (input: {question: string}) => {
    const results = await store.searchChroma(input.question, 3);
    const formattedContext = formatDocuments(results);

    return prompt.formatMessages({
      context: formattedContext,
      question: input.question,
    });
  },
  // pass formatted messages to llm
  model,
  // parse output into clean string
  new StringOutputParser(),
]);

// the query/prompt function
export async function queryChromaWithGemini(query: string): Promise<string> {
  try {
    const answer = await ragChain.invoke({ question: query });
    console.log(answer);
    return answer;
  } catch (error) {
    console.error(`[queryChromaWithGemini failed]: ${error}`);
    throw error;
  }
}