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
    <div className='flex items-start gap-5 border-b p-16 pl-5 pb-0 w-full'>
      <Image
        src={user.profileImageUrl}
        width={50}
        height={50}
        className='rounded-full'
        alt={`${user.username!}'s profile picture`}
      />
      <div className='relative flex grow flex-col justify-center pb-14 last:mt-auto'>
        <input
          type='text'
          value={postContent}
          placeholder='Type some text...'
          disabled={isPosting}
          className='bg-transparent outline-none'
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
        <div className='absolute bottom-4 flex items-center gap-2'>
          <label htmlFor='image-input'>
            <div className='flex cursor-pointer gap-1 rounded p-1 duration-200 hover:scale-105 hover:bg-[#222]'>
              <ImageIcon />
              <span>Upload Image</span>
            </div>
          </label>
          <input
            type='file'
            ref={imageInputRef}
            className='file:hidden'
            id='image-input'
            hidden={!postImage}
            onChange={(e) => {
              e.preventDefault();
              if (e.target.files) {
                setPostImage(e.target.files?.[0] as File);
                setIsUploadingImg(true);
                setIsCheckingForCat(true);
                const myHeaders = new Headers();
                myHeaders.append('x-api-key', `${env.NEXT_PUBLIC_CAT_API_KEY}`);

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
      </div>

      {postImage && !isPosting && !isUploadingImg && !isCheckingForCat && (
        <button
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
      {isPosting || isCheckingForCat ? (
        <div className='flex flex-col items-center justify-center'>
          <LoadingSpinner size={20} />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs['posts']['getAll'][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className='flex gap-5 border-b border-white py-5 pl-5'>
      <Image
        src={author.profileImageUrl}
        width={48}
        height={48}
        className='h-full w-12 rounded-full'
        alt={`${author.username}'s profile picture`}
      />
      <div className='flex w-full h-full flex-col  gap-3'>
        <div className='flex items-start gap-2'>
          <div className='flex flex-col items-center xs:flex-row xs:gap-2'>
            <span className='font-bold'>{`${
              author.firstName ? author.firstName : ''
            } ${author.lastName ? author.lastName : ''}`}</span>
            <span className='text-sm opacity-70 '>{`@${author.username}`}</span>
          </div>

          <span>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        {post.content}
        <span className={`relative max-w-lg`}>
          <Image
            src={post.catImageUrl}
            alt={`${post.authorId}'s cat image`}
            className='rounded'
            width={post.catImageWidth}
            height={post.catImageHeight}
          />
        </span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div>
      {data.map((postData) => (
        <PostView {...postData} key={postData.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  const SideNavBar = () => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className='fixed z-10 hidden h-full items-center duration-300 bg-white md:flex md:flex-col md:w-[5%] hover:w-[15%]'
      >
        <div className='flex justify-center items-center'>
          <Image
            src='/logo.png'
            width={50}
            height={50}
            className='rounded-full'
            alt='Cat Corner Logo'
          />
          <span className='text-black ml-3' hidden={!isHovered}>
            Cat Corner
          </span>
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
        <div className=' '>
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
