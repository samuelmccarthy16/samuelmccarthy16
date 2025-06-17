import "reflect-metadata";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { createConnection } from "typeorm";
import menuRoutes from "./routes/menuRoutes";
import orderRoutes from "./routes/orderRoutes";
import userRoutes from "./routes/userRoutes";
import apiDocsRouter from './routes/apidoc';
import {createAdminIfNotExists} from "./controllers/AdminController";
import { openApiValidator } from "./middlewares";
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
//app.use(openApiValidator);
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
//app.options('*', cors());

createConnection({
  type: "sqlite",
  database: "bar.db",
  entities: [__dirname + "/entities/*.{js,ts}"],
  synchronize: true,
}).then(() => {
  console.log("Database connected");

  void createAdminIfNotExists();

  // connecting routes
  app.use("/api/menu", menuRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/user", userRoutes);
  app.use('/api-docs', apiDocsRouter);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(error => console.log(error));
