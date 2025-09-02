import { useState } from "react";
import DataRow from "./DataRow"; // Import the DataRow component

const OrderTable = ({ tType = "pos", products, setProducts }) => {
  const handleQuantityChange = (index, newQuantity) => {
    console,console.log(products);
    const updatedProducts = [...products];
    updatedProducts[index].quantity = newQuantity;
    setProducts(updatedProducts);
  };

  const handleDelete = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleDiscountChange = (index, newDiscount) => {
    const updatedProducts = [...products];
    updatedProducts[index].discount = newDiscount;
    setProducts(updatedProducts);
  };

  return (
    <div className="overflow-hidden px-4 w-full h-[250px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="overflow-x-auto max-h-[300px] relative">
        <table className="w-full border border-gray-300 shadow-md rounded-lg">
          <thead className="sticky top-0 bg-gray-200 text-left z-20">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Product ID</th>
              <th className="p-2">Product Name</th>
              <th className="p-2">Unit Price</th>
              {tType !== "return" && <th className="p-2">Quantity</th>}
              {tType === "return" && <th className="p-2">Stock</th>}
              
              {tType === "return" && <th className="p-2"><pre>        Return</pre></th>}
              {tType === "pos" && <th className="p-2">Discount</th>}
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          {products.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={tType === "return" ? 7 : 7} className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h3 className="text-base font-medium text-gray-900 mb-1">No Products Available</h3>
                      <p className="text-sm text-gray-500">Add some products to get started.</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {products.map((product, index) => (
                <DataRow
                  key={product.id}
                  product={product}
                  index={index}
                  handleQuantityChange={handleQuantityChange}
                  handleDelete={handleDelete}
                  handleDiscountChange={handleDiscountChange}
                  type={tType}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
