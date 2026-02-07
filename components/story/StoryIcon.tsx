export default function StoryIcon() {
  return (
    <div className="w-16 text-center cursor-pointer">
      <div className="w-14 h-14 rounded-full border-2 border-blue-500 flex items-center justify-center">
        <button onClick={() => setOpen(true)}>
  {/* <Plus /> */}

        ➕
</button>
      </div>
      <p className="text-xs mt-1">Create Story</p>
    </div>
  );
}
