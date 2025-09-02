import React, { useContext, useEffect, useState } from "react";
import CardContainer from "../../../shared/components/cardContainer/CardContainer";
import OrderTable from "../../components/PosTable/OrderTable";
import DisplayTotal from "../../../shared/components/DisplayTotal/DisplayTotal";
import ItemCard from "../../../shared/components/itemCard/ItemCard";
import ActionContainer from "../../../shared/components/ActionContainer/ActionContainer";
import { getAllProductsByOutletId } from "../../../shared/services/productController";
import LoadingWheel from "../../../shared/components/loadingWheel/LoadingWheel";
import LoadingPopup from "../../../shared/components/Popup/LoadingPopup/LoadingPopup.jsx";
import { saveCusOrder } from "../../services/outlet_service/cusOrderController";
import Allert from "../../../shared/components/Allert/Allert";
// import AuthContext from "../../context/AuthContext"; // Commented for development
import { updateProductStock } from "../../../shared/services/stockController";

function Pos() {
  const [orderItems, setOrderItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  // // const { outletId } = useContext(AuthContext); // Commented for development // Commented for development

  // Default outletId for development
  const outletId = 1; // Default outlet ID for development

  const fetchItems = async () => {
    try {
      const data = await getAllProductsByOutletId(outletId);
      setItems(data || []); // Ensure items is always an array
    } catch (error) {
      console.error("Error fetching products:", error);
      setItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          quantity: 1,
          discount: 0,
        },
      ]);
    }
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalDiscount = orderItems.reduce(
      (sum, item) => sum + (item.discount || 0),
      0
    );
    return {
      subtotal,
      discount: totalDiscount,
      total: subtotal - totalDiscount,
    };
  };

  const handleSubmit = async (cusName, cusPho) => {
    const itemList = orderItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      discountPerUnit: item.discount,
    }));

    const orderRequest = {
      orderDate: new Date().toISOString(),
      status: "Confirmed",
      outletId: outletId,
      customerName: cusName,
      customerPhone: cusPho,
      items: itemList,
    };

    try {
      setOrderLoading(true);
      await saveCusOrder(orderRequest);
      Allert({ message: "Order placed successfully", type: "success" });

      const updateDto = {
        outletId: outletId,
        productList: itemList.map((item) => ({
          productId: item.productId,
          stockQuantity: item.quantity,
        })),
        increase: false,
      };

      await updateProductStock(updateDto);
    } catch (error) {
      console.error("Error placing order:", error);
      Allert({ message: "Your order could not be placed", type: "error" });
    } finally {
      setOrderLoading(false);
      handleClearOrder();
      fetchItems(); // 🔄 Refetch items to refresh stock
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
                    <p className="text-gray-500">There are no products available for this outlet at the moment.</p>
                  </div>
                </div>
              </div>
            )
          )}
        </CardContainer>
      </div>
      <div className="flex">
        <OrderTable
          tType="pos"
          products={orderItems}
          setProducts={setOrderItems}
        />
        <ActionContainer>
          <DisplayTotal
            totals={calculateTotals()}
            onClear={handleClearOrder}
            onSubmit={handleSubmit}
          />
        </ActionContainer>
      </div>
      {orderLoading && <LoadingPopup />}
    </div>
  );
}

export default Pos;
