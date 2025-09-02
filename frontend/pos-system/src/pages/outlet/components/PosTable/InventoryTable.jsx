import React, { useState, useEffect } from "react";
import InventoryDataRow from "./InventoryDataRow";
import { getAllProductsByOutletId } from "../../../shared/services/productController";
import { getAllOutlets } from "../../services/outlet_service/outletController";
import LoadingWheel from "../../../shared/components/loadingWheel/LoadingWheel";

function InventoryTable({ type, outletId: propOutletId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [outlets, setOutlets] = useState([]);
  const [outletId, setOutletId] = useState(propOutletId || null);

  // Fetch outlets (only when not outlet type)
  useEffect(() => {
    console.log("Outlets useEffect - type:", type, "propOutletId:", propOutletId);
    
    if (type === "outlet" && propOutletId) {
      // If it's outlet type and we have a prop outletId, use it directly
      console.log("Setting outletId from prop:", propOutletId);
      setOutletId(propOutletId);
      return;
    }
    
    const fetchOutlets = async () => {
      try {
        const outletData = await getAllOutlets();
        setOutlets(outletData);
        if (outletData.length > 0) {
          setOutletId(outletData[0].outletId); // set default outlet
        }
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };
    fetchOutlets();
  }, [type, propOutletId]);

  // Fetch inventory items based on outletId
  useEffect(() => {
    const fetchItems = async () => {
      if (!outletId) {
        console.log("No outletId available, skipping fetch");
        return;
      }
      console.log("Fetching items for outletId:", outletId);
      setLoading(true);
      try {
        const data = await getAllProductsByOutletId(outletId);
        console.log("Fetched data:", data);
        setItems(data || []); // Ensure items is always an array
      } catch (error) {
        console.error("Error fetching products:", error);
        setItems([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [outletId]);

  return (
    <div className="mx-13">
      {/* Filter & Total Products Section */}
      <div className="flex justify-between items-center my-6">
        {type !== "outlet" && (
          <select
            value={outletId || ""}
            onChange={(e) => setOutletId(parseInt(e.target.value))}
            className="py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-100 cursor-pointer"
          >
            {outlets.map((outlet) => (
              <option key={outlet.outletId} value={outlet.outletId}>
                {outlet.outletName}
              </option>
            ))}
          </select>
        )}
        <div className="text-lg font-semibold">
          {loading
            ? "Total Products: Calculating..."
            : `Total Products: ${items.length}`}
        </div>
      </div>

      {/* Table Container */}
      <div
        className="m-5 w-full mx-auto overflow-auto border border-gray-300 rounded-lg shadow-lg h-full"
        style={{ maxHeight: "600px" }}
      >
        {loading ? (
          <div className="text-center text-gray-600 py-5 text-lg">
            <LoadingWheel />
          </div>
        ) : (
          <table className="w-full border-collapse text-center">
            <thead className="bg-gray-200 sticky top-0 text-gray-700">
              <tr>
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b"></th>
                <th className="p-3 border-b">Product ID</th>
                <th className="p-3 border-b">Product Name</th>
                <th className="p-3 border-b">Category</th>
                <th className="p-3 border-b">Unit Price</th>
                <th className="p-3 border-b">Stock</th>
              </tr>
            </thead>
            {items.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
                        <p className="text-gray-500">There are no products available in the inventory at the moment.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="h-full">
                {items.map((item, index) => (
                  <InventoryDataRow key={item.id} item={item} index={index} />
                ))}
              </tbody>
            )}
          </table>
        )}
      </div>
    </div>
  );
}

export default InventoryTable;
