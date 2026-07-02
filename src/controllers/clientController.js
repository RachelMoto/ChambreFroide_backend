import prisma from "../config/prisma.js";

// 🔥 GET ALL CLIENTS
export const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        dettes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(clients);

    return res.json(clients);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};