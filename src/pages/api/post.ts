import { uploadImage } from '~/utils/cloudinary';

import { getPostData } from '~/utils/formidable';

import { type NextApiRequest, type NextApiResponse } from 'next/types';

import { postsRouter } from '~/server/api/routers/posts';

import { prisma } from '~/server/db';

import { getAuth } from '@clerk/nextjs/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getAuth(req);
  const currentUserId = session.userId;
  const ctx = { currentUserId: currentUserId, prisma: prisma };
  const createPostCaller = postsRouter.createCaller(ctx);

  const { postContent, imageUrl } = await getPostData(req);

  const catImageUrl = await uploadImage(imageUrl);

  const response = await createPostCaller.createPost({
    content: postContent,
    imageURL: catImageUrl,
  });

  res.status(200).json(response);
}
