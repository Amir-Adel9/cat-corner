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
  const [imageHasCat, setImageHasCat] = useState<string>();
  const [base64code, setBase64code] = useState('');

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

  const onImageLoad = (fileString: string) => {
    setBase64code(fileString);
  };

  const getBase64 = (image: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      onImageLoad(reader.result as string);
    };
  };

  if (!user) return null;

  return (
    <div className='flex items-start gap-5 border-b p-16 pl-5 pb-0 md:w-[95%]'>
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
              if (postContent) {
                mutate({ content: postContent, catImageBase64: base64code });
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
                getBase64(e.target.files?.[0] as File);

                const myHeaders = new Headers();
                myHeaders.append('x-api-key', `${env.NEXT_PUBLIC_CAT_API_KEY}`);

                const formdata = new FormData();
                formdata.append('file', e.target.files[0] as Blob);

                const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: formdata,
                  redirect: 'follow',
                };

                fetch(
                  'https://api.thecatapi.com/v1/images/upload',
                  requestOptions as RequestInit
                )
                  .then((response) => response.text())
                  .then((result) => setImageHasCat(result))
                  .catch((error) => console.log('error', error));
              }
            }}
          />
        </div>
      </div>

      {postImage && !isPosting && (
        <button
          onClick={() => {
            if (!imageHasCat?.includes('approved')) {
              toast.error('Image does not have a cat');
              return;
            } else {
              mutate({ content: postContent, catImageBase64: base64code });
            }
          }}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className='flex items-center justify-center'>
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs['posts']['getAll'][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className='flex gap-5 border-b border-white  py-5 pl-5 '>
      <Image
        src={author.profileImageUrl}
        width={48}
        height={48}
        className='h-full w-12 rounded-full'
        alt={`${author.username as string}'s profile picture`}
      />
      <div className='flex h-full flex-col gap-3'>
        <div className='flex items-center justify-around gap-2 '>
          <div className='flex flex-col items-center xs:flex-row xs:gap-2'>
            <span className='font-bold'>{`${
              author.firstName ? author.firstName : ''
            } ${author.lastName ? author.lastName : ''}`}</span>
            <span className='text-sm opacity-70 '>{`@${
              author.username as string
            }`}</span>
          </div>

          <span>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        {post.content}
        <Image
          src={post.catImageURL}
          alt={`${post.authorId}'s cat image`}
          className='w-32 rounded'
          width={128}
          height={128}
        />
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
    return (
      <div className='fixed z-10 hidden h-full items-center bg-white md:flex md:w-[5%] md:flex-col'>
        <Image
          src='/logo.png'
          width={50}
          height={50}
          className='rounded-full'
          alt='Cat Corner Logo'
        />
        <div className='absolute bottom-2 text-black '>
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
      <main className=''>
        <div className='relative flex h-screen w-full overflow-x-hidden'>
          <SideNavBar />
          <div className='relative flex w-full grow flex-col md:items-end'>
            {isSignedIn && <CreatePostWizard />}
            <div className='w-full md:w-[95%] '>
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
