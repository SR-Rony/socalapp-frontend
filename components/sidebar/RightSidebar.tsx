export default function RightSidebar() {
  return (
    <div className="bg-white rounded-xl shadow p-4 sticky top-6">
      <h2 className="font-bold text-lg mb-4">Suggestions</h2>
      <ul className="space-y-3 text-sm">
        <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Suggested Friend 1</li>
        <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Suggested Friend 2</li>
        <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Suggested Page 1</li>
      </ul>
    </div>
  );
}
