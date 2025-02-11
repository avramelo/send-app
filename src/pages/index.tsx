"use client";

import type { NextPage } from "next";
import Head from "next/head";
import HomeContent from "./(home)/components/HomeContent";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Send App</title>
        <meta name="description" content="Heighliner App" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <HomeContent />
    </>
  );
};

export default Home;
