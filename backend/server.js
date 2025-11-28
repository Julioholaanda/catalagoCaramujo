import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// Rota para listar produtos
app.get("/produtos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Rota para adicionar produto
app.post("/produtos", async (req, res) => {
  const { nome, preco, categoria, imagem, descricao } = req.body;

  if (!nome || !preco || !categoria || !imagem) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    await pool.query(
      "INSERT INTO produtos (nome, preco, categoria, imagem, descricao) VALUES ($1, $2, $3, $4, $5)",
      [nome, preco, categoria, imagem, descricao || ""]
    );
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar produto" });
  }
});

// Servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
