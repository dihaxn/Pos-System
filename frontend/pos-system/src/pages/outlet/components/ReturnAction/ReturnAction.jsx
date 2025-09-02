import React, { useState, useEffect } from "react";
import FillButton from "../../../shared/components/buttons/FillButton";
import BorderButton from "../../../shared/components/buttons/BorderButton";
import IconNavButton from "../../../shared/components/buttons/IconNavButton";
import ReturnHistoryPopupForOutlet from "../ReturnHistoryPopupForOutlet/ReturnHistoryPopupForOutlet";
import PlaceReturnOrderPopup from "../PlaceReturnOrderPopup/PlaceReturnOrderPopup";
import { useContext } from "react";
// import AuthContext from "../../context/AuthContext"; // Commented for development

function ReturnAction({ onClear, products }) {
  const [showModal, setShowModal] = useState(false);
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [returnEnabled, setReturnEnabled] = useState(false);
  // // const { outletId } = useContext(AuthContext); // Commented for development // Commented for development

  useEffect(() => {
    setReturnEnabled(products.length > 0);
  }, [products]);

  return (
    <div>
      <div className="flex justify-center gap-8 my-10">
        <FillButton
          onClick={() => setShowReturnPopup(true)}
          disabled={!returnEnabled}
        >
          Return
        </FillButton>

        <BorderButton onClick={onClear}>Cancel</BorderButton>
      </div>

      <div>
        <IconNavButton
          icon={"src/assets/icons/historyIcon.svg"}
          onClick={() => setShowModal(true)}
        >
          Return History
        </IconNavButton>

        {showModal && (
          <ReturnHistoryPopupForOutlet onClose={() => setShowModal(false)} />
        )}

        {showReturnPopup && (
          <PlaceReturnOrderPopup
            onClose={() => setShowReturnPopup(false)}
            products={products}
            outletId={outletId} // Pass correct outlet ID here
          />
        )}
      </div>
    </div>
  );
}

export default ReturnAction;
