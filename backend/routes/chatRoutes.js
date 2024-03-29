const express = require("express");
const router = express.Router();
const {createdMessage, fetchMessages, myContacts,messageDelete} =  require("../controller/MessageController");


router.get("/contacts/:userId",myContacts);
router.post("/messaging",createdMessage);
router.get("/chats/:userId/:requestId",fetchMessages);
router.post("/deletemessage",messageDelete);

module.exports = router; 