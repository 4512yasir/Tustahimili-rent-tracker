const prisma = require("@prisma/client").PrismaClient;
const prismaClient = new prisma();

const createRent = async (req, res) => {
  try {
    const { amount, dueDate, plotId } = req.body;
    const rent = await prismaClient.rent.create({
      data: {
        amount,
        dueDate: new Date(dueDate),
        plotId,
        userId: req.user.id,
      },
    });
    res.status(201).json(rent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllRents = async (req, res) => {
  try {
    const rents = await prismaClient.rent.findMany({ include: { plot: true, user: true } });
    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRent = async (req, res) => {
  try {
    const { id } = req.params;
    const rent = await prismaClient.rent.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(rent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRent = async (req, res) => {
  try {
    const { id } = req.params;
    await prismaClient.rent.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Rent deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRent, getAllRents, updateRent, deleteRent };
