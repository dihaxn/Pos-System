import React, { useState } from "react";
import LoadingWheel from "../loadingWheel/LoadingWheel";
// import BillTable from "../PosTable/BillTable"; // Commented - component doesn't exist
// import { getCusOrderItemsByCusOrId } from "../../api/outlet_service/cusOrderController"; // Commented for development

function CustomerOrderTable({ orders }) {
  const [openDrawer, setOpenDrawer] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const toggleExpand = async (orderId) => {
    if (openDrawer === orderId) {
      setOpenDrawer(null);
      setOrderItems([]);
      return;
    }

    // Show drawer first and display loading state
    setOpenDrawer(orderId);
    setLoadingItems(true);

    try {
      // Commented out for development - bypass API calls
      // const data = await getCusOrderItemsByCusOrId(orderId);
      
      // Mock data for development
      const mockItems = [
        { productId: 1, productName: "Chocolate Cake", unitPrice: 25.99, quantity: 2, discountPerUnit: 0 },
        { productId: 2, productName: "Vanilla Cupcake", unitPrice: 3.99, quantity: 5, discountPerUnit: 0.50 }
      ];
      
      const items = mockItems.map((item) => ({
        id: item.productId,
        name: item.productName,
        price: item.unitPrice,
        quantity: item.quantity,
        discount: item.discountPerUnit,
      }));
      setOrderItems(items);
    } catch (error) {
      console.error("Error fetching order items:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  return (
    <div
      className="bg-gray-100 p-6 rounded-3xl my-5"
      style={{ maxHeight: "600px" }}
    >
      <div className="overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="py-3 px-6 text-left">Outlet Name</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Time</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Customer Name</th>
                <th className="py-3 px-6 text-left">Customer Phone No.</th>
                <th className="py-3 px-6 text-left"></th>
              </tr>
            </thead>
            {orders.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="9" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Customer Orders Found</h3>
                        <p className="text-gray-500">There are no customer orders available for the selected criteria.</p>
                        <p className="text-sm text-gray-400 mt-1">Try changing the outlet, date, or search terms.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="text-gray-600 text-sm font-light">
              {orders.map((order, index) => {
                const isDrawerOpen = openDrawer === order.orderId;
                const bgColor = isDrawerOpen
                  ? "bg-pink-50 rounded-t-3xl"
                  : "bg-gray-50";

                return (
                  <React.Fragment key={order.orderId}>
                    <tr
                      className={`border-b border-gray-200 hover:bg-gray-100 ${bgColor}`}
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        CO/{order.orderId}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {order.outletName}
                      </td>
                      <td className="py-3 px-6 text-left">{order.date}</td>
                      <td className="py-3 px-6 text-left">{order.time}</td>
                      <td className="py-3 px-6 text-left">{order.status}</td>
                      <td className="py-3 px-6 text-left">
                        {order.customerName}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {order.customerPhone}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <button
                          className="bg-pink-500 text-white py-1 px-3 rounded-full shadow-md hover:bg-pink-600 transition duration-300"
                          onClick={() => toggleExpand(order.orderId)}
                        >
                          {isDrawerOpen ? "Hide" : "See More"}
                        </button>
                      </td>
                    </tr>
                    {isDrawerOpen && (
                      <tr>
                        <td
                          colSpan="9"
                          className="bg-pink-50 p-4 rounded-b-3xl border-gray-200"
                        >
                          <div className="w-[70vw] transition-all duration-300 ease-in-out">
                            {loadingItems ? (
                              <LoadingWheel />
                            ) : (
                              // <BillTable products={orderItems} /> // Commented - component doesn't exist
                              <div>BillTable component not available</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerOrderTable;
