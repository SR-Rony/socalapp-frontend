import { Card } from "@/components/ui/card";

export default function GroupPostCard({ post }: any) {
  return (
    <Card className="p-4 space-y-2">
      <div className="text-sm font-medium">
        {post.authorId?.name}
      </div>

      {post.text && <p>{post.text}</p>}
      {post.caption && <p>{post.caption}</p>}

      {post.images?.length > 0 && (
        <img
          src={post.images[0].url}
          className="rounded-md"
        />
      )}
    </Card>
  );
}
