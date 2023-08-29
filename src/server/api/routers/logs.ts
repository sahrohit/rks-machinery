import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const logsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.activityLog.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
