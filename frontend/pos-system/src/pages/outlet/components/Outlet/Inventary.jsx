import React, { useContext } from "react";
import InventoryTable from "../../components/PosTable/InventoryTable";
// import AuthContext from "../../context/AuthContext"; // Commented for development

function Inventary() {
  // // const { outletId } = useContext(AuthContext); // Commented for development // Commented for development

  // Default outletId for development
  const outletId = 1; // Default outlet ID for development

  return (
    <div>
      <InventoryTable outletId={outletId} type="outlet" />
    </div>
  );
}

export default Inventary;
