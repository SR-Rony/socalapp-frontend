import { SignedImage } from "@/components/common/SignedImage";
import api from "@/lib/api";
import { useState } from "react";

export default function CommentItem({
  comment,
  postId,
}: {
  comment: any;
  postId: string;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");

  const fetchReplies = async () => {
    const res = await api.get(`/comment/${comment._id}/replies`);
    setReplies(res.data.items || []);
    setShowReply(true);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    const res = await api.post(`/comment/${postId}/comments`, {
      text: replyText,
      parentId: comment._id,
    });

    setReplies(prev => [res.data.comment, ...prev]);
    setReplyText("");
    setShowReply(true);
  };

  return (
    <div className="flex gap-3">
      <SignedImage
        url={comment.author?.avatar?.url}
        keyPath={comment.author?.avatar?.key}
        provider={comment.author?.avatar?.provider}
        className="w-9 h-9 rounded-full"
      />

      <div className="flex-1">
        <p className="text-sm font-medium">
          {comment.author?.username}
        </p>

        <p className="text-sm mt-1">{comment.text}</p>

        {/* actions */}
        <div className="flex gap-4 text-xs mt-2 text-muted-foreground">
          <button onClick={fetchReplies}>
            Reply
          </button>

          {comment.replyCount > 0 && !showReply && (
            <button onClick={fetchReplies}>
              View {comment.replyCount} replies
            </button>
          )}
        </div>

        {/* reply box */}
        {showReply && (
          <div className="mt-3">
            <input
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full border-b bg-transparent outline-none pb-1 text-sm"
            />

            <div className="flex justify-end mt-2">
              <button
                onClick={handleReply}
                className="text-sm bg-black text-white px-3 py-1 rounded-full"
              >
                Reply
              </button>
            </div>

            {/* replies list */}
            <div className="mt-4 flex flex-col gap-4">
              {replies.map(r => (
                <div key={r._id} className="flex gap-3">
                  <SignedImage
                    url={r.author?.avatar?.url}
                    keyPath={r.author?.avatar?.key}
                    provider={r.author?.avatar?.provider}
                    className="w-7 h-7 rounded-full"
                  />

                  <div>
                    <p className="text-xs font-medium">
                      {r.author?.username}
                    </p>
                    <p className="text-sm">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}