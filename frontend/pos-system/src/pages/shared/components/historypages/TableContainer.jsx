import React from "react";
import PropTypes from "prop-types";
import TableData from "./TableData.jsx";

const TableContainer = ({ orders }) => {
  return (
    <div
      className="max-h-[60vh] overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#dba799 #f1f1f1",
      }}
    >
      <style>
        {`
          ::-webkit-scrollbar { width: 12px; }
          ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 6px; }
          ::-webkit-scrollbar-thumb { background: #dba799; border-radius: 6px; }
          ::-webkit-scrollbar-thumb:hover { background: #c48a74; }
        `}
      </style>
      <TableData orders={orders} />
    </div>
  );
};

TableContainer.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.shape({
    orderId: PropTypes.number.isRequired,
    customerName: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  })).isRequired,
};

export default TableContainer;
