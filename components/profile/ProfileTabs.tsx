interface Props {
  active: string;
  onChange: (tab: string) => void;
}

const tabs = ["posts", "photos", "reels", "videos"];

export default function ProfileTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-6 border-b px-6">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`py-3 capitalize ${
            active === tab && "border-b-2 border-primary font-semibold"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
