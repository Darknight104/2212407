import express from "express";
import dotenv from "dotenv";
import { buildRoutes } from "./routes/routes.js";
dotenv.config();
const port = process.env.PORT || 3000;
const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;
const app = express();
app.use(express.json());
app.use(buildRoutes(baseUrl));
app.get("/", (req, res) => {
  res.type("text/plain").send("POST /shorturls with { url, validity?, shortcode? }");
});
app.listen(port, () => {
  console.log(`Running at ${baseUrl}`);
});
