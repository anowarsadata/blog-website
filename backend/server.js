import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/admin.js";
import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

//app.use(cors());
// ✅ Enable CORS
app.use(cors({
  origin: "*", // Allow all origins — you can restrict it later if needed
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "blog-secret-key",
  resave: false,
  saveUninitialized: false
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => res.redirect("/admin/login"));

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
