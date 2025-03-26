import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import sequelize from "./config/db";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

sequelize
  .sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
