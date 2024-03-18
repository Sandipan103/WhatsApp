const User = require("../models/UserModel");
const Message = require("../models/MessageModel");
const Msg=require("../models/MsgModel");
const Chat=require("../models/chatModel");

exports.createdMessage = async (req, res, next) => {
  try {
    const { myId, requestId, messageInput} = req.body;
    const response = await Message.create({
      sender: myId,
      recipient: requestId,
      content: messageInput,
    });
    return res.json("Successfully added");
  } catch (error) {
    return res.json(error);
  }
};

exports.fetchMessages = async (req, res, next) => {
  try {
    const {userId, requestId} = req.params;
    const messages = await Message.find({
        $or: [
            { sender: userId, recipient: requestId },
            { sender: requestId, recipient: userId },
        ],
    })
    .sort({ timestamp: "asc" }) 
    .exec()
    return res.json(messages);
  } catch (error) {
    return res.json(error);
  }
};

exports.myContacts = async (req, res, next) => {
  try {
    const {userId} = req.params;
    const user = await User.findById(userId);
    return res.json({contacts : user.contacts});
  } catch (error) {
    return res.json(error);
  }
};

exports.fetchChats = async (req, res, next) => {
  try {
    const {chatId} = req.params;
    const chat = await Chat.findById(chatId);
    return res.json({isTimerEnabled : chat.isTimerEnabled,timer:chat.timer});
  } catch (error) {
    return res.json(error);
  }
};

exports.setTimer= async (req, res) => {
  const { chatId } = req.params;
  const { isTimerEnabled,timer } = req.body;
  // console.log("chatId: ", chatId);
  // console.log("isTimerEnabled and timer: ", isTimerEnabled ,timer);
  try {
    const chat = await Chat.findByIdAndUpdate(chatId, { isTimerEnabled,timer }, { new: true });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error('Error updating chat:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.messageDelete=async (req, res,next) => {
  try {
    const {messageId , userId} = req.body;
    console.log("messageId : ", messageId);
    console.log("userId : ", userId);

    const message = await Msg.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found or you do not have permission to edit it.' });
    }

    const currentTime = new Date();
    const messageTime = new Date(message.timestamp);
    const timeDifference = (currentTime - messageTime); // Difference in milliseconds

    // Check if the time difference is less than 8 hours (8 hours = 28800000 milliseconds)
    if (timeDifference > 28800000) {
      return res.status(403).json({ message: 'Cannot edit messages sent more than 8 hours ago.' });
    }

    message.content = "message deleted";
    message.isDeleted=true;
    await message.save();

    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    console.error(error);
    console.log("error in deleting : ", error);
    res.status(500).json({ error: 'An error occurred while editing the message.' });
  }
};

