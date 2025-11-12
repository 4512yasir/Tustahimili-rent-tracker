const prisma = require("@prisma/client").PrismaClient;
const prismaClient = new prisma();

const createExpense = async (req, res) => {
  try {
    const { amount, date, plotId } = req.body;
    const expense = await prismaClient.expense.create({
      data: {
        amount,
        date: new Date(date),
        plotId,
        userId: req.user.id,
      },
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await prismaClient.expense.findMany({ include: { plot: true, user: true } });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await prismaClient.expense.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await prismaClient.expense.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createExpense, getAllExpenses, updateExpense, deleteExpense };
