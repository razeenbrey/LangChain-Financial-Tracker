import { extractDoc } from "./dockLoader.js";
import chromaService from "./chromaService.js";
import { QueryResult } from "chromadb";

export const store = await chromaService.create();

// upload a doc to chromaDB and embed
export async function uploadDoc(path: string){
    const contents = await extractDoc(path);
    await store.addDocuments(contents);
    console.log("File embed and upload successfull!");
    return { chunks: contents.length };
};

// pass a string query to chromaDB - returns of type QueryResult - unused
export async function queryChroma(query: string): Promise<QueryResult>{
    const results = await store.searchChroma(query, 3);
    console.log(`[queryChroma result]: ${results.documents}`);
    return results;
};
