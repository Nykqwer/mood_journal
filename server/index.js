import express from "express";
import cors from "cors";
import noteRoutes from "./Routes/note.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // 🔑 REQUIRED

// mount routes
app.use("/", noteRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
