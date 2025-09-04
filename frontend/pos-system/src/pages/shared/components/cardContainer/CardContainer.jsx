import React from "react";
import PropTypes from "prop-types";

function CardContainer({ children, h = "58vh" }) {
  return (
    <div
      className="w-full bg-white border-[2px] border-gray-200 shadow-lg rounded-lg overflow-auto px-6 py-6 
      grid gap-6 mx-4 mb-1"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Ensures dynamic column resizing
        maxHeight: h, // Corrected maxHeight
      }}
    >
      {children}
    </div>
  );
}

CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  h: PropTypes.string,
};

export default CardContainer;
