import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { themes } from '~/constants/themes';
import HomeIcon from './svgs/home';
import InfoIcon from './svgs/info';
import LikesIcon from './svgs/likes';
import ProfileIcon from './svgs/profile';
import ThemeIcon from './svgs/theme';

export const SideNavBar = (props: {
  selectedThemeHandler: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { user, isSignedIn } = useUser();

  const router = useRouter();

  const routeQuery = router.query.slug as string;

  const { selectedThemeHandler } = props;

  const [isHovered, setIsHovered] = useState(false);

  const [isActive, setIsActive] = useState(router.pathname);

  const [isTheming, setIsTheming] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed text-constant z-20 hidden h-full font-noto items-center group hover:items-start duration-300 bg-secondary md:flex md:flex-col ${
        isHovered ? 'w-[15%]' : 'w-[5%]'
      }`}
    >
      <Link href='/'>
        <div className='flex justify-center items-center gap-1 cursor-pointer duration-200 hover:scale-105 group-hover:pl-5'>
          <Image
            src='/logo.png'
            width={50}
            height={50}
            className='rounded-full inline'
            onClick={() => {
              setIsActive(router.pathname);
              setIsTheming(false);
            }}
            alt='Cat Corner Logo'
          />

          <span className='font-bold' hidden={!isHovered}>
            Cat Corner
          </span>
        </div>
      </Link>
      <div className='h-1/2'>
        <div className='w-full h-full flex flex-col duration-200 items-center justify-evenly group-hover:items-start group-hover:pl-5'>
          <Link href='/'>
            <div
              onClick={() => {
                setIsActive(router.pathname);
                setIsTheming(false);
              }}
              className='flex items-center cursor-pointer duration-200 hover:scale-110'
            >
              <HomeIcon activeTab={isActive} />
              <span className='ml-1' hidden={!isHovered}>
                Home
              </span>
            </div>
          </Link>
          <Link href={{ pathname: '/[slug]', query: { slug: user?.username } }}>
            <div
              onClick={() => {
                setIsActive(routeQuery);
                setIsTheming(false);
              }}
              className='flex items-center cursor-pointer group-hover:-translate-x-2 duration-200 hover:scale-110'
            >
              <ProfileIcon
                activeTab={isActive}
                isOwnProfile={user!.username === routeQuery ? true : false}
              />
              <span hidden={!isHovered}>Profile</span>
            </div>
          </Link>
          <div
            onClick={() => {
              setIsActive('Likes');
              setIsTheming(false);
            }}
            className='flex items-center cursor-pointer duration-200 hover:scale-110'
          >
            <LikesIcon activeTab={isActive} />
            <span className='ml-1' hidden={!isHovered}>
              Likes
            </span>
          </div>
          <div
            onClick={() => {
              setIsTheming(true);
              setIsActive('Theme');
            }}
            className='flex items-center cursor-pointer duration-200 hover:scale-110'
          >
            <ThemeIcon activeTab={isActive} />
            <div className='ml-1' hidden={!isHovered}>
              Theme
            </div>
          </div>
          <div
            onClick={() => {
              setIsActive('Info');
              setIsTheming(false);
            }}
            className='flex items-center cursor-pointer duration-200 hover:scale-110'
          >
            <InfoIcon activeTab={isActive} />
            <span className='ml-1' hidden={!isHovered}>
              Info
            </span>
          </div>
        </div>
      </div>
      <ul
        className={`flex-col items-center group-hover:items-start group-hover:pl-5 ${
          isTheming ? 'flex' : 'hidden'
        }`}
      >
        <div className='text-center'>Select a theme</div>
        {themes.map((theme) => (
          <li
            className='cursor-pointer'
            key={theme}
            onClick={() => {
              selectedThemeHandler(theme);
              localStorage.setItem('selectedTheme', theme);
            }}
          >
            {theme}
          </li>
        ))}
        <div
          onClick={() => {
            setIsTheming(false);
            setIsActive(router.pathname);
          }}
          className='text-center cursor-pointer bg-constant text-secondary rounded px-2 py-1 mt-2'
        >
          Save
        </div>
      </ul>
      <div className='absolute bottom-2 group-hover:pl-5 group-hover:w-full'>
        <div>
          {!isSignedIn && (
            <div className='bg-constant text-secondary rounded px-2 py-1 mt-2'>
              <SignInButton />
            </div>
          )}
          {!!isSignedIn && (
            <div className='flex group-hover:w-full'>
              <div className='flex gap-1 items-center group-hover:w-full'>
                <Image
                  src={user?.profileImageUrl}
                  width={40}
                  height={40}
                  className='rounded-full border border-constant'
                  alt={`${user?.username as string}'s profile picture`}
                />
                <div
                  className={`justify-between group-hover:w-full  ${
                    !isHovered ? 'hidden' : 'flex'
                  }`}
                >
                  <div className='flex flex-col'>
                    <span>{user?.fullName}</span>
                    <span className='text-xs opacity-90'>{`@${
                      user?.username as string
                    }`}</span>
                  </div>
                  <div className='bg-constant text-secondary rounded px-2 py-1 mt-2 mr-8'>
                    <SignOutButton />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const BottomNavBar = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const routeQuery = router.query.slug as string;

  const [isActive, setIsActive] = useState(router.pathname);

  return (
    <div className='sticky text-constant bottom-0 flex h-[7%] w-full items-center justify-center border-t bg-secondary md:hidden'>
      <div className='flex'>
        <div
          onClick={() => {
            setIsActive(router.pathname);
            void router.push('/');
          }}
          className='flex items-center'
        >
          <HomeIcon activeTab={isActive} />
        </div>

        <Link href={`/${isSignedIn ? (user.username as string) : ''}`}>
          <div
            onClick={() => {
              setIsActive(router.pathname);
            }}
            className='flex items-center cursor-pointer group-hover:-translate-x-2'
          >
            <ProfileIcon
              activeTab={isActive}
              isOwnProfile={user!.username === routeQuery ? true : false}
            />
          </div>
        </Link>
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
