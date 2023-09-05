import { useUser } from '@clerk/nextjs';

import { type NextPage } from 'next';

import Head from 'next/head';
import Image from 'next/image';

import { api, type RouterOutputs } from '~/utils/api';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import { LoadingPage, LoadingSpinner } from '~/components/loading';

import { useEffect, useRef, useState } from 'react';

import toast from 'react-hot-toast';

import ImageIcon from '~/components/svgs/image';

import { env } from '../env.mjs';
import LikeInterface from '~/components/like';
import CommentInterface from '~/components/comment';

import { themes } from '../constants/themes';
import { BottomNavBar, SideNavBar } from '~/components/navbar';
import Link from 'next/link';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1 month',
    MM: '%dm',
    y: '1y',
    yy: '%dy',
  },
});

const CreatePostWizard = () => {
  const { user } = useUser();

  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>();
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [isCheckingForCat, setIsCheckingForCat] = useState(false);
  const [imageHasCat, setImageHasCat] = useState<string>();
  const [imageUrl, setImageUrl] = useState('');

  const imageInputRef = useRef<HTMLInputElement>(null);

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.createPost.useMutation({
    onSuccess: () => {
      setPostContent('');
      setImageHasCat('');
      setPostImage(null);
      if (imageInputRef.current && imageInputRef.current.files) {
        imageInputRef.current.value = null!;
      }
      void ctx.posts.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.message;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error('Failed to post! Please try again later.');
      }
    },
  });

  if (!user) return <div>Sign in to start Posting</div>;

  return (
    <div className='flex items-start gap-2 sm:gap-5 border-b border-accent pt-10 pb-5 pl-5 w-full font-noto'>
      <Image
        src={user.profileImageUrl}
        width={50}
        height={50}
        className='rounded-full'
        alt={`${user?.username as string}'s profile picture`}
      />
      <div className='relative flex text-sm sm:text-base grow flex-col justify-center'>
        <input
          type='text'
          value={postContent}
          placeholder='Type some text...'
          disabled={isPosting}
          className='bg-transparent outline-none font-sono'
          onChange={(e) => setPostContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!imageHasCat?.includes('approved')) {
                toast.error('Image does not have a cat');
                return;
              } else {
                mutate({ content: postContent, imageUrl: imageUrl });
              }
            }
          }}
        />
        <div className='my-2'>
          {postImage && (
            <div className='relative w-[300px] rounded'>
              <span
                onClick={() => {
                  setPostImage(null);
                  setImageHasCat('');
                }}
                className='absolute w-8 h-8 left-0  cursor-pointer font-bold text-2xl hover:bg-inverseContent bg-[#222] rounded-[50%] text-center'
              >
                &times;
              </span>
              <Image
                src={URL.createObjectURL(postImage as Blob)}
                className='rounded'
                alt='preview image'
                width={300}
                height={200}
              />
            </div>
          )}
        </div>
        <div className='flex items-center justify-start xs:justify-between'>
          <div className='flex items-center gap- sm:gap-5'>
            <label htmlFor='image-input'>
              <div className='flex items-center gap-1 p-1 cursor-pointer rounded duration-200 hover:scale-110'>
                <ImageIcon />
                <div className='hidden xs:inline text-accent'>Upload Image</div>
              </div>
            </label>
            <div className='text-accent'>
              {isCheckingForCat ? (
                <div className='flex items-center gap-2'>
                  <LoadingSpinner size={18} />
                  <div>Applying catto check...</div>
                </div>
              ) : imageHasCat?.includes('approved') ? (
                <div>Catto status: catto check complete </div>
              ) : imageHasCat?.includes('failed') ? (
                <div>Catto status: no catto is found {`:(`} </div>
              ) : (
                <div>- your post must include an image of a cat -</div>
              )}
            </div>
            <input
              type='file'
              ref={imageInputRef}
              className='hidden'
              id='image-input'
              hidden={!postImage}
              accept='image/png, image/jpg, image/jpeg'
              onChange={(e) => {
                e.preventDefault();
                if (e.target.files) {
                  setPostImage(e.target.files?.[0] as File);
                  setIsUploadingImg(true);
                  setIsCheckingForCat(true);
                  const myHeaders = new Headers();
                  myHeaders.append(
                    'x-api-key',
                    `${env.NEXT_PUBLIC_CAT_API_KEY}`
                  );

                  const catCheckFormData = new FormData();
                  catCheckFormData.append('file', e.target.files[0] as Blob);

                  const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: catCheckFormData,
                    redirect: 'follow',
                  };

                  fetch(
                    'https://api.thecatapi.com/v1/images/upload',
                    requestOptions as RequestInit
                  )
                    .then((response) => response.text())
                    .then((result) => {
                      setIsCheckingForCat(false);
                      setImageHasCat(result);
                    })
                    .catch((error) => {
                      console.log('error', error);
                      setIsCheckingForCat(false);
                    });

                  const imageFormData = new FormData();
                  imageFormData.append('image', e.target.files[0] as Blob);
                  const requestOptions2 = {
                    method: 'POST',
                    body: imageFormData,
                    redirect: 'follow',
                  };

                  fetch(
                    `https://api.imgbb.com/1/upload?key=${env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                    requestOptions2 as RequestInit
                  )
                    .then((response) => response.json())
                    .then(
                      (result: {
                        data: {
                          url: string;
                        };
                      }) => {
                        setIsUploadingImg(false);
                        setImageUrl(result.data.url);
                      }
                    )
                    .catch((error) => {
                      console.log('imgbb error', error);
                      setIsUploadingImg(false);
                    });
                }
              }}
            />
          </div>
          <div className='flex '>
            {isUploadingImg || isCheckingForCat ? (
              <span>Uploading your image...</span>
            ) : (
              <button
                className='bg-accent text-inverseContent mx-4 px-3 py-1 duration-200 hover:scale-110 hover:disabled:scale-100 rounded cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-50'
                disabled={!postImage}
                onClick={() => {
                  if (!imageHasCat?.includes('approved')) {
                    toast.error('Image does not have a cat');
                    return;
                  } else {
                    mutate({ content: postContent, imageUrl: imageUrl });
                  }
                }}
              >
                Post
              </button>
            )}
            {isPosting || isCheckingForCat || isUploadingImg ? (
              <div className='flex flex-col items-center justify-center mx-2'>
                <LoadingSpinner size={20} />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type PostWithUser = RouterOutputs['posts']['getAll'][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  const { user } = useUser();

  const ctx = api.useContext();

  const [postLikes, setPostLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentImageUrl, setCommentImageUrl] = useState('');

  const commentInputRef = useRef<HTMLInputElement>(null);

  const { mutate: addComment } = api.posts.addComment.useMutation({
    onSuccess: () => {
      void ctx.posts.invalidate();
      setCommentContent('');
      setCommentImageUrl('');
    },
  });
  const { mutate: likePost } = api.posts.likePost.useMutation({
    onSuccess: () => {
      void ctx.posts.invalidate();
      if (commentInputRef.current) commentInputRef.current.value = '';
    },
  });

  return (
    <div
      key={post.id}
      className='flex sm:gap-5  border-b border-accent py-5 sm:pl-5'
    >
      <div>
        <Link href={`${author.username}`}>
          <Image
            src={author.profileImageUrl}
            width={48}
            height={48}
            className='h-ful w-12 rounded-full hidden sm:inline'
            alt={`${author.username}'s profile picture`}
          />
        </Link>
      </div>

      <div className='flex w-full h-full items-center sm:items-start flex-col gap-3 font-noto'>
        <div className='flex  w-full sm:m-0'>
          <div className='flex items-center xs:flex-row xs:gap-2'>
            <Image
              src={author.profileImageUrl}
              width={48}
              height={48}
              className='h-full w-12 rounded-full inline sm:hidden'
              alt={`${author.username}'s profile picture`}
            />
            <Link href={`${author.username}`}>
              <div className='flex items-center gap-2'>
                <span className='font-bold hover:underline'>{`${
                  author.firstName ? author.firstName : ''
                } ${author.lastName ? author.lastName : ''}`}</span>
                <span className='text-sm opacity-70 font-sans hover:underline'>{`@${author.username}`}</span>
              </div>
            </Link>
            <span>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
          </div>
        </div>

        <div
          className={`relative flex flex-col gap-2 max-w-xs sm:max-w-lg cursor-pointer`}
          style={{ width: `${post.imageWidth}px` }}
        >
          <Link href={`/post/${post.id}`}>
            <div className='font-sans w-full text-start'>{post.content}</div>
            <Image
              src={post.imageUrl}
              alt={`${post.authorId}'s cat image`}
              className='rounded'
              width={post.imageWidth}
              height={post.imageHeight}
            />
          </Link>
          <div className='flex justify-around '>
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
          </div>
          <div hidden={true}>
            {post.comments.map((comment) => {
              return <div key={comment.id}>{comment.content}</div>;
            })}
          </div>
          <div
            className={`items-center gap-4 ${isCommenting ? 'flex' : 'hidden'}`}
          >
            <Image
              src={user?.profileImageUrl as string}
              width={48}
              height={48}
              className='h-full w-12 rounded-full'
              alt={`${user?.username as string}'s profile picture`}
            />
            <div className='flex  grow'>
              <div className='w-full'>
                <input
                  type='text'
                  onChange={(e) => setCommentContent(e.target.value)}
                  value={commentContent}
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
              <button
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!posts) return <div>Something went wrong</div>;

  return (
    <div>
      {posts.map((postData) => (
        <PostView {...postData} key={postData.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded } = useUser();

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

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Home / Cat Corner</title>
      </Head>

      <main className={`h-screen theme-${selectedTheme} text-content`}>
        <div className='relative flex h-screen w-full overflow-x-hidden'>
          <SideNavBar selectedThemeHandler={setSelectedTheme} />
          <div className='relative flex w-full flex-col grow md:items-end'>
            <div className='duration-300 md:w-[95%]'>
              <header className='fixed bg-red-700 flex items-center justify-center font-tilt text-lg h-[3%] w-full z-10 '>
                <div>
                  This website is still under development, some features may be
                  broken. (You need to be Signed in to Post, Like and Comment)
                </div>
              </header>
              <CreatePostWizard />
              <Feed />
            </div>
          </div>
        </div>
        <BottomNavBar />
      </main>
    </>
  );
};

export default Home;
