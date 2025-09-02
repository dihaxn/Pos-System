import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import LoadingWheel from "../../../shared/components/loadingWheel/LoadingWheel";
import LoadingPopup from "../../../shared/components/Popup/LoadingPopup/LoadingPopup";
import config from "../../../../config/environment.js";

const ReturnArrivalTable = () => {
  const [returns, setReturns] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReturns = async () => {
    setIsLoading(true); // Start loading when fetching data
    try {
      const response = await axios.get(
        `${config.RETURN_API_URL}${config.ENDPOINTS.RETURN.ALL_BY_STATUS}`,
        {
          params: {
            status: "Pending", // Pass status as "Pending"
          },
        }
      );

      const data = response.data.data;

      const formatted = data.map((r) => {
        const dateObj = new Date(r.returnDate);
        const date = dateObj.toLocaleDateString("en-GB");
        const time = dateObj.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          returnId: r.returnId,
          outletName: r.outletName,
          date,
          time,
          returnItems: r.returnItems.map((item) => ({
            productId: item.productId,
            productName: item.productName, // Replace with actual name if available
            quantity: item.quantity,
            unitPrice: item.unitPrice, // Replace with real unit price if available
            returnReason: item.reason,
          })),
        };
      });

      setReturns(formatted);
    } catch (error) {
      console.error("Failed to fetch return data", error);
      Swal.fire("Error", "Failed to fetch return data", "error");
    } finally {
      setIsLoading(false); // End loading when data is fetched
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const toggleDrawer = (returnId) => {
    if (openDrawer === returnId) {
      setOpenDrawer(null);
    } else {
      setOpenDrawer(returnId);
    }
  };

  const handleStatusChange = async (newStatus, returnId) => {
    const result = await Swal.fire({
      title: `Are you sure to mark as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus.toLowerCase()} it!`,
      cancelButtonText: "Cancel",
      confirmButtonColor: newStatus === "Approved" ? "#16a34a" : "#dc2626",
    });

    if (result.isConfirmed) {
      setOrderLoading(true);

      try {
        // Call the updateReturnStatus API
        const response = await axios.put(
          `${config.RETURN_API_URL}${config.ENDPOINTS.RETURN.UPDATE_STATUS}`,
          null,
          {
            params: {
              returnId: returnId,
              status: newStatus,
            },
          }
        );

        if (response.data.code === 200) {
          Swal.fire("Success!", `Return marked as ${newStatus}.`, "success");
          // Refresh the returns list after saving the status
          fetchReturns();
        } else {
          Swal.fire("Error", "Failed to update return status", "error");
        }
      } catch (error) {
        console.error("Failed to update return status", error);
        Swal.fire("Error", "Failed to update return status", "error");
      } finally {
        setOrderLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-3xl my-5 max-h-[600px]">
      {isLoading ? (
        <LoadingWheel />
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">#</th>
                  <th className="py-3 px-6 text-left">Return ID</th>
                  <th className="py-3 px-6 text-left">Outlet</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Time</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                  <th className="py-3 px-6 text-left"></th>
                </tr>
              </thead>
              {returns.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Returns Found</h3>
                          <p className="text-gray-500">There are no return requests available for processing.</p>
                          <p className="text-sm text-gray-400 mt-1">Returns will appear here when outlets submit them.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="text-gray-600 text-sm font-light">
                {returns.map((r, index) => {
                  const isDrawerOpen = openDrawer === r.returnId;

                  return (
                    <React.Fragment key={r.returnId}>
                      <tr
                        className={`border-b border-gray-200 hover:bg-gray-100 ${
                          isDrawerOpen ? "bg-pink-50 rounded-t-3xl" : ""
                        }`}
                      >
                        <td className="py-3 px-6">{index + 1}</td>
                        <td className="py-3 px-6">RA/{r.returnId}</td>
                        <td className="py-3 px-6">{r.outletName}</td>
                        <td className="py-3 px-6">{r.date}</td>
                        <td className="py-3 px-6">{r.time}</td>
                        <td className="py-3 px-6 flex space-x-2">
                          <button
                            onClick={() =>
                              handleStatusChange("Approved", r.returnId)
                            }
                            className="w-24 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange("Rejected", r.returnId)
                            }
                            className="w-24 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                          >
                            Reject
                          </button>
                        </td>

                        <td className="py-3 px-6">
                          <button
                            className="bg-pink-500 text-white py-1 px-3 rounded hover:bg-pink-600 transition duration-300"
                            onClick={() => toggleDrawer(r.returnId)}
                          >
                            {isDrawerOpen ? "Hide" : "See More"}
                          </button>
                        </td>
                      </tr>

                      {isDrawerOpen && (
                        <tr>
                          <td
                            colSpan="7"
                            className="bg-pink-50 p-4 rounded-b-3xl"
                          >
                            <div className="w-full transition-all duration-300 ease-in-out">
                              {loadingItems ? (
                                <LoadingWheel />
                              ) : (
                                <>
                                  <h3 className="text-xl font-semibold mb-3">
                                    Return Items
                                  </h3>
                                  <table className="min-w-full bg-white shadow-md rounded-lg">
                                    <thead>
                                      <tr className="text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">
                                          #
                                        </th>
                                        <th className="py-3 px-6 text-left">
                                          Product Name
                                        </th>
                                        <th className="py-3 px-6 text-left">
                                          Quantity
                                        </th>
                                        <th className="py-3 px-6 text-left">
                                          Unit Price
                                        </th>
                                        <th className="py-3 px-6 text-left">
                                          Return Reason
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm font-light">
                                      {r.returnItems && r.returnItems.length > 0 ? r.returnItems.map((item, idx) => (
                                        <tr key={item.productId}>
                                          <td className="py-3 px-6">
                                            {idx + 1}
                                          </td>
                                          <td className="py-3 px-6">
                                            {item.productName}
                                          </td>
                                          <td className="py-3 px-6">
                                            {item.quantity}
                                          </td>
                                          <td className="py-3 px-6">
                                            Rs{item.unitPrice}
                                          </td>
                                          <td className="py-3 px-6">
                                            {item.returnReason}
                                          </td>
                                        </tr>
                                      )) : (
                                        <tr>
                                          <td colSpan="5" className="py-6 text-center text-gray-500">
                                            No return items found
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </>
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
      )}
      {orderLoading && <LoadingPopup txt="Processing Return..." />}
    </div>
  );
};

export default ReturnArrivalTable;
