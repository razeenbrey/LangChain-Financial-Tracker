import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

export async function extractDoc(filePath: string): Promise<Document[]> {
  const loader = new PDFLoader(filePath);
  return await loader.load();
}

