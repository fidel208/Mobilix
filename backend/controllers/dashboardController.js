import prisma from "../lib/prisma.js";

// GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    // Total counts
    const [servicesCount, routesCount, ticketsCount, communityCount] =
      await Promise.all([
        prisma.service.count(),
        prisma.route.count(),
        prisma.ticket.count(),
        prisma.communityMember.count(),
      ]);

    // All tickets for revenue calculations
    const allTickets = await prisma.ticket.findMany({
      select: {
        amount: true,
        createdAt: true,
      },
    });

    // Today's sales
    const todaySales = allTickets
      .filter((t) => new Date(t.createdAt) >= today)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Month's sales
    const monthSales = allTickets
      .filter((t) => new Date(t.createdAt) >= firstDayOfMonth)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Yearly sales grouped by month (Jan-Dec)
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlySalesMap = {};
    monthNames.forEach((m) => (monthlySalesMap[m] = 0));

    allTickets
      .filter((t) => new Date(t.createdAt) >= firstDayOfYear)
      .forEach((t) => {
        const m = monthNames[new Date(t.createdAt).getMonth()];
        monthlySalesMap[m] = (monthlySalesMap[m] || 0) + (t.amount || 0);
      });

    const yearlyData = monthNames.map((month) => ({
      month,
      amount: monthlySalesMap[month],
    }));

    return res.status(200).json({
      status: "success",
      stats: {
        todaySales,
        monthSales,
        servicesCount,
        routesCount,
        ticketsCount,
        communityCount,
        yearlyData,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to fetch dashboard stats." });
  }
};
