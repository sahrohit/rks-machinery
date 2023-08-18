/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getAdmins: protectedProcedure.query(async ({ ctx }) => {
    const admins = await ctx.prisma.admin.findMany();
    return admins;
  }),

  addAdmin: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.admin.findFirst({
        where: {
          email: input.email,
        },
      });

      if (existing?.email) {
        return true;
      }

      await ctx.prisma.admin.create({
        data: {
          email: input.email,
          access: true,
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          type: "ADMIN_ADDED",
          desc: `Admin ${input.email} was added`,
          userId: ctx.session?.user?.id,
        },
      });

      return true;
    }),

  updateAccessById: protectedProcedure
    .input(z.object({ id: z.string(), access: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.admin.update({
        where: {
          id: input.id,
        },
        data: {
          access: input.access,
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          type: "ACCESS_UPDATED",
          desc: `Admin access enabled for ${res.email} set to ${input.access}`,
          userId: ctx.session?.user?.id,
        },
      });

      return true;
    }),

  deleteAdminById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.admin.delete({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          type: "ADMIN_DELETED",
          desc: `Admin ${res.email} deleted.`,
          userId: ctx.session?.user?.id,
        },
      });

      return true;
    }),

  deleteAdminByEmail: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.admin.delete({
        where: {
          email: input.email,
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          type: "ADMIN_DELETED",
          desc: `Admin ${res.email} deleted.`,
          userId: ctx.session?.user?.id,
        },
      });

      return true;
    }),
});
