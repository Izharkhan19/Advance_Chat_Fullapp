import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCnf, setShowCnf] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
    pic: "",
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handlePic = async (pic) => {
    setLoading(true);

    if (pic !== undefined) {
      try {
        // Download the image from the URL

        // Create a FormData object
        const formData = new FormData();
        formData.append("file", pic);
        formData.append("upload_preset", "Chat_App");
        formData.append("cluod_name", "dhjwfyjp9");

        // Perform the image upload using fetch
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/dhjwfyjp9/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          setSignUpData({
            ...signUpData,
            pic: data.secure_url,
          });
          // setPic(data.secure_url);

          setLoading(false);
        } else {
          setLoading(false);

          console.error("Error uploading image:", uploadResponse.statusText);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error uploading image:", error);
      }
    } else {
      setLoading(false);
      console.warn("No URL provided for upload.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (
      !signUpData.name &&
      !signUpData.email &&
      !signUpData.password &&
      !signUpData.confirmPass
    ) {
      toast({
        title: "Please fill all the Fields.",
        // description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (signUpData.password !== signUpData.confirmPass) {
      toast({
        title: "Passwords Do not match.",
        // description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        {
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
          pic: signUpData.pic,
        },
        config
      );
      toast({
        title: "Registration Sucessfull.",
        // description: "We've created your account for you.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chatpage");
    } catch (error) {
      toast({
        title: error?.response?.data?.message,
        // description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter your name"
            onChange={(e) =>
              setSignUpData({
                ...signUpData,
                name: e.target.value,
              })
            }
          />
        </FormControl>

        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            onChange={(e) =>
              setSignUpData({
                ...signUpData,
                email: e.target.value,
              })
            }
          />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Enter your password"
              type={`${show ? "text" : "password"}`}
              onChange={(e) =>
                setSignUpData({
                  ...signUpData,
                  password: e.target.value,
                })
              }
            />
            <InputRightElement width={"4.5rem"}>
              <Button onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirmPass">
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Enter your confirm password"
              type={`${showCnf ? "text" : "password"}`}
              onChange={(e) =>
                setSignUpData({
                  ...signUpData,
                  confirmPass: e.target.value,
                })
              }
            />
            <InputRightElement width={"4.5rem"}>
              <Button onClick={() => setShowCnf(!showCnf)}>
                {showCnf ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload your Picture</FormLabel>
          {signUpData.pic && (
            <img src={signUpData.pic} width={"150px"} height={"150px"} alt="" />
          )}
          <Input
            placeholder="Upload pic"
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => handlePic(e.target.files[0])}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width={"100%"}
          color={"white"}
          marginTop={"15px"}
          onClick={handleSubmit}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </>
  );
};

export default SignUp;
