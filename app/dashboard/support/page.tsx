"use client";

import { useState } from "react";
import {
  Ticket,
  Search,
  Layers,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* =======================
   Types
======================= */
type TicketStatus =
  | "Unassigned"
  | "In Progress"
  | "Open"
  | "Pending"
  | "Solved"
  | "Closed";

type TicketItem = {
  id: number;
  requester: string;
  subject: string;
  agent: string;
  status: TicketStatus;
  lastUpdate: string;
};

/* =======================
   Mock Data
======================= */
const ticketStats = [
  { label: "All", count: 16 },
  { label: "Unassigned", count: 14 },
  { label: "In Progress", count: 5 },
  { label: "Open", count: 9 },
  { label: "Pending", count: 1 },
  { label: "Solved", count: 1 },
  { label: "Closed", count: 0 },
];

const tickets: TicketItem[] = [
  {
    id: 16,
    requester: "Muse Incorporated",
    subject: "This is a test ticket",
    agent: "Unassigned",
    status: "In Progress",
    lastUpdate: "12 hours ago",
  },
  {
    id: 15,
    requester: "Daniel Rădoi",
    subject: "test",
    agent: "Unassigned",
    status: "Open",
    lastUpdate: "2 days ago",
  },
  {
    id: 14,
    requester: "DINH NO NO",
    subject: "mình muốn mua...",
    agent: "Unassigned",
    status: "Open",
    lastUpdate: "9 days ago",
  },
  {
    id: 7,
    requester: "Oleg Jumper",
    subject: "Тест",
    agent: "Unassigned",
    status: "In Progress",
    lastUpdate: "15 days ago",
  },
  {
    id: 13,
    requester: "Davon Martin",
    subject: "Davon - Test Support Ticket",
    agent: "Unassigned",
    status: "In Progress",
    lastUpdate: "17 days ago",
  },
];

/* =======================
   Component
======================= */
export default function SupportCenterPage() {
  const ITEMS_PER_PAGE = 10;

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================
     Filter Logic
  ======================= */
  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toString().includes(search);

    const matchStatus =
      activeFilter === "All"
        ? true
        : t.status === activeFilter;

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(
    filteredTickets.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-6 bg-white p-3 rounded-xl">
      {/* ================= Banner ================= */}
      <div className="rounded-xl bg-gradient-to-r from-[#10897E] to-[#0f766e] p-6 text-white shadow">
        <div className="flex items-center gap-3">
          <Ticket className="h-7 w-7" />
          <div>
            <h1 className="text-2xl font-semibold">
              Support Center
            </h1>
            <p className="text-sm opacity-90">
              Manage and resolve user support tickets
            </p>
          </div>
        </div>
      </div>

      {/* ================= Main Layout ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ===== Left Stats ===== */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow border">
            <div className="flex items-center gap-2 p-4 border-b font-medium">
              <Layers className="h-4 w-4 text-[#10897E]" />
              Ticket Overview
            </div>

            <div className="divide-y">
              {ticketStats.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveFilter(item.label);
                    setCurrentPage(1);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-sm transition
                    ${
                      activeFilter === item.label
                        ? "bg-gray-100 font-medium"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <span>{item.label}</span>
                  <Badge variant="secondary">
                    {item.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Right Content ===== */}
        <div className="lg:col-span-9 space-y-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by Subject or Ticket ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* ===== Table (UsersPage style) ===== */}
          <div className="bg-white rounded-xl shadow border">
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-3 text-left">ID</th>
                    <th className="border px-4 py-3 text-left">
                      Requester
                    </th>
                    <th className="border px-4 py-3 text-left">
                      Subject
                    </th>
                    <th className="border px-4 py-3 text-left">
                      Agent
                    </th>
                    <th className="border px-4 py-3 text-left">
                      Status
                    </th>
                    <th className="border px-4 py-3 text-left">
                      Last Update
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="border px-4 py-2 font-medium">
                        #{ticket.id}
                      </td>
                      <td className="border px-4 py-2">
                        {ticket.requester}
                      </td>
                      <td className="border px-4 py-2 max-w-[280px] truncate">
                        {ticket.subject}
                      </td>
                      <td className="border px-4 py-2">
                        {ticket.agent}
                      </td>
                      <td className="border px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                            ${
                              ticket.status === "Open"
                                ? "bg-blue-100 text-blue-700"
                                : ticket.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : ticket.status === "Solved"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="border px-4 py-2">
                        {ticket.lastUpdate}
                      </td>
                    </tr>
                  ))}

                  {paginatedTickets.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No tickets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-4 border-t text-sm">
              <span className="text-muted-foreground">
                Displaying {startIndex + 1}–
                {Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  filteredTickets.length
                )}{" "}
                of {filteredTickets.length}
              </span>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((p) => p - 1)
                  }
                >
                  Prev
                </Button>
                <Button size="sm">{currentPage}</Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => p + 1)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
