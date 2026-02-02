require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();

// ✅ CORS (ESTO ES CLAVE)
app.use(cors({
  origin: "http://localhost:5173", // frontend (Vite)
  credentials: true
}));

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

// Test
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
