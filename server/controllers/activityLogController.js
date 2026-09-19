const { getActivityLogs } = require("../services/activityLogService");

const getLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.user;
    const page = req.query.page !== undefined ? Number(req.query.page) : 1;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 5;
    const sortBy = req.query.sortBy || "created_at";
    const order = req.query.order || "desc";
    const allowedSortFields = [
      "id",
      "created_at",
      "action",
      "entity_type",
      "entity_id",
    ];
    const allowedOrder = ["asc", "desc"];
    const sortOrder = order.toLowerCase();

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      return res
        .status(400)
        .json({ message: "Page and limit must be positive integers" });
    }

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sortBy field" });
    }

    if (!allowedOrder.includes(sortOrder)) {
      return res.status(400).json({ message: "Invalid sort order" });
    }

    const { logs, totalLogs } = await getActivityLogs(
      userId,
      role,
      page,
      limit,
      sortBy,
      sortOrder
    );

    const totalPages = Math.ceil(totalLogs / limit);

    res.status(200).json({
      logs,
      pagination: { page, limit, totalLogs, totalPages },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch activity logs" });
  }
};

module.exports = {
  getLogs,
};
