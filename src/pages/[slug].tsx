import { useUser } from '@clerk/nextjs';
import dayjs from 'dayjs';
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CommentInterface from '~/components/comment';
import LikeInterface from '~/components/like';
import { BottomNavBar, SideNavBar } from '~/components/navbar';
import ImageIcon from '~/components/svgs/image';
import { themes } from '~/constants/themes';
import { api } from '~/utils/api';

const Profile: NextPage = () => {
  const router = useRouter();

  const username = router.query.slug as string;

  const [selectedTheme, setSelectedTheme] = useState(themes[0] as string);

  api.posts.getAll.useQuery();

  useEffect(() => {
    const storedTheme = localStorage.getItem('selectedTheme') as string;

    if (!storedTheme) {
      setSelectedTheme(themes[0] as string);
    } else {
      setSelectedTheme(storedTheme);
    }
  }, []);

  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: username,
  });

  const { data: userPosts } = api.posts.getPostsByUser.useQuery({
    userId: data?.id as string,
  });

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        Loading...
      </div>
    );
  }
  if (!data) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        404
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {data.firstName} {data.lastName}/ Cat Corner
        </title>
      </Head>
      <main className={`h-screen theme-${selectedTheme} text-content`}>
        <div className='relative flex h-screen w-full overflow-x-hidden'>
          <SideNavBar selectedThemeHandler={setSelectedTheme} />
          <div className='relative flex w-full flex-col grow md:items-end'>
            <div className='duration-300 md:w-[95%]'>
              <div>{data.firstName} profile</div>
              <div>
                {userPosts?.map((post) => {
                  return (
                    <Link key={post.id} href={`/post/${post.id}`}>
                      <div
                        key={post.id}
                        className='flex sm:gap-5 cursor-pointer border-b border-accent py-5 sm:pl-5'
                      >
                        <div>
                          <Link href={`${data.username as string}`}>
                            <Image
                              src={data.profileImageUrl}
                              width={48}
                              height={48}
                              className='h-ful w-12 rounded-full hidden sm:inline'
                              alt={`${
                                data.username as string
                              }'s profile picture`}
                            />
                          </Link>
                        </div>

                        <div className='flex w-full h-full items-center sm:items-start flex-col gap-3 font-noto'>
                          <div className='flex  w-full sm:m-0'>
                            <div className='flex items-center xs:flex-row xs:gap-2'>
                              <Image
                                src={data.profileImageUrl}
                                width={48}
                                height={48}
                                className='h-full w-12 rounded-full inline sm:hidden'
                                alt={`${
                                  data.username as string
                                }'s profile picture`}
                              />
                              <Link href={`${data.username as string}`}>
                                <div className='flex items-center gap-2'>
                                  <span className='font-bold hover:underline'>{`${
                                    data.firstName ? data.firstName : ''
                                  } ${
                                    data.lastName ? data.lastName : ''
                                  }`}</span>
                                  <span className='text-sm opacity-70 font-sans hover:underline'>{`@${
                                    data.username as string
                                  }`}</span>
                                </div>
                              </Link>
                            </div>
                          </div>

                          <div
                            className={`relative  flex flex-col gap-2 max-w-xs sm:max-w-lg`}
                            style={{ width: `${post.imageWidth}px` }}
                          >
                            <div className='font-sans w-full text-start'>
                              {post.content}
                            </div>
                            <Image
                              src={post.imageUrl}
                              alt={`${post.authorId}'s cat image`}
                              className='rounded'
                              width={post.imageWidth}
                              height={post.imageHeight}
                            />
                            {/* <div className='flex justify-around '>
              <div
                onClick={() => {
                  if (!user) {
                    return;
                  }
                  setIsLiked(!isLiked);
                  if (!isLiked) {
                    setPostLikes(postLikes + 1);
                    likePost({
                      postId: post.id,
                      userId: user?.id,
                      isLiked: isLiked,
                    });
                  } else {
                    setPostLikes(postLikes - 1);
                    likePost({
                      postId: post.id,
                      userId: user?.id,
                      isLiked: isLiked,
                    });
                  }
                }}
              >
                <LikeInterface likes={postLikes} isLiked={isLiked} />
              </div>
              <div
                onClick={() => {
                  if (!user) {
                    return;
                  }
                  setIsCommenting(!isCommenting);
                }}
              >
                <CommentInterface postComments={post.comments.length} />
              </div>
            </div> */}
                            <div hidden={true}>
                              {post.comments.map((comment) => {
                                return (
                                  <div key={comment.id}>{comment.content}</div>
                                );
                              })}
                            </div>
                            <div
                              className={`items-center gap-4 ${
                                true ? 'flex' : 'hidden'
                              }`}
                            >
                              <Image
                                src={data?.profileImageUrl}
                                width={48}
                                height={48}
                                className='h-full w-12 rounded-full'
                                alt={`${
                                  data?.username as string
                                }'s profile picture`}
                              />
                              <div className='flex  grow'>
                                <div className='w-full'>
                                  <input
                                    type='text'
                                    // onChange={(e) => setCommentContent(e.target.value)}
                                    // value={commentContent}
                                    placeholder='Add a comment...'
                                    className='bg-transparent outline-none  w-full sm:w-auto'
                                    id='image-input'
                                  />
                                  <label htmlFor='image-input'>
                                    <div className='flex cursor-pointer gap-1 text-sm sm:w-[60%] rounded duration-200 hover:scale-105 hover:bg-[#222]'>
                                      <ImageIcon />
                                      <span className='hidden xs:inline text-accent'>
                                        Upload Image
                                      </span>
                                    </div>
                                  </label>
                                </div>
                                {/* <button
                  onClick={() => {
                    addComment({
                      postId: post.id,
                      content: commentContent,
                      imageUrl: commentImageUrl,
                    });
                  }}
                >
                  <span className='bg-accent text-inverseContent text-sm mx-4 p-1 rounded cursor-pointer disabled:cursor-default'>
                    Comment
                  </span>
                </button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <BottomNavBar />
      </main>
    </>
  );
};

export default Profile;
