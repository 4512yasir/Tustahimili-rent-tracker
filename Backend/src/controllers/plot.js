const prisma = require("@prisma/client").PrismaClient;
const prismaClient = new prisma();

const createPlot = async (req, res) => {
  try {
    const { name, location, units, description, rentAmount, status, ownerId } = req.body;
    const plot = await prismaClient.plot.create({
      data: { name, location, units, description, rentAmount, status, ownerId },
    });
    res.status(201).json(plot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPlots = async (req, res) => {
  try {
    const plots = await prismaClient.plot.findMany({ include: { owner: true } });
    res.json(plots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePlot = async (req, res) => {
  try {
    const { id } = req.params;
    const plot = await prismaClient.plot.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(plot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePlot = async (req, res) => {
  try {
    const { id } = req.params;
    await prismaClient.plot.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Plot deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPlot, getAllPlots, updatePlot, deletePlot };
