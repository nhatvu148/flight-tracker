import { FC, useMemo } from "react";
import type { GetStaticProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { getFlights } from "api/flights";
import { AirportData, FlightData } from "@/types";
import { getAirports } from "api/airports";

interface IProps {
  flights: FlightData[];
  airports: AirportData;
}

const Home: FC<IProps> = ({ flights, airports }) => {
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

  return <Map flights={flights} airports={airports} />;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const flights = await getFlights();
  const airports = await getAirports();
  return {
    props: {
      flights,
      airports,
    },
  };
};

export default Home;
