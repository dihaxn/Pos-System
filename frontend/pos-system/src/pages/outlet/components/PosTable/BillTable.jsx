import PropTypes from "prop-types";
import BillDataRow from "./BillDataRow";

function BillTable({ products }) {
  // Calculate subtotal
  const subTotal = products.reduce(
    (sum, product) =>
      sum +
      product.price * product.quantity -
      product.discount * product.quantity,
    0
  );

  // Calculate total discount
  const totalDiscount = products.reduce(
    (sum, product) => sum + product.discount * product.quantity,
    0
  );

  return (
    <div className="mx-13">
      <div className="m-5 w-full mx-auto overflow-auto border border-gray-50 rounded-lg max-h-[450px]">
        <table className="w-full border-collapse text-center">
          <thead className="bg-gray-50 sticky top-0 text-gray-700">
            <tr>
              <th className="p-3 border-b">#</th>
              <th className="p-3 border-b">Product ID</th>
              <th className="p-3 border-b">Product Name</th>
              <th className="p-3 border-b">Unit Price</th>
              <th className="p-3 border-b">Quantity</th>
              <th className="p-3 border-b">Discount per Unit</th>
              <th className="p-3 border-b">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <BillDataRow key={index} product={product} index={index} />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
                      <p className="text-gray-500">There are no items in the current bill.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end px-16">
        <div className="text-right">
          <p className="text-lg">
            Total Discount:{" "}
            <span className="text-red-600">- {totalDiscount.toFixed(2)}</span>
          </p>
          <p className="text-lg mt-2 border-b-4 border-double border-gray-900 pb-2">
            Sub Total:{" "}
            <span className="text-green-600">{subTotal.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

BillTable.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
  })).isRequired,
};

export default BillTable;
