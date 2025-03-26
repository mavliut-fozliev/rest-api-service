import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
