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
import { uploadImage } from '~/utils/cloudinary';

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(4, '1 m'),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
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

      if (!author)
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

  createPost: privateProcedure
    .input(
      z.object({ content: z.string().optional(), imageURL: z.string().url() })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUserId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content ? input.content : '',
          catImageURL: input.imageURL,
        },
      });

      return post;
    }),

  invalidatePosts: publicProcedure.mutation(() => {
    console.log('posts invalidated');
  }),
});
