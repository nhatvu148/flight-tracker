import { FC, useMemo } from "react";
import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { dehydrate, QueryClient } from "react-query";
import { getFlights } from "api/flights";
import { getAirports } from "api/airports";

const Home: FC = () => {
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery("flights", getFlights);
  await queryClient.prefetchQuery("airports", getAirports);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
