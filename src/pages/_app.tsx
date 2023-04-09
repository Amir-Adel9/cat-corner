import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';

import { type AppType } from 'next/app';
import Head from 'next/head';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import { Toaster } from 'react-hot-toast';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Cat Corner</title>
        <meta name='Cat posting website' content='Cat Corner by Amir Adel' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <Toaster position='top-center' reverseOrder={false} />
      <Component {...pageProps} />
      <Analytics />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
