const Chat = require("../Models/chatModel");
const userModel = require("../Models/userModel");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("User parems not sent with request.");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user._id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const createGroupChats = async (req, res) => {
  if (!req.body.users && !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields." });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send({
      message: "More then 2 users are required to form a group chat.",
    });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(added);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const remove = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!remove) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(remove);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChats,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
