// model required
const User = require("../models/UserModel");
const Chat = require("../models/chatModel");
const Msg = require("../models/MsgModel");



// dependency required


// add contacts
// exports.addContact = async (req, res) => {
//     try {
//       // step-1 : fetch data from req body
//       const { name, contactNo, userId} = req.body;
  
//       // step-2 : find by contact number
//       const friend = await User.findOne({ contactNo: contactNo });

//       // step-3 : user not found
//       if (!friend) {
//         return res.status(402).json({
//           success: false,
//           message: `contact no is not registered`,
//         });
//       }

//       // step-4 : already friend
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: `User not found with ID ${userId}`,
//         });
//       }

//       const alreadyFriend = user.contacts.some(contact => contact.contactNo === contactNo);
//       if (alreadyFriend) {
//         return res.status(400).json({
//           success: false,
//           message: `This contact is already added in your contacts`,
//         });
//       }

//       // step-5 : add the frind in user contact with name passed in name
//       await User.findByIdAndUpdate(userId, {
//         $push: {
//           contacts: {
//             contactId: friend._id,
//             name: name,
//             contactNo: contactNo,
//           },
//         },
//       });
  
//       // Also add the user to friend's contacts
//       // await User.findByIdAndUpdate(friend._id, {
//       //   $push: {
//       //     contacts: {
//       //       contactId: userId,
//       //       name: user.firstName + " " + user.lastName,
//       //       contactNo: user.contactNo,
//       //     },
//       //   },
//       // });

//       return res.status(200).json({
//         success: true,
//         message: `contact successfully saved`,
//       });

//     } catch (error) {
//       console.log("contact save error : ", error);
//       return res.status(401).json({
//         success: false,
//         message: `contact not saved`,
//       });
//     }
//   };


exports.addContact = async (req, res) => {
  try {
    // step-1 : fetch data from req body
    const { name, contactNo, userId} = req.body;

    // step-2 : find by contact number
    const friend = await User.findOne({ contactNo: contactNo });

    // step-3 : user not found
    if (!friend) {
      return res.status(402).json({
        success: false,
        message: `contact no is not registered`,
      });
    }

    // step-4 : friend already exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID ${userId}`,
      });
    }

    const alreadyFriend = user.contacts.some(contact => contact.contactNo === contactNo);
    if (alreadyFriend) {
      return res.status(400).json({
        success: false,
        message: `This contact is already added in your contacts`,
      });
    }

    // step-5 : save contact
    await User.findByIdAndUpdate(userId, {
      $push: {
        contacts: {
          contactId: friend._id,
          name: name,
          contactNo: contactNo,
        },
      },
    });

    // step-6 : if there is no chat between this two user (except group) then create new chat
    const existingChat = await Chat.findOne({
      users: { $all: [userId, friend._id] },
      isGroupChat: false
    });


    if (!existingChat) {
      // Create new chat if one doesn't exist
      const newChat = await Chat.create({
        isGroupChat : false,
        users : [userId, friend._id],
      });
      console.log("chat created");
    }

    return res.status(200).json({
      success: true,
      message: `contact successfully saved and chat created`,
    });

  } catch (error) {
    console.log("contact save error : ", error);
    return res.status(401).json({
      success: false,
      message: `contact not saved`,
    });
  }
};


// find all the contacts
exports.getAllFriends = async(req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "user not found" 
      });
    }
    res.json({ 
      success: true, 
      contacts : user.contacts,
    });
  } catch (error) {
    console.log("finding frined error : ", error);
      return res.status(401).json({
        success: false,
        message: `friends not found here`,
      });
  }
}


// create a new group
exports.createGroup = async(req, res) => {
  try {
    const {groupName, selectedFriends, admin } = req.body;
    // step-1 : check if group name already exist or not
    const chat = await Chat.findOne({ groupName });
    if(chat)  {
      return res.status(401).json({
        success: false,
        message: `group name already exist`,
      });
    }

    // step-2 : create group
    const response = await Chat.create({
      groupName : groupName,
      isGroupChat : true,
      users : [...selectedFriends, admin],
      groupAdmin : admin,
    });

    return res.status(200).json({
      success: true,
      message: `group successfully created`,
    }); 
    
  } catch (error) {
    console.log("group creating error : ", error);
      return res.status(401).json({
        success: false,
        message: `group not created`,
      });
  }
}

// fetch all groups of the user
exports.findAllChats = async(req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find all groups where the user is a member
    const chats = await Chat.find({ users: userId }).populate('allChatMessages').populate('latestMessage');

    const modifiedChats = chats.map(chat => {
      const latestMessageContent = chat.latestMessage ? chat.latestMessage.content : null;
      const latestMessageTime = chat.latestMessage ? chat.latestMessage.timestamp : null;
      return {
        ...chat.toObject(),
        latestMessage: latestMessageContent,
        latestMessageTime : latestMessageTime,
      };
    });

    res.json({ 
      success: true, 
      chats : modifiedChats,
    });
    
  } catch (error) {
    console.log("Group finding error:", error);
    return res.status(500).json({
      success: false,
      message: `Error finding groups: ${error.message}`,
    });
  }
}

