import { useMemo } from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  const Map = useMemo(
    () =>
      dynamic(
        () => import("@/main"), // replace '@components/map' with your component's location
        {
          loading: () => <p>A map is loading</p>,
          ssr: false, // This line is important. It's what prevents server-side render
        }
      ),
    [
      /* list variables which should trigger a re-render here */
    ]
  );

  return <Map />;
};

export default Home;
