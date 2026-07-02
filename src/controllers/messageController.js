import prisma from "../config/prisma.js";

/* ENVOYER MESSAGE */
export const sendMessage = async (req, res) => {
  try {

    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    const message = await prisma.message.create({
  data: {
    senderId: req.user.id,
    receiverId,
    content,
    lu: false,
  }
});

    res.json(message);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* CONVERSATION */
export const getConversation = async (req, res) => {
  try {

    const userId = req.user.id;
    const { otherUserId } = req.params;

    await prisma.message.updateMany({
    where: {
        senderId: Number(otherUserId),
        receiverId: userId,
        lu: false,
    },
    data: {
        lu: true,
    },
});

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: Number(otherUserId) },
          { senderId: Number(otherUserId), receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {

    const userId = req.user.id;

    const count = await prisma.message.count({
      where: {
        receiverId: userId,
        lu: false,
      },
    });

    res.json({
      count,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const getUsersForMessaging = async (req, res) => {
  try {

    const currentUserId = req.user.id;

  const users = await prisma.user.findMany({
    where: {
      actif: true,
      NOT: {
        id: currentUserId
      }
    }
  });

  const usersWithUnread = await Promise.all(
    users.map(async (user) => {

      const unread = await prisma.message.count({
        where: {
          senderId: user.id,
          receiverId: currentUserId,
          lu: false
        }
      });

      return {
        ...user,
        unread
      };
    })
  );

  res.json(usersWithUnread);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};