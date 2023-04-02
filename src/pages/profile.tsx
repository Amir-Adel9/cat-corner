import { useUser } from '@clerk/nextjs';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { BottomNavBar, SideNavBar } from '~/components/navbar';
import { themes } from '~/constants/themes';
import { api } from '~/utils/api';

const Profile: NextPage = () => {
  const { isLoaded: userLoaded } = useUser();

  const [selectedTheme, setSelectedTheme] = useState(themes[0] as string);

  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Cat Corner</title>
        <meta name='description' content='Cat Corner by Amir Adel' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main className={`h-screen theme-${selectedTheme} text-content`}>
        <div className='relative flex h-screen w-full overflow-x-hidden'>
          <SideNavBar selectedThemeHandler={setSelectedTheme} />
          <div className='relative flex w-full flex-col grow md:items-end'>
            <div className='duration-300 md:w-[95%]'>
              <div>Profile</div>
            </div>
          </div>
        </div>
        <BottomNavBar />
      </main>
    </>
  );
};

export default Profile;
