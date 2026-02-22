import { AirportDetailClient } from "./AirportDetailClient";

export const metadata = {
  title: "Airport Detail — Flight Tracker",
};

export default async function AirportDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <AirportDetailClient code={code} />;
}
