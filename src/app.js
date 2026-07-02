import express from "express";
import cors from "cors";
import cloudinaryRoutes from "./routes/cloudinaryRoutes.js";

//import produitRoutes from "./routes/produitRoutes.js";
import produitRoutes from "./routes/produitRoutes.js";
import venteRoutes from "./routes/venteRoutes.js";
import detteRoutes from "./routes/detteRoutes.js";
import commandeRoutes from "./routes/commandeRoutes.js";
import approvisionnementRoutes from "./routes/approvisionnementRoutes.js";
import depenseRoutes from "./routes/depenseRoutes.js";
import paiementRoutes from "./routes/paiementRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import rapportRoutes from "./routes/rapportRoutes.js";
import caisseRoutes from "./routes/caisseRoutes.js";


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

app.use("/api/produits", produitRoutes);
app.use("/api/ventes", venteRoutes);
app.use("/api/dettes", detteRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/approvisionnements",approvisionnementRoutes);
app.use("/api/depenses", depenseRoutes);
app.use("/api/paiements", paiementRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", cloudinaryRoutes);
app.use("/api/rapports", rapportRoutes);
app.use("/api/caisse", caisseRoutes);

app.get("/", (req, res) => {
  res.send("API Chambre Froide OK");
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});