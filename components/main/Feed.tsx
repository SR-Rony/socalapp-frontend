export default function Feed() {
  return (
    <div className="space-y-6">
      {/* Post example */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-bold mb-2">John Doe</h3>
        <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-bold mb-2">Jane Smith</h3>
        <p className="text-sm text-gray-600">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>

      {/* Add more posts */}
    </div>
  );
}
