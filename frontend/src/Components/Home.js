import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chatpage");
    }
  }, []);
  return (
    <>
      <Container maxW={"xl"} centerContent>
        <Box
          d="flex"
          justifyContent={"center"}
          textAlign={"center"}
          p={3}
          bg={"white"}
          w={"100%"}
          m={{ base: "10px 0 15px 0", md: "40px 0 15px 0" }}
          borderRadius={"lg"}
          borderWidth={"1px"}
          style={{ backgroundColor: "hsl(320.9deg 25.83% 86.51%)" }}
        >
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontFamily={"Work sans"}
            color={"black"}
          >
            Let's Take a Talk
          </Text>
        </Box>
        <Box
          marginTop={{ base: "10px", md: "20px" }}
          bg={"white"}
          w={"100%"}
          p={4}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList mb={{ base: "0.5em", md: "1em" }}>
              <Tab width={{ base: "100%", md: "50%" }}>Login</Tab>
              <Tab width={{ base: "100%", md: "50%" }}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Home;
