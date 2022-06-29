import React, { FC, useEffect, useMemo } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { dehydrate, QueryClient } from "react-query";
import { getFlights } from "api/flights";
import { getAirports } from "api/airports";
import Loading from "@/Loading";
import { connect } from "react-redux";
import { getMain } from "redux/selectors";
import { IAppState, IMainState } from "redux/types";

interface IStateProps {
  main: IMainState;
}

type IProps = IStateProps;

const Zoom: FC<IProps> = ({ main: { mapCenter, zoom } }) => {
  useEffect(() => {
    window.history.pushState(
      null,
      "coordinates",
      `/${mapCenter.lat},${mapCenter.lng}/${zoom}`
    );
  }, [mapCenter, zoom]);

  const Map = useMemo(
    () =>
      dynamic(
        () => import("@/main"), // replace '@components/map' with your component's location
        {
          loading: () => <Loading />,
          ssr: false, // This line is important. It's what prevents server-side render
        }
      ),
    [
      /* list variables which should trigger a re-render here */
    ]
  );

  return <Map />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data = [];
  return {
    paths: data.map(() => {
      return {
        params: {},
      };
    }),
    fallback: true,
  };
};

//// getServerSideProps: Loading large data from server side may cause issue in production --> Use client side query or getStaticProps
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // const { coordinates, zoom } = params;
  // console.log({ coordinates, zoom });

  const queryClient = new QueryClient();

  // prefetch the first 100 results
  await queryClient.prefetchQuery("flights", () => getFlights(100));
  await queryClient.prefetchQuery("airports", () => getAirports(100));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  main: getMain(state),
});

export default connect(mapStateToProps)(Zoom);
