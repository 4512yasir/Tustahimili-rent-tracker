const prisma = require("@prisma/client").PrismaClient;
const prismaClient = new prisma();

const createRepair = async (req, res) => {
  try {
    const { description, cost, plotId } = req.body;
    const repair = await prismaClient.repair.create({
      data: {
        description,
        cost,
        plotId,
        userId: req.user.id,
      },
    });
    res.status(201).json(repair);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllRepairs = async (req, res) => {
  try {
    const repairs = await prismaClient.repair.findMany({ include: { plot: true, user: true } });
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRepair = async (req, res) => {
  try {
    const { id } = req.params;
    const repair = await prismaClient.repair.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(repair);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRepair = async (req, res) => {
  try {
    const { id } = req.params;
    await prismaClient.repair.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Repair deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRepair, getAllRepairs, updateRepair, deleteRepair };
