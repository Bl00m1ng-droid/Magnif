const prisma = require('../prismaClient');

async function getAllUsers(req, res) {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
}

async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  const targetId = parseInt(id);

  if (!['registered', 'admin'].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Safeguard 1: prevent self-demotion
  if (targetId === req.user.id && role !== 'admin') {
    return res.status(400).json({ message: "You cannot remove your own admin access" });
  }

  // Safeguard 2: prevent demoting the last remaining admin
  if (role !== 'admin') {
    const targetUser = await prisma.user.findUnique({ where: { id: targetId } });
    if (targetUser.role === 'admin') {
      const adminCount = await prisma.user.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot remove the last remaining admin" });
      }
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  res.json(updatedUser);
}

module.exports = { getAllUsers, updateUserRole };