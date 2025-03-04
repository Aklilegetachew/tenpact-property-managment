import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoutes";
import salesRouter from "./routes/salesRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Admin Routes
app.use("/admin", adminRouter);

// Sales Routes
app.use("/sales", salesRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
