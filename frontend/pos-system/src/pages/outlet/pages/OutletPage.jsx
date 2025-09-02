import React from "react";
import Layout from "../../shared/components/Layout";
import SearchBar from "../../shared/components/SearchBar";
import NotificationButton from "../../shared/components/buttons/NotificationButton";
import { useState } from "react";
import Pos from "../components/Outlet/Pos";
import Order from "../components/Outlet/Order";
import Inventary from "../components/Outlet/Inventary";
import Return from "../components/Outlet/Return";


export default function OutletPage() {
  const categories = ["All","Cake", "Shorteas", "Biscuits", "Chocolates"];
  const [activeTab, setActiveTab] = useState("pos"); // Default tab
  const [searchText, setSearchText] = useState("");

  const navItemList = [
    {
      nameBtn: "POS",
      fun: () => {
        setActiveTab("pos");
      },
      iconUrl: "src/assets/icons/posIcon.svg",
      isActive : activeTab === "pos"
    },
    {
      nameBtn: "ORDER",
      fun: () => {
        setActiveTab("order");
      },
      iconUrl: "src/assets/icons/orderIcon.svg",
      isActive : activeTab === "order"
    },
    {
      nameBtn: "INVENTARY",
      fun: () => {
        setActiveTab("inventary");
      },
      iconUrl: "src/assets/icons/inventaryIcon.svg",
      isActive : activeTab === "inventary"
    },
    {
      nameBtn: "RETURN",
      fun: () => {
        setActiveTab("return");
      },
      iconUrl: "src/assets/icons/returnIcon.svg",
      isActive : activeTab === "return"
    },
  ];

  return (
    <div>
      <Layout navItemList={navItemList}>
        <div className="flex">
          <SearchBar categoryList={categories} dropdown={false} onSearchChange={setSearchText}/>
          <NotificationButton />
        </div>

        {activeTab === "pos" && <Pos/>}
        {activeTab === "order" && <Order/>}
        {activeTab === "inventary" && <Inventary/>}
        {activeTab === "return" && <Return/>}
      </Layout>
    </div>
  );
}


