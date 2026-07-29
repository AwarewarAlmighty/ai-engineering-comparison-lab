import mongoose from "mongoose";
import { app } from "./app.js";

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-engineering-lab";

await mongoose.connect(mongoUri);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
