import React, { useState, useEffect } from "react";
import axios from "axios";
import { server, AuthContext } from "../../context/UserContext";
import SendIcon from "@mui/icons-material/Send";
import DoneIcon from "@mui/icons-material/Done";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddReactionIcon from "@mui/icons-material/AddReaction";

export const ChatTextInput = ({
  messageInput,
  setMessageInput,
  myId,
  selectedChat,
  socket,
  setChats,
  chats,
  setMessages,
  messages,
}) => {
  const [offlineMessages, setOfflineMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem("offlineMessages");
    if (storedMessages) {
      setOfflineMessages(JSON.parse(storedMessages));
    }
  }, []);

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      setSending(true);

      const response = await axios.post(`${server}/sendChatMessage`, {
        myId,
        chatId: selectedChat._id,
        messageInput,
      });

      socket.emit("new message", {
        newMessage: response.data.newMessage,
        chatUsers: response.data.chatUsers,
      });

      const updatedChats = chats.map((chat) => {
        if (chat._id === selectedChat._id) {
          return { ...chat, latestMessage: messageInput };
        }
        return chat;
      });

      setChats(updatedChats);
      setMessageInput("");
      setMessages([...messages, response.data.newMessage]);

      setSending(false);
      // Clear offline messages after sending
      setOfflineMessages([]);
      localStorage.removeItem("offlineMessages");
    } catch (error) {
      console.error("Error sending message:", error);
      const newOfflineMessage = {
        chatId: selectedChat._id,
        messageInput,
      };
      setOfflineMessages([...offlineMessages, newOfflineMessage]);
      localStorage.setItem(
        "offlineMessages",
        JSON.stringify([...offlineMessages, newOfflineMessage])
      );
    }
  };

  return (
    <>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 900,
        }}
      >
        <IconButton sx={{ p: "10px" }} aria-label="menu">
          <AddReactionIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Type a message"
          value={messageInput}
          onChange={handleMessageInputChange}
          inputProps={{ "aria-label": "Type a message" }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="SendIcon"
          onClick={handleSendMessage}
        >
          {sending ? <SendIcon /> : <DoneIcon />}
        </IconButton>
      </Paper>
      {/* Display offline messages */}
      {offlineMessages.map((offlineMessage, index) => (
        <div key={index}>{offlineMessage.messageInput}</div>
      ))}
    </>
  );
};
