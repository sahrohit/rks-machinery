/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  getCategory: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),

  getCategoryWithProduct: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      include: {
        products: true,
        _count: true,
      },
    });
  }),

  getCategoryById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  addCategory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        desc: z.string().nullable(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.activityLog.create({
        data: {
          type: "CATEGORY_ADDED",
          desc: `Category ${input.name} added`,
          userId: ctx.session?.user?.id,
        },
      });
      return ctx.prisma.category.create({
        data: {
          name: input.name,
          slug: input.name.toLowerCase().replaceAll(" ", "-"),
          desc: input.desc,
          image: input.image,
        },
      });
    }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        desc: z.string().nullable(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.activityLog.create({
        data: {
          type: "CATEGORY_UPDATED",
          desc: `Category ${input.name} updated`,
          userId: ctx.session?.user?.id,
        },
      });
      return ctx.prisma.category.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          desc: input.desc,
          image: input.image,
        },
      });
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.category.delete({
        where: {
          id: input.id,
        },
      });
      await ctx.prisma.activityLog.create({
        data: {
          type: "CATEGORY_DELETED",
          desc: `Category ${res.name} deleted`,
          userId: ctx.session?.user?.id,
        },
      });
      return res;
    }),
});
