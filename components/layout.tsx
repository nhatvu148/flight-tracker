import Head from "next/head";
import Image from 'next/image'
import SectionNavbars from "pages-sections/components/SectionNavbars.js";
import styles from '../styles/Home.module.css'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Flight Tracker</title>
        <meta name="description" content="Next Movies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SectionNavbars />
      {children}
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </>
  );
}
