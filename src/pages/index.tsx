import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Head from "next/head";
import Image from "next/image";

import { api, type RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import LoadingSpinner from "~/components/loading";
import LoadingPage from "~/components/loading";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "h",
    hh: "%dh",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

const CreatePostWizard = () => {
  const { user } = useUser();
  console.log("user", user);
  if (!user) return null;

  return (
    <div className="justify-star gap- flex h-1/6 items-center gap-5 border-b pl-5 md:w-[95%]">
      <Image
        src={user.profileImageUrl}
        width={50}
        height={50}
        className="rounded-full"
        alt={`${user.username!}'s profile picture`}
      />
      <input
        type="text"
        placeholder="Type some text..."
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-5 border-b border-white  py-5 pl-5 ">
      <Image
        src={author.profileImageUrl}
        width={48}
        height={48}
        className="h-full w-12 rounded-full"
        alt={`${author.username}'s profile picture`}
      />
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-around gap-2 ">
          <div className="flex flex-col items-center xs:flex-row xs:gap-2">
            <span className="font-bold">{`${author.firstName} ${author.lastName}`}</span>
            <span className="text-sm opacity-70 ">{`@${author.username}`}</span>
          </div>

          <span>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        {post.content}

        <Image
          src={post.catImageURL}
          alt={`${post.authorId}'s cat image`}
          className="w-32 rounded"
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
      {[...data, ...data]?.map((postData) => (
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
      <div className="fixed z-10 hidden h-full items-center bg-white md:flex md:w-[5%] md:flex-col">
        <Image
          src="/logo.png"
          width={50}
          height={50}
          className="rounded-full"
          alt="Cat Corner Logo"
        />
        <div className="absolute bottom-2 text-black ">
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && <SignOutButton />}
        </div>
      </div>
    );
  };

  const BottomNavBar = () => {
    return (
      <div className="absolute bottom-0 flex h-[7%] w-full items-center justify-center bg-slate-100 md:hidden">
        <div className="text-black ">
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
        <meta name="description" content="Cat Corner by Amir Adel" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="">
        <div className="relative flex h-screen w-full overflow-x-hidden">
          <SideNavBar />
          <div className="relative flex w-full grow flex-col md:items-end">
            {isSignedIn && <CreatePostWizard />}
            <div className="w-full md:w-[95%] ">
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
