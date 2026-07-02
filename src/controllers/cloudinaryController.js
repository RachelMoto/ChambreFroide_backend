export const testCloudinary = async (req, res) => {
  try {
    res.json({ message: "Cloudinary OK" });
  } catch (error) {
    res.status(500).json(error);
  }
};