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

import { env } from '../../env.mjs';
import LikeInterface from '~/components/like';
import CommentInterface from '~/components/comment';

import { themes } from '../../constants/themes';
import { BottomNavBar, SideNavBar } from '~/components/navbar';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '1s',
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

const Post: NextPage = () => {
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
            <div className='duration-300 md:w-[95%]'></div>
          </div>
        </div>
        <BottomNavBar />
      </main>
    </>
  );
};

export default Post;
