import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, ListGroup } from "react-bootstrap";
import { FaPaperclip, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationSender = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const role = localStorage.getItem("role");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/notifications`);
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  if (role !== "admin") {
    return <h3 className="text-center mt-5">Access Denied: Admin Only</h3>;
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
      setFile(selectedFile);
      toast.info(`File selected: ${selectedFile.name}`);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    const formData = new FormData();
    formData.append("message", message);
    if (file) {
      console.log("Appending file to FormData:", file);
      formData.append("attachments", file);
    } else {
      console.log("No file selected");
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/notifications/send`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response from server:", res.data);
      toast.success("Notification sent successfully!");
      setNotifications((prev) => [res.data.notification, ...prev]);
      setMessage("");
      setFile(null);
    } catch (error) {
      console.error("Error in axios request:", error.response?.data || error.message);
      toast.error("Failed to send notification: " + (error.response?.data?.error || error.message));
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      toast.success("Notification deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete notification: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Header as="h4" className="bg-primary text-white">
          Send Notification
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="notificationMessage" className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your notification message here..."
                disabled={isSending}
              />
            </Form.Group>
            <Row className="align-items-center">
              <Col xs={6} md={2} className="mb-3 mb-md-0">
                <Form.Group controlId="notificationAttachment">
                  <Form.Label className="d-flex align-items-center">
                    <FaPaperclip size={24} className="me-2" />
                    <span>Attach File</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    disabled={isSending}
                    style={{ display: "none" }}
                    accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Allow images, PDFs, Excel
                  />
                </Form.Group>
              </Col>
              <Col xs={6} md={10} className="text-end">
                <Button
                  variant="success"
                  onClick={handleSend}
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </Col>
            </Row>
            {file && (
              <div className="mt-2">
                <small>Selected file: {file.name}</small>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>

      <Container className="mt-4">
        <h5>Sent Notifications</h5>
        {notifications.length === 0 ? (
          <p>No notifications sent yet</p>
        ) : (
          <ListGroup>
            {notifications.map((notification) => (
              <ListGroup.Item key={notification._id} className="mb-2 d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1">{notification.message}</p>
                  {notification.attachment && (
                    <a
                      href={`${API_BASE_URL}/${notification.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      View Attachment
                    </a>
                  )}
                  <small className="text-muted d-block">
                    {new Date(notification.createdAt).toLocaleString()}
                  </small>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(notification._id)}
                >
                  <FaTrash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default NotificationSender;