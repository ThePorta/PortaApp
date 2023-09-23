import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image'
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Porta App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="Bridging the Gap, Empower Your Wallet!"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href=""> </a>
          <Image
              src="/porta-logo.png"
              alt="Porta Logo"
              width={213}
              height={87.5}
            />
        </h1>

        <p className={styles.description}>
          Get started connecting your wallet!
        </p>

        <ConnectButton />
   
      </main>

      <footer className={styles.footer}>
        <a href="" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by Asa
        </a>
      </footer>
    </div>
  );
};

export default Home;
