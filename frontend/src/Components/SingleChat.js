import React, { useEffect, useState } from "react";
import { ChatState } from "./Context/Context";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./Authentication/Miscellinious/Modal/ProfileModal";
import UpdateGroupChatModal from "./Authentication/Miscellinious/Modal/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  // Typing funtionality States.
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          `http://localhost:5000/api/message`,
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured.",
          description: "Failed to send the message.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing indicatuor logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async (e) => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured.",
        description: "Failed to load the messages.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Give notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            style={{
              display: "flex",
            }}
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user?.user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user?.user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            style={{
              display: "flex",
            }}
            flexDir={"column"}
            justifyContent={"flex-end"}
            pb={3}
            bg={"#E8E8E8"}
            h={"75vh"}
            w={"100%"}
            borderRadious={"lg"}
            overflow={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div
                className="messages"
                style={{
                  backgroundImage: `url("https://media.istockphoto.com/id/1328631201/photo/angry-and-smiley-face-wooden-blocks-on-colored-background.webp?b=1&s=170667a&w=0&k=20&c=tDAVUkO7B-_kXmutchWYwQ7X0ksg1j1-ow4OZsxFpTw=")`,
                  backgroundSize: "cover",
                  // display: "flex",
                  // alignItems: "center",
                  // justifyContent: "center",
                  // height: "100%",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    style={{
                      margin: "auto",
                      backgroundColor: "transparent",
                      display: "block",
                      shapeRendering: "auto",
                    }}
                  >
                    <circle cx="10" cy="25" r="6" fill="#fff" stroke="none">
                      <animate
                        attributeName="opacity"
                        dur="1s"
                        values="1;0"
                        repeatCount="indefinite"
                        begin="0"
                      />
                    </circle>
                    <circle cx="25" cy="25" r="6" fill="#fff" stroke="none">
                      <animate
                        attributeName="opacity"
                        dur="1s"
                        values="1;0"
                        repeatCount="indefinite"
                        begin="0.2"
                      />
                    </circle>
                    <circle cx="40" cy="25" r="6" fill="#fff" stroke="none">
                      <animate
                        attributeName="opacity"
                        dur="1s"
                        values="1;0"
                        repeatCount="indefinite"
                        begin="0.4"
                      />
                    </circle>
                  </svg>
                </div>
              ) : (
                <></>
              )}
              <InputGroup>
                <Input
                  placeholder="Enter a messsge..."
                  variant={"filled"}
                  bg={"#E0E0E0"}
                  value={newMessage}
                  onChange={typingHandler}
                />
                <InputRightElement width={"4.5rem"}>
                  <Button
                    variant={"solid"}
                    colorScheme="teal"
                    ml={1}
                    // isLoading={renameLoading}
                    onClick={sendMessage}
                  >
                    Send
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <>
          <Box
            style={{
              backgroundImage: `url("https://c8.alamy.com/comp/T8BXP3/smile-illustration-blinking-the-eye-humor-T8BXP3.jpg")`,
              backgroundSize: "cover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            h="100%"
          >
            <Text
              fontSize={"3xl"}
              pb={3}
              marginBottom={"150"}
              fontFamily={"Work sans"}
            >
              Click on a user and start chat.
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default SingleChat;
