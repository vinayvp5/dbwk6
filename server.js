console.log("🚀 Starting server...");

const logger = require('./src/config/logger');
logger.info("Pino is working!");

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();
const PORT = 3000;

// ================================================
// MIDDLEWARE
// ================================================

// Parse JSON
app.use(express.json());

// ✅ CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Serve static files from public folder (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ================================================
// DATABASE CONNECTION
// ================================================
connectDB();

// ================================================
// API ROUTES
// ================================================
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// ================================================
// SWAGGER DOCUMENTATION
// ================================================
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task API with Auth",
      version: "1.0.0"
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: [path.join(__dirname, "src/routes/*.js")]
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================================================
// HOME ROUTE - Serve login page
// ================================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ================================================
// SERVE HTML FILES
// ================================================
// Routes for specific HTML pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ================================================
// CATCH-ALL ROUTE - If page not found, serve login
// ================================================
app.get('*', (req, res, next) => {
  // Check if it's an API route or special route
  if (req.path.startsWith('/auth') || 
      req.path.startsWith('/tasks') || 
      req.path.startsWith('/api-docs') ||
      req.path.includes('.css') ||
      req.path.includes('.js') ||
      req.path.includes('.png') ||
      req.path.includes('.jpg') ||
      req.path.includes('.gif') ||
      req.path.includes('.svg')) {
    return next();
  }
  
  // Otherwise serve login page for all HTML requests
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ================================================
// ERROR HANDLING MIDDLEWARE
// ================================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  logger.error(err);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ================================================
// START SERVER
// ================================================
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`✅ Routes:`);
  console.log(`   - GET  / or /login → Login page`);
  console.log(`   - GET  /signup → Signup page`);
  console.log(`   - GET  /dashboard → Dashboard page`);
  console.log(`   - POST /auth/register → Register user`);
  console.log(`   - POST /auth/login → Login user`);
  console.log(`   - GET  /tasks → Get all tasks (protected)`);
});
