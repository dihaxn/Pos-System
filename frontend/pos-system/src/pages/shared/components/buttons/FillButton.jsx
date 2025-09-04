import React from "react";
import PropTypes from "prop-types";

function FillButton({children,onClick,disabled=false}) {
  return (
    <button 
      className={`transition-transform transform hover:scale-108 hover:shadow-lg cursor-pointer bg-pink-500 text-white p-3 w-36 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none': ''}`}
      onClick={onClick}  
      disabled={disabled}
    >
        {children}
    </button>
  );
}

FillButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default FillButton;
