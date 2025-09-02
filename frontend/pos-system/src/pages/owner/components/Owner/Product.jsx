import React, { useEffect, useState } from "react";
// import { getAllProducts } from "../../api/product-service/productController"; // Commented for development
import CardContainer from "../../../shared/components/cardContainer/CardContainer";
import LoadingWheel from "../../../shared/components/loadingWheel/LoadingWheel";
import ItemDisplayCard from "../../../shared/components/itemDisplayCard/ItemDisplayCard";
import UpdateItem from "../../../shared/components/UpdateItem/UpdateItem";

function Product() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  
  // States for UpdateItem popup
  const [selectedItem, setSelectedItem] = useState(null); // Store selected item for update
  const [showUpdatePopup, setShowUpdatePopup] = useState(false); // Show/hide popup

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Commented out for development - bypass API calls
        // const data = await getAllProducts();
        
        // Mock data for development
        const mockData = [
          { productId: 1, productName: "Chocolate Cake", price: 25.99, productStatus: true },
          { productId: 2, productName: "Vanilla Cupcake", price: 3.99, productStatus: true },
          { productId: 3, productName: "Strawberry Donut", price: 2.99, productStatus: false },
        ];
        
        setItems(mockData);
        setFilteredItems(mockData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === "Active") {
      setFilteredItems(items.filter((item) => item.productStatus === true));
    } else if (selectedFilter === "Inactive") {
      setFilteredItems(items.filter((item) => item.productStatus === false));
    } else {
      setFilteredItems(items);
    }
  };

    // Handle item click to open the update popup
    const handleItemClick = (item) => {
     setSelectedItem(item);  // Store selected item for update
     setShowUpdatePopup(true);  // Show the UpdateItem popup
   };

  // Close the UpdateItem popup
  const handleClosePopup = () => {
    setShowUpdatePopup(false);
    setSelectedItem(null); // Clear the selected item
  };

  return (
    <div className="flex flex-col items-center my-2 w-full">
      <div className="flex justify-between w-full px-10 my-4">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-100 cursor-pointer"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="text-3xl font-semibold text-pink-600">
          Total Products: {filteredItems.length}
        </div>
      </div>

      <CardContainer h="77vh">
        {loading ? (
          <div className="text-center text-gray-600 py-5 text-lg">
            <LoadingWheel />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
                <p className="text-gray-500">There are no products available for the selected criteria.</p>
              </div>
            </div>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <ItemDisplayCard
              key={index}
              item={item}
              // 
              onClick={() => handleItemClick(item)}  // Open popup on item click
              type="owner"
            />
          ))
        )}
      </CardContainer>

        {/* Conditionally render the UpdateItem popup */}
        {showUpdatePopup && <UpdateItem item={selectedItem} onClose={handleClosePopup} />}


    </div>
  );
}

export default Product;
