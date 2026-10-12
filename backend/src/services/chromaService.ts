import {ChromaClient, Collection, QueryResult} from "chromadb";
import { SentenceTransformersEmbeddingFunction } from '@chroma-core/sentence-transformer';
import { Document } from "@langchain/core/documents";

class chromaService{

    private readonly collection: Collection;

    private constructor(collection: Collection){
        this.collection = collection;
    }

    // returns a default embedder with cosine similarity enabled
    static getEmbedder():SentenceTransformersEmbeddingFunction{
        const embedder = new SentenceTransformersEmbeddingFunction({
            modelName: 'all-MiniLM-L6-v2',
            normalizeEmbeddings: true,  // for consine similarity
            device: 'cpu', // change to gpu if you have
        });
        return embedder;
    }

    // create chromaDB instance
    static async create(url = "http://localhost:8000"):Promise<chromaService>{
        const client = new ChromaClient({path:url});
        const collection = await client.getOrCreateCollection({
            name:"invoicesDB",
            embeddingFunction: this.getEmbedder(),
        });
        return new chromaService(collection);
    }

    // add docs to chromaDB - embedding automatic
    async addDocuments(documents: Document[]) {
        await this.collection.add({
            ids: documents.map(() => crypto.randomUUID()),
            documents: documents.map((doc) => doc.pageContent),
            metadatas: documents.map((doc) => ({
                source: doc.metadata?.source ?? null,
                pageNumber: doc.metadata?.loc?.pageNumber ?? null,
            })),
        });
    }

    // search chromaDB
    async searchChroma(query: string, k = 5): Promise<QueryResult> {
        return this.collection.query({ queryTexts: [query], nResults: k });
    }

};
 export default chromaService;