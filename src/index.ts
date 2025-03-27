import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import sequelize from "./config/db";
import { exec } from "child_process";
import { upload } from "./utils/storage";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(upload.single("file"));
app.use(express.json());

app.use("/api", routes);

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");

    exec("yarn db:migrate", (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.warn(`Migration warning: ${stderr}`);
      }
      console.log(`Migration output: ${stdout}`);
      console.log("✅ Setup complete. Server is ready!");
    });
  })
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
