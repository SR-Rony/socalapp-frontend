"use client";

import { useState } from "react";
import {
  FileText,
  Clock,
  MessageCircle,
  Heart,
  Search,
  Eye,
  Trash2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostsPage() {
  const ITEMS_PER_PAGE = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* 🔹 Stats Data */
  const stats = [
    {
      title: "Total Posts",
      value: 120,
      icon: FileText,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Pending Posts",
      value: 8,
      icon: Clock,
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Comments",
      value: 342,
      icon: MessageCircle,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Reactions",
      value: 1254,
      icon: Heart,
      gradient: "from-pink-500 to-rose-600",
    },
  ];

  /* 🔹 Table Data */
  const posts = [
    {
      id: 1,
      author: "Rony",
      type: "Blog",
      approved: true,
      time: "2 hours ago",
      link: "/posts/1",
    },
    {
      id: 2,
      author: "Admin",
      type: "News",
      approved: false,
      time: "1 day ago",
      link: "/posts/2",
    },
    // Add more dummy posts here to test pagination
    ...Array.from({ length: 25 }, (_, i) => ({
      id: i + 3,
      author: `User ${i + 3}`,
      type: i % 2 === 0 ? "Blog" : "News",
      approved: i % 3 === 0,
      time: `${i + 1} days ago`,
      link: `/posts/${i + 3}`,
    })),
  ];

  /* 🔹 Filtered + Paginated Data */
  const filteredPosts = posts.filter(
    (post) =>
      post.author.toLowerCase().includes(search.toLowerCase()) ||
      post.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8">
      {/* 🔹 Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`
                bg-gradient-to-r ${item.gradient}
                rounded-xl
                p-5
                text-white
                shadow
                hover:shadow-lg
                transition
              `}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-white/80">{item.title}</p>
                  <h3 className="text-3xl font-bold">{item.value}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔹 Table Section */}
      <div className="bg-white rounded-xl shadow border">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
          <h2 className="text-lg font-semibold">Posts List</h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by author or type..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 border-collapse">
            <thead className="bg-gray-100 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left border border-gray-200 font-semibold">
                  ID
                </th>
                <th className="px-4 py-3 text-left border border-gray-200 font-semibold">
                  Author
                </th>
                <th className="px-4 py-3 text-left border border-gray-200 font-semibold">
                  Type
                </th>
                <th className="px-4 py-3 text-left border border-gray-200 font-semibold">
                  Approved
                </th>
                <th className="px-4 py-3 text-left border border-gray-200 font-semibold">
                  Time
                </th>
                <th className="px-4 py-3 text-left border border-gray-200 font-semibold">
                  Link
                </th>
                <th className="px-4 py-3 text-right border border-gray-200 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedPosts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground border border-gray-200"
                  >
                    No posts found
                  </td>
                </tr>
              )}

              {paginatedPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 border border-gray-200">{post.id}</td>
                  <td className="px-4 py-3 border border-gray-200 font-medium">
                    {post.author}
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-1 text-xs">
                      {post.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    {post.approved ? (
                      <span className="rounded-full bg-green-100 text-green-700 px-2 py-1 text-xs">
                        Approved
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-1 text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 text-muted-foreground">
                    {post.time}
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    <Link
                      href={post.link}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                  <td className="px-4 py-3 border border-gray-200 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredPosts.length)}
              </span>{" "}
              of <span className="font-medium">{filteredPosts.length}</span> entries
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
