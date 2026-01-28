import GroupPostActions from "./GroupPostActions";


export default function GroupPostCard({
  post,
  groupId,
  onChanged,
}: any) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between">
        <div className="font-medium">
          {post.authorId?.name}
        </div>

        <GroupPostActions
          post={post}
          groupId={groupId}
          onChanged={onChanged}
        />
      </div>

      {post.text && <p>{post.text}</p>}
    </div>
  );
}
