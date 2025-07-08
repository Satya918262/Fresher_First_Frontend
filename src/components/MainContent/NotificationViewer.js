import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Badge } from "react-bootstrap";
import axios from "axios";

const NotificationViewer = () => {
  const [notifications, setNotifications] = useState([]);
  const role = localStorage.getItem("role");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/notifications`);
        console.log("Fetched notifications:", res.data); // Debug log
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  if (role === "admin") {
    return <h3 className="text-center mt-5">Admins cannot view notifications here</h3>;
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <ListGroup>
          {notifications.map((notification) => (
            <ListGroup.Item key={notification._id} className="mb-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1">{notification.message}</p>
                  {notification.attachment ? (
                    <div>
                      <a
                        href={`${API_BASE_URL}/${notification.attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
                        View Attachment
                      </a>
                      {/* Debug: Show the raw attachment path */}
                      
                    </div>
                  ) : (
                    <small className="text-muted">No attachment</small>
                  )}
                </div>
                <Badge bg="secondary">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default NotificationViewer;