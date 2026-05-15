import express, { Express } from 'express';
import cors from 'cors';
import groupRoutes from './routes/groupRoutes';

/**
 * Initialize Express Application
 * 
 * Sets up middleware and routes for the Study Groups API
 */

const app: Express = express();
const PORT = process.env.PORT || 5000;

/* ========== Middleware Setup ========== */

/**
 * CORS Middleware
 * Enables cross-origin requests from the React frontend
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

/**
 * JSON Parser Middleware
 * Parses incoming request bodies with JSON payloads
 */
app.use(express.json());

/**
 * URL Encoded Parser Middleware
 * Parses incoming request bodies with URL-encoded payloads
 */
app.use(express.urlencoded({ extended: true }));

/* ========== Routes Setup ========== */

/**
 * Health Check Endpoint
 * Used to verify the server is running
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date() });
});

/**
 * Groups API Routes
 * All routes prefixed with /api/groups
 * - GET /api/groups - Get all groups
 * - GET /api/groups/subjects - Get unique subjects
 * - POST /api/groups/search - Search and filter groups
 * - POST /api/groups/create - Create a new group
 * - GET /api/groups/:id - Get specific group
 */
app.use('/api/groups', groupRoutes);

/* ========== Error Handling ========== */

/**
 * 404 Not Found Handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

/**
 * Global Error Handler
 */
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/* ========== Server Start ========== */

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;