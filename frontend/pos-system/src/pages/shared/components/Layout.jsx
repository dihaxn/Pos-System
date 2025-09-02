import Sidebar from "./Sidebar";
// import { useContext } from "react";
// import AuthContext from "../context/AuthContext";
import React, { useEffect, useState } from 'react';
// Temporarily disable WebSocket functionality to fix import issues
// import Stomp from 'stompjs';
import { toast, Toaster } from 'react-hot-toast';  // Import Toaster here
import config from "../../../config/environment";


const Layout = ({ children , navItemList=[], user="Mathara Outlet"}) => {

  // Temporarily disabled WebSocket functionality to fix import issues
  // useEffect(() => {
  //   let stompClient = null;
  //   
  //   // Only try to connect if SockJS is available
  //   if (!SockJS) {
  //     console.warn('SockJS not available, skipping WebSocket connection');
  //     return;
  //   }
  //   
  //   try {
  //     // Connect to the WebSocket for real-time notifications
  //     const socket = new SockJS(config.WS_URL);
  //     stompClient = Stomp.over(socket);

  //     stompClient.connect({}, (frame) => {
  //       stompClient.subscribe('/topic/notifications', (notification) => {
  //         try {
  //         const newNotification = JSON.parse(notification.body);
  //         
  //         // Show the notification using react-hot-toast
  //         toast.success(`New Notification: ${newNotification.message}`, {
  //           duration: 5000,  // Set how long the toast stays visible
  //           position: 'top-right',
  //         });
  //         } catch (error) {
  //         console.warn('Failed to parse notification:', error);
  //         }
  //       });
  //     }, (error) => {
  //       console.warn('WebSocket connection failed:', error);
  //         });
  //     } catch (error) {
  //       console.warn('Failed to initialize WebSocket:', error);
  //     }

  //     // Clean up the WebSocket connection when the component unmounts
  //     return () => {
  //       if (stompClient && stompClient.connected) {
  //         try {
  //           stompClient.disconnect();
  //         } catch (I
  //         } catch (error) {
  //           console.warn('Error disconnecting WebSocket:', error);
  //         }
  //       }
  //     };
  //   }, []);

  // Commented out for development - bypass authentication
  // const { username,outletId } = useContext(AuthContext);
  
  // console.log("username:", username);
  // console.log("outletId:", outletId);
  const sliderExpandWidth = 90;
  const sliderNotExpandWidth = 16;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Original Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        user={user}
        sliderExpandWidth={sliderExpandWidth} 
        sliderNotExpandWidth={sliderNotExpandWidth} 
        navItemList={navItemList} 
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-1 bg-gray-50 m-0 ${
          isSidebarOpen
            ? `pl-90`
            : `pl-16`
        }`}
      >
        <main className="px-5 py-2 bg-white h-full">{children}</main>
      </div>

      {/* ToastContainer to display notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;