// fetch all messages of this group
exports.fetchAllMessages = async(req, res) => {
  try {
    const chatId = req.params.chatId;
    // console.log(chatId);
    
    // Find all messages where the chat id matches
    const messages = await Msg.find({ chat: chatId });
    // console.log(messages);
    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Message fetching error:", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching messages: ${error.message}`,
    });
  }
}


exports.sendChatMessage = async (req, res) => {
  try {
    const { myId, chatId, messageInput,deleteAt } = req.body;
    if (!myId) {
      return res.status(401).json({
        success: false,
        message: `user not found`,
      });
    }
    if (!chatId) {
      return res.status(401).json({
        success: false,
        message: `chat Id not found`,
      });
    }
    let newMessage = await Msg.create({
      sender: myId,
      content: messageInput,
      chat: chatId,
      readBy: [myId],
      deleteAt:deleteAt,
    });

    // const chat = await Chat.findById(newMessage.chat);
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });
    const chat = await Chat.findByIdAndUpdate(newMessage.chat, { $push: { allChatMessages: newMessage._id } });
    const chatUsers = chat.users;

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      newMessage: newMessage,
      chatUsers : chatUsers, 
    });

  } catch (error) {
    console.log("Message sending error:", error);
    return res.status(500).json({
      success: false,
      message: `Error sending messages: ${error.message}`,
    });
  }
}


exports.readAllMessages = async (req, res) => {
  try {
    const { myId, chatId } = req.body;
    if (!myId) {
      return res.status(401).json({
        success: false,
        message: `user not found`,
      });
    }
    if (!chatId) {
      return res.status(401).json({
        success: false,
        message: `chat Id not found`,
      });
    }
    
    const chat = await Chat.findById(chatId).populate('allChatMessages');
    // here for each Msg in chat.allChatMessages is myId is not present in readBy array of Msg then add the myId in readBY array
    for (const message of chat.allChatMessages) {
      // If myId is not present in readBy array, add it
      if (!message.readBy.includes(myId)) {
        const repp = await Msg.findByIdAndUpdate(message._id, { $push: { readBy: myId } });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'All messages marked as read',
    });

  } catch (error) {
    console.log("all message reading error:", error);
    return res.status(500).json({
      success: false,
      message: `Error in reading messages: ${error.message}`,
    });
  }
}


exports.sendFiles = async (req, res) => {
  try {
    const fileName = req.file.filename;
    
    const { myId, chatId, messageInput, type, } = req.body;

    const updateFields = {};
    if (type === "image") {
        updateFields.imageUrl = fileName;
    } else if (type === "video") {
        updateFields.videoUrl = fileName;
    } else if (type === "audio") {
        updateFields.audioUrl = fileName;
    } else if (type === "document") {
        updateFields.documentUrl = fileName;
    }

    if (!myId) {
      return res.status(401).json({
        success: false,
        message: `user not found`,
      });
    }
    if (!chatId) {
      return res.status(401).json({
        success: false,
        message: `chat Id not found`,
      });
    }
    let newMessage = await Msg.create({
      sender: myId,
      content: messageInput,
      chat: chatId,
      type: type,
      readBy: [myId],
      ...updateFields,
    });
    console.log(newMessage)

    // const chat = await Chat.findById(newMessage.chat);
    const chat = await Chat.findByIdAndUpdate(newMessage.chat, { $push: { allChatMessages: newMessage._id } });
    const chatUsers = chat.users;
    const newMessageWithChat = await Msg.findById(newMessage._id).populate("chat");
    console.log(newMessage)

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      newMessage: newMessageWithChat,
      chatUsers : chatUsers, 
    });

  } catch (error) {
    console.log("Message sending error:", error);
    return res.status(500).json({
      success: false,
      message: `Error sending messages: ${error.message}`,
    });
  }
}

exports.findChatMemberDetails = async(req, res) => {
  try {
    const chatId = req.params.chatId;

    const chat = await Chat.findById(chatId)
      .populate({path: 'users', select: '_id firstName lastName',})
      .populate({path: 'groupAdmin', select: '_id firstName lastName',});

    res.json({
      success: true,
      users : chat.users,
      groupAdmin : chat.groupAdmin,
    });
  } catch (error) {
    console.log("Message fetching error:", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching messages: ${error.message}`,
    });
  }
}


exports.updateChatMember = async(req, res)  => {
  try {
    const {chatId, selectedContacts, myId} = req.body;
    const updatedUsers = [...selectedContacts, myId];
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { users: updatedUsers },
      { new: true }
    );

    res.status(200).json({ 
      success : true,
      message: "Chat members updated successfully", 
      chat: updatedChat 
    });
  } catch (error) {
    console.error("Error updating chat members:", error);
    return res.status(500).json({ 
      success : false,
      message: "Internal server error" 
    });
  }
}