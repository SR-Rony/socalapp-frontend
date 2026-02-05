import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="reels">Reels</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
