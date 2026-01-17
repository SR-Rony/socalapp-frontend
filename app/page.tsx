// app/(client)/page.tsx
export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Home Page</h1>
      <p className="text-lg">
        This is the main landing page of the application.
      </p>

      {/* Example: feed cards */}
      <div className="space-y-4 mt-6">
        <div className="p-4 bg-white rounded-lg shadow">Post 1</div>
        <div className="p-4 bg-white rounded-lg shadow">Post 2</div>
        <div className="p-4 bg-white rounded-lg shadow">Post 3</div>
      </div>
    </div>
  );
}
