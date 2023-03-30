import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';

import { type NextPage } from 'next';

import Head from 'next/head';
import Image from 'next/image';

import { api, type RouterOutputs } from '~/utils/api';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import { LoadingPage, LoadingSpinner } from '~/components/loading';

import { useRef, useState } from 'react';

import toast from 'react-hot-toast';

import ImageIcon from '~/components/svgs/image';

import { env } from '../env.mjs';
import HomeIcon from '~/components/svgs/home';
import ProfileIcon from '~/components/svgs/profile';
import LikesIcon from '~/components/svgs/likes';
import InfoIcon from '~/components/svgs/info';
import ThemeIcon from '~/components/svgs/theme';

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
    M: '1m',
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

  if (!user) return null;

  return (
    <div className='flex items-start gap-5 border-b pt-10 pb-5 pl-5 w-full font-noto'>
      <Image
        src={user.profileImageUrl}
        width={50}
        height={50}
        className='rounded-full'
        alt={`${user.username!}'s profile picture`}
      />
      <div className='relative flex grow flex-col justify-center '>
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
            <Image
              src={URL.createObjectURL(postImage as Blob)}
              className='rounded'
              alt='preview image'
              width={300}
              height={200}
            />
          )}
        </div>
        <div className='flex items-center justify-start xs:justify-between'>
          <div className='flex items-center'>
            <label htmlFor='image-input'>
              <div className='flex cursor-pointer gap-1 p-1 rounded duration-200 hover:scale-105 hover:bg-[#222]'>
                <ImageIcon />
                <span className='hidden xs:inline'>Upload Image</span>
              </div>
            </label>
            <input
              type='file'
              ref={imageInputRef}
              className='hidden'
              id='image-input'
              hidden={!postImage}
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
                className='bg-slate-100 text-black mx-4 px-3 py-1 rounded cursor-pointer disabled:cursor-default'
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

  if (!user) return <div></div>;

  const { mutate: addComment } = api.posts.addComment.useMutation({});
  const { mutate: likePost } = api.posts.likePost.useMutation({
    onSuccess: () => {
      void ctx.posts.invalidate();
    },
  });

  return (
    <div key={post.id} className='flex gap-5 border-b border-white py-5 pl-5'>
      <Image
        src={author.profileImageUrl}
        width={48}
        height={48}
        className='h-full w-12 rounded-full'
        alt={`${author.username}'s profile picture`}
      />
      <div className='flex w-full h-full flex-col gap-3 font-noto'>
        <div className='flex items-start gap-2'>
          <div className='flex flex-col items-center xs:flex-row xs:gap-2'>
            <span className='font-bold '>{`${
              author.firstName ? author.firstName : ''
            } ${author.lastName ? author.lastName : ''}`}</span>
            <span className='text-sm opacity-70 font-sans'>{`@${author.username}`}</span>
          </div>

          <span>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className='font-sans'>{post.content}</span>
        <div
          className={`relative max-w-lg`}
          style={{ width: `${post.imageWidth}px` }}
        >
          <Image
            src={post.imageUrl}
            alt={`${post.authorId}'s cat image`}
            className='rounded'
            width={post.imageWidth}
            height={post.imageHeight}
          />
          <div className='flex justify-around'>
            <div
              onClick={() => {
                likePost({ postId: post.id, userId: user?.id });
              }}
              className='flex'
            >
              <span>
                <LikesIcon activeTab='Likes' />
              </span>
              <span>{post.likes} Like</span>
            </div>
            <div className='flex'>
              <span>X </span> <span>Comment</span>
            </div>
          </div>
          <div>
            <input
              type='text'
              className='text-black'
              id='image-input'
              hidden={!true}
            />
            <label htmlFor='image-input'>
              <div className='flex cursor-pointer gap-1 p-1 rounded duration-200 hover:scale-105 hover:bg-[#222]'>
                <ImageIcon />
                <span className='hidden xs:inline'>Upload Image</span>
              </div>
            </label>
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
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const [isActive, setIsActive] = useState('Home');

  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  const SideNavBar = () => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className='fixed z-10 hidden h-full font-noto items-center group hover:items-start duration-300 bg-white md:flex md:flex-col md:w-[5%] hover:w-[15%] text-black'
      >
        <div className='flex justify-center items-center group-hover:pl-5'>
          <Image
            src='/logo.png'
            width={50}
            height={50}
            className='rounded-full'
            alt='Cat Corner Logo'
          />
          <span className='ml-1' hidden={!isHovered}>
            Cat Corner
          </span>
        </div>
        <div className='w-full h-1/2 flex flex-col duration-200 items-center justify-evenly group-hover:items-start group-hover:pl-5'>
          <div
            onClick={() => setIsActive('Home')}
            className='flex items-center'
          >
            <HomeIcon activeTab={isActive} />
            <span className='ml-1' hidden={!isHovered}>
              Home
            </span>
          </div>

          <div
            onClick={() => setIsActive('Profile')}
            className='flex items-center group-hover:-translate-x-2'
          >
            <ProfileIcon activeTab={isActive} />
            <span hidden={!isHovered}>Profile</span>
          </div>
          <div
            onClick={() => setIsActive('Likes')}
            className='flex items-center'
          >
            <LikesIcon activeTab={isActive} />
            <span className='ml-1' hidden={!isHovered}>
              Likes
            </span>
          </div>
          <div
            onClick={() => setIsActive('Theme')}
            className='flex items-center'
          >
            <ThemeIcon activeTab={isActive} />
            <span className='ml-1' hidden={!isHovered}>
              Theme
            </span>
          </div>
          <div
            onClick={() => setIsActive('Info')}
            className='flex items-center'
          >
            <InfoIcon activeTab={isActive} />
            <span className='ml-1' hidden={!isHovered}>
              Info
            </span>
          </div>
        </div>
        <div className='absolute bottom-2 text-black'>
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && <SignOutButton />}
        </div>
      </div>
    );
  };

  const BottomNavBar = () => {
    return (
      <div className='fixed bottom-0 flex h-[7%] w-full items-center justify-center border-t bg-black md:hidden'>
        <div className=' flex'>
          <div className='flex items-center fill-white'>
            <HomeIcon activeTab={isActive} />
          </div>

          <div className='flex items-center group-hover:-translate-x-2'>
            <ProfileIcon activeTab={isActive} />
          </div>
          <div className='flex items-center'>
            <LikesIcon activeTab={isActive} />
          </div>
          <div className='flex items-center'>
            <ThemeIcon activeTab={isActive} />
          </div>
          <div className='flex items-center'>
            <InfoIcon activeTab={isActive} />
          </div>
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && <SignOutButton />}
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Cat Corner</title>
        <meta name='description' content='Cat Corner by Amir Adel' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main>
        <div className='relative flex h-screen w-full overflow-x-hidden'>
          <SideNavBar />
          <div className='relative flex w-full flex-col grow md:items-end'>
            <div className='duration-300 md:w-[95%]'>
              {isSignedIn && <CreatePostWizard />}
              <Feed />
            </div>
            <BottomNavBar />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
