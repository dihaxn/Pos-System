import React, { useEffect, useState } from 'react';
// Temporarily disabled WebSocket functionality to fix import issues
// import Stomp from 'stompjs';
import config from "../../config/environment.js";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Temporarily disabled WebSocket functionality to fix import issues
  // useEffect(() => {
  //   let stompClient = null;
  //   
  //   try {
  //     // Connect to the WebSocket for real-time notifications
  //     const socket = new SockJS(config.WS_URL);
  //     stompClient = Stomp.over(socket);

  //     stompClient.connect({}, (frame) => {
  //     setConnectionStatus('connected');
  //     stompClient.subscribe('/topic/notifications', (notification) => {
  //       try {
  //       const newNotification = JSON.parse(notification.body);
  //       setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  //       } catch (error) {
  //       console.warn('Failed to parse notification:', error);
  //       }
  //       });
  //     }, (error) => {
  //       console.warn('WebSocket connection failed:', error);
  //       setConnectionStatus('failed');
  //       });
  //     } catch (error) {
  //       console.warn('Failed to initialize WebSocket:', error);
  //       setConnectionStatus('failed');
  //       });
  //     }

  //     // Clean up the WebSocket connection when the component unmounts
  //     return () => {
  //       if (stompClient && stompClient.connected) {
  //       try {
  //       stompClient.disconnect();
  //       } catch (error) {
  //       console.warn('Error disconnecting WebSocket:', error);
  //       }
  //       }
  //       };
  //     }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <div style={{ color: 'blue', fontSize: '0.9em', marginBottom: '10px' }}>
        WebSocket functionality temporarily disabled for development
      </div>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <strong>User {notification.userId}:</strong> {notification.message} <br />
            <small>{new Date(notification.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
