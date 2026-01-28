"use client";

import { useParams } from "next/navigation";
import { useGroupPosts } from "@/hooks/useGroupPosts";
import { useGroupDetails } from "@/hooks/useGroupDetails";
import GroupPostComposer from "@/components/dashboard/group/group_post/GroupPostComposer";
import GroupPostList from "@/components/dashboard/group/group_post/GroupPostList";

export default function GroupDetailsPage() {
  const { groupId } = useParams();

  const { group } = useGroupDetails(groupId as string);
  const {
    posts,
    loadMore,
    hasMore,
    refresh,
  } = useGroupPosts(groupId as string);

  if (!group) return null;

  return (
    <div className=" mx-auto space-y-4 bg-white p-4 rounded-xl">
      <h1 className="text-2xl font-bold">
        {group.name}
      </h1>

      <GroupPostComposer
        groupId={groupId as string}
        onCreated={refresh}
      />

      <GroupPostList
        posts={posts}
        loadMore={loadMore}
        hasMore={hasMore}
      />
    </div>
  );
}
