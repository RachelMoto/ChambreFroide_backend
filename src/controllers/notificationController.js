import prisma from "../config/prisma.js";

/* GET NOTIFICATIONS */
export const getNotifications = async (req, res) => {
  try {

    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* CREATE NOTIFICATION */
export const createNotification = async (data) => {
  return await prisma.notification.create({
    data
  });
};

/* MARK AS READ */
export const markAsRead = async (req, res) => {
  try {

    const { id } = req.params;

    const notif = await prisma.notification.update({
      where: { id: Number(id) },
      data: { lu: true }
    });

    res.json(notif);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};