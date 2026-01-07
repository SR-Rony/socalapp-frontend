import React from 'react'

const PaymentsTable = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">
        Payments History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Payer</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Via</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5].map((item) => (
              <tr
                key={item}
                className="border-b last:border-0 dark:border-zinc-800"
              >
                <td className="px-4 py-2">#PAY-{item}01</td>
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2 font-medium">
                  $250.00
                </td>
                <td className="px-4 py-2">Stripe</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                    PayIn
                  </span>
                </td>
                <td className="px-4 py-2">2026-01-06</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Pagination ================= */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Showing 1 to 5 of 25 entries
        </p>

        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-zinc-800">
            Prev
          </button>
          <button className="px-3 py-1 border rounded-md text-sm bg-indigo-500 text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded-md text-sm">
            2
          </button>
          <button className="px-3 py-1 border rounded-md text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};


export default PaymentsTable