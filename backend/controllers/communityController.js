import prisma from "../lib/prisma.js";

// GET /api/community
export const getCommunityMembers = async (req, res) => {
  try {
    const members = await prisma.communityMember.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ status: "success", members });
  } catch (error) {
    console.error("Get community members error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to fetch community members." });
  }
};

// POST /api/community
export const createCommunityMember = async (req, res) => {
  try {
    const { email, status } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email address is required.",
      });
    }

    const existing = await prisma.communityMember.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "This email is already part of the community.",
      });
    }

    const member = await prisma.communityMember.create({
      data: {
        email: email.trim().toLowerCase(),
        status: status || "subscribed",
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Member added to community successfully!",
      member,
    });
  } catch (error) {
    console.error("Create community member error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to add community member." });
  }
};

// DELETE /api/community/:id
export const deleteCommunityMember = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.communityMember.delete({ where: { id } });
    return res
      .status(200)
      .json({ status: "success", message: "Member removed from community." });
  } catch (error) {
    console.error("Delete community member error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to remove member." });
  }
};
