import { FlightDetailClient } from "./FlightDetailClient";

export const metadata = {
  title: "Flight Detail — Flight Tracker",
};

export default async function FlightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FlightDetailClient id={id} />;
}
