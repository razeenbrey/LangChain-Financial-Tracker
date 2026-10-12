# LangChain-Financial-Tracker

A personal financial assistant that turns your uploaded financial documents into a queryable knowledge base. Documents are embedded and stored in a `ChromaDB` vector database, then retrieved and reasoned over by a `LangChain` RAG pipeline backed by Google Gemini - so you can ask natural-language questions like *"What's my current utility bill?"* and get answers grounded in your own statements, not hallucinations.

> **Note:** Some sample training data is provided in `backend/src/data` these were extracted from the Kaggle Dataset <a href="https://www.kaggle.com/datasets/miadul/multi-document-dataset-for-ocr-document-ai-and-llm">Multi-Document Dataset for OCR, Document AI & LLM</a>.

## Getting Started
Navigate to the project root `LangChain-Financial-Tracker` and run the following:
```bash
npm install
```

Next, move into the `backend` directory and run it again:
```bash
npm install
```

In a serparate terminal instance setup your `ChromaDB` instance using `Docker` or the following (`Python`):

    Setup a virtual environment (`.venv`) and activate it:
    ```bash
    python -m venv .venv
    source .venv/Scripts/activate      # MINGW64 / Git Bash
    # or: .venv\Scripts\activate       # cmd / PowerShell
    ```

    Next, install `ChromaDB` via `pip`:
    ```bash
    pip install chromadb
    ```

    Now run `chromadb` (It'll bind to http://localhost:8000 by default.)
    ```bash
    chroma run --path ./getting-started
    ```
    *Use `cntrl` + `c` to exit.*

Finally, run the following in the backend folder:
```bash
    npm run dev
```
The server will start up. A quick health check for confirmation:
```bash
$ curl http://localhost:3000/health
OK
```

## Usage

### Uploading a doc
```bash
$ curl -X POST http://localhost:3000/upload \-H "Content-Type: application/json" \-d '{"path": "C:/Users/razee/OneDrive/Code/Repos/LangChain-Financial-Tracker/backend/src/data/receipt_0001.pdf"}'


{"ok":true,"message":"File uploaded and embedded successfully","chunks":1}
```

Note: Use forward slashes `/` for file paths.

### Asking a question
```bash
$ curl -X POST http://localhost:3000/query \-H "Content-Type: application/json" \-d '{"query": "How many notebooks did i buy from Rodriguez?"}'

{"results":"Based on the receipt from Rodriguez, Figueroa and Sanchez, you bought a total of **3** notebooks (1 notebook at $18.27 and 2 notebooks at $57.57 each)."}
```

Should the answer not lie within the documents in the vector store the AI will say it does not know.