import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const newsLetterRouter = createTRPCRouter({
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
});
