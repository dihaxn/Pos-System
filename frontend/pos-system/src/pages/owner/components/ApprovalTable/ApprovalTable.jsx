import React from "react";

function ApprovalTable({ rows, onApprove, onReject }) {
  return (
    <div className="w-full mx-auto overflow-auto border border-gray-300 rounded-lg shadow-lg">
      <table className="w-full border-collapse text-center">
        <thead className="bg-gray-200 sticky top-0 text-gray-700">
          <tr>
            <th className="p-3 border-b">Date</th>
            <th className="p-3 border-b">Time</th>
            <th className="p-3 border-b">Description</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
                    <p className="text-gray-500">There are no approval records available at the moment.</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{item.date}</td>
                <td className="p-3">{item.time}</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                    onClick={() => onApprove(item.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={() => onReject(item.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ApprovalTable;
