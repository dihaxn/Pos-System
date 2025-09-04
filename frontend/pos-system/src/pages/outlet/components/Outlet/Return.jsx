import React, { useContext } from "react";
import CardContainer from "../../../shared/components/cardContainer/CardContainer";
import OrderTable from "../../components/PosTable/OrderTable";
import ItemCard from "../../../../shared/components/ItemCard/ItemCard";
import ActionContainer from "../../../shared/components/ActionContainer/ActionContainer";
import OrderAction from "../../../shared/components/OrderAction/OrderAction";
import ReturnAction from "../../components/ReturnAction/ReturnAction";
import Image from "../../../../assets/2254.jpg_wh860.jpg";
import { useState, useEffect } from "react";
import { getAllProductsByOutletId } from "../../../shared/services/productController";
import LoadingWheel from "../../../shared/components/loadingWheel/LoadingWheel";
// import AuthContext from "../../context/AuthContext"; // Commented for development

function Return() {
  const [orderItems, setOrderItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // // const { outletId } = useContext(AuthContext); // Commented for development // Commented for development

  // Default outletId for development
  const outletId = 1; // Default outlet ID for development

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllProductsByOutletId(outletId);
        
        setItems(data || []); // Ensure items is always an array
      } catch (error) {
        console.error("Error fetching products:", error);
        setItems([]); // Set empty array on error
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };
    fetchItems();
  }, []);

  const handleClearOrder = () => {
    setOrderItems([]);
  };

  const handleItemClick = (item) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.id === item.productId
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.id === item.productId
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: item.productId,
          name: item.productName,
          price: item.price,
          stock: item.stockQuantity,
          //discount: 0,
        
        },
      ]);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center my-2">
        <CardContainer>
          {loading ? (
            <div className="text-center text-gray-600 py-5 text-lg">
              <LoadingWheel />
            </div>
          ) : (
            items && items.length > 0 ? (
              items.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available for Return</h3>
                    <p className="text-gray-500">There are no products available for return at this outlet at the moment.</p>
                  </div>
                </div>
              </div>
            )
          )}
        </CardContainer>
      </div>
      <div className="flex">
        <OrderTable
          tType="return"
          products={orderItems}
          setProducts={setOrderItems}
        />
        <ActionContainer>
          <ReturnAction onClear={handleClearOrder} products={orderItems}/>
        </ActionContainer>
      </div>
    </div>
  );
}

export default Return;
