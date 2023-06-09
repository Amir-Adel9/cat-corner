import type { User } from '@clerk/nextjs/dist/api';
import { clerkClient } from '@clerk/nextjs/server';

import { TRPCError } from '@trpc/server';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { z } from 'zod';

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { filterUserForClient } from '~/server/helpers/filterUserForClient';
import { uploadImage } from '~/utils/cloudinary';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(4, '1 m'),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      select: {
        id: true,
        authorId: true,
        content: true,
        imageUrl: true,
        imageWidth: true,
        imageHeight: true,
        likes: true,
        comments: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      if (!author || !author.username)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Author for post not found',
        });
      {
        return {
          post,
          author: {
            ...author,
            firstName: author.firstName,
            lastName: author.lastName,
            username: author.username,
          },
        };
      }
    });
  }),

  getPostsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userPosts = await ctx.prisma.post.findMany({
        take: 100,
        select: {
          id: true,
          authorId: true,
          content: true,
          imageUrl: true,
          imageWidth: true,
          imageHeight: true,
          likes: true,
          comments: true,
          createdAt: true,
        },
        where: { authorId: input.userId },
        orderBy: { createdAt: 'desc' },
      });
      return userPosts;
    }),
  createPost: privateProcedure
    .input(
      z.object({ content: z.string().optional(), imageUrl: z.string().url() })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUserId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

      const imageData = await uploadImage(input.imageUrl);

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content ? input.content : '',
          imageUrl: imageData.secureUrl,
          imageWidth: imageData.width,
          imageHeight: imageData.height,
        },
      });

      return post;
    }),

  likePost: privateProcedure
    .input(
      z.object({ postId: z.string(), userId: z.string(), isLiked: z.boolean() })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.isLiked) {
        await ctx.prisma.post.update({
          where: {
            id: input.postId,
          },
          data: {
            likes: {
              increment: 1,
            },
          },
        });
      } else {
        await ctx.prisma.post.update({
          where: {
            id: input.postId,
          },
          data: {
            likes: {
              decrement: 1,
            },
          },
        });
      }
    }),

  addComment: privateProcedure
    .input(
      z.object({
        content: z.string(),
        imageUrl: z.string().optional(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUserId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
      let imageData;
      if (input.imageUrl) {
        imageData = await uploadImage(input.imageUrl);
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          authorId,
          content: input.content ? input.content : '',
          imageUrl: imageData?.secureUrl,
          imageWidth: imageData?.width,
          postId: input.postId,
          imageHeight: imageData?.height,
        },
      });

      return comment;
    }),
});
