import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const newsLetterRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.newsletter.findMany();
  }),

  signUp: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.newsletter.findFirst({
        where: {
          email: input.email,
        },
      });

      if (existing?.email) {
        return true;
      }

      await ctx.prisma.newsletter.create({
        data: {
          email: input.email,
        },
      });

      return true;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.newsletter.delete({
        where: {
          email: input.email,
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          type: "CATEGORY_ADDED",
          desc: `Category ${res.email} added`,
          userId: ctx.session?.user?.id,
        },
      });

      return true;
    }),
});
