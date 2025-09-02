import React, { useState } from "react";

const TableData = () => {
    const orders = [
        { id: "01", orderId: "FO/100001", date: "2025-01-01", time: "12:30 PM", status: "Pending" },
        { id: "04", orderId: "FO/100123", date: "2025-01-02", time: "01:00 PM", status: "Pending" },
    ];

    const [expandedOrder, setExpandedOrder] = useState(null);

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className="container mx-auto p-4">

            {/* Table Header */}
            <div className="flex bg-200 mx-5 p-3 rounded-t-lg">
                <div className="w-1/5 text-black">Order ID</div>
                <div className="w-1/5 text-black">Date</div>
                <div className="w-1/5 text-black">Time</div>
                <div className="w-1/5 text-black">Status</div>
                <div className="w-1/5"></div>
            </div>

            {orders.map((order) => (

                <div key={order.id} className="border-1 border-[#432634] rounded-lg mb-8">
                    {/* Main Order Row */}
                    <div className="flex items-center p-3  backdrop-blur rounded-lg">
                        <div className="w-1/5 text-[#432634]">{order.orderId}</div>
                        <div className="w-1/5 text-[#432634]">{order.date}</div>
                        <div className="w-1/5 text-[#432634]">{order.time}</div>
                        <div className="w-1/5 text-[#432634]">{order.status}</div>
                        <div className="w-1/5">
                            <button
                                className="px-1 py-2 text-base text-[#432634] bg-500 border-1 border-[#432634] rounded-full"
                                onClick={() => toggleExpand(order.id)}
                                style={{ minWidth: "120px" }}
                            >
                                {expandedOrder === order.id ? "Less" : "See More"}
                            </button>
                        </div>
                    </div>

                    {/* Expanded Section */}
                    {expandedOrder === order.id && (
                        <div className="p-4 border-t-1 border-[#432634]">
                            <div className="p-4 rounded-lg text-center bg-transparent">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-base font-medium text-[#432634] mb-1">No Data Available</h3>
                                        <p className="text-sm text-[#432634]/70">There is no additional data to display for this order.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TableData;