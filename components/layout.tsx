import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import SectionNavbars from "pages-sections/components/SectionNavbars.js";
import styles from "../styles/Home.module.css";

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
          href="https://github.com/nhatvu148"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/NhatVu.png" alt="NhatVu Logo" width={40} height={40} />
          </span>
        </a>
      </footer>
    </>
  );
}
