import express from 'express';
import cors from 'cors';
import { uploadDoc } from './src/services/appService.js';
import { queryChromaWithGemini } from './src/services/langChainService.js';
// import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
// enable CORS for Vite frontend and localhost ports
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL,
    process.env.NODE_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
        ) {
            return callback(null, true);
        }
        return callback(new Error(`Blocked by CORS policy for origin: ${origin}`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// JSON middleware
app.use(express.json());

// health check
app.get('/health', (req, res) => {
    res.sendStatus(200);
});

// upload doc
app.post('/upload', async (req, res) => {
    const { path } = req.body;
    if (!path) return res.status(400).json({ error: "No filepath provided." });

    try {
        const { chunks } = await uploadDoc(String(path));
        return res.json({
            ok: true,
            message: "File uploaded and embedded successfully",
            chunks,
        });
    } catch (error) {
        console.error('[File Upload Error]', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return res.status(500).json({ error: message });
    }
});

// query
app.post('/query', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "No query provided." });

    try {
        const results = await queryChromaWithGemini(String(query));
        return res.json({ results });
    } catch (error) {
        console.error('[Query Error]', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return res.status(500).json({ error: message });
    }
});

// serve
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`)
});