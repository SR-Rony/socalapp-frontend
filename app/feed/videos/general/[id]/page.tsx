import WatchPageContent from "@/components/video/general/WatchPageContent";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WatchPage({ params }: Props) {
  const { id } = await params;

  return <WatchPageContent videoId={id} />;
}


