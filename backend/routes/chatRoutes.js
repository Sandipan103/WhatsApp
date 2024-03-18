const express = require("express");
const router = express.Router();
const {createdMessage, fetchMessages, myContacts,messageDelete, setTimer,fetchChats} =  require("../controller/MessageController");


router.get("/contacts/:userId",myContacts);
router.post("/messaging",createdMessage);
router.get("/chats/:userId/:requestId",fetchMessages);
router.get("/chats/:chatId",fetchChats);
router.post("/deletemessage",messageDelete);
router.post("/settimer/:chatId",setTimer);

module.exports = router; 