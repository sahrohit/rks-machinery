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

export const productRouter = createTRPCRouter({
  getProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      include: {
        images: true,
        category: true,
        features: true,
      },
    });
    return products;
  }),

  getProductBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          images: true,
          category: true,
          features: true,
        },
      });
    }),

  setPublished: protectedProcedure
    .input(z.object({ id: z.string(), isPublished: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          isPublished: input.isPublished,
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          type: "PRODUCT_PUBLISH_SET",
          desc: `Product ${res.name} published status set to ${input.isPublished}`,
          userId: ctx.session?.user?.id,
        },
      });

      return res;
    }),

  addProduct: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        slug: z.string().min(3, "Slug must be at least 3 characters long"),
        desc: z
          .string()
          .min(3, "Description must be at least 3 characters long"),
        price: z.string(),
        categoryId: z.string(),
        features: z.array(
          z.object({
            title: z
              .string()
              .min(3, "Title must be at least 3 characters long"),
            description: z
              .string()
              .min(3, "Description must be at least 3 characters long"),
          })
        ),
        images: z.array(
          z.object({
            url: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.product.create({
        data: {
          name: input.name,
          slug: input.slug,
          desc: input.desc,
          price: parseFloat(input.price),
          categoryId: input.categoryId,
          features: {
            create: input.features,
          },
          images: {
            create: input.images.map((image) => ({
              url: image.url,
            })),
          },
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          type: "PRODUCT_ADDED",
          desc: `Product ${input.name} added`,
          userId: ctx.session?.user?.id,
        },
      });

      return res;
    }),

  updateProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3, "Name must be at least 3 characters long"),
        slug: z.string().min(3, "Slug must be at least 3 characters long"),
        desc: z
          .string()
          .min(3, "Description must be at least 3 characters long"),
        price: z.string(),
        categoryId: z.string(),
        features: z.array(
          z.object({
            title: z
              .string()
              .min(3, "Title must be at least 3 characters long"),
            description: z
              .string()
              .min(3, "Description must be at least 3 characters long"),
          })
        ),
        images: z.array(
          z.object({
            url: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          slug: input.slug,
          desc: input.desc,
          price: parseFloat(input.price),
          categoryId: input.categoryId,
          features: {
            upsert: input.features.map((feature) => ({
              where: {
                title_productId: {
                  title: feature.title,
                  productId: input.id,
                },
              },
              create: {
                title: feature.title,
                description: feature.description,
              },
              update: {
                title: feature.title,
                description: feature.description,
              },
            })),
          },
          images: {
            upsert: input.images.map((image) => ({
              where: {
                url: image.url,
              },
              create: {
                url: image.url,
              },
              update: {
                url: image.url,
              },
            })),
          },
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          type: "PRODUCT_UPDATED",
          desc: `Product ${res.name} added`,
          userId: ctx.session?.user?.id,
        },
      });

      return res;
    }),

  deleteProduct: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.activityLog.create({
        data: {
          type: "PRODUCT_DELETED",
          desc: `Product ${res.name} deleted`,
          userId: ctx.session?.user?.id,
        },
      });

      return res;
    }),
});
