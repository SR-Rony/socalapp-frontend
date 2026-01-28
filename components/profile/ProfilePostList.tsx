export default function ProfilePostList({ posts }: { posts: any[] }) {
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post._id} className="border rounded-lg p-4">
          <p>{post.text}</p>
        </div>
      ))}
    </div>
  );
}
