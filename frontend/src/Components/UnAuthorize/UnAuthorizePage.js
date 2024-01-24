import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UnAuthorizePage = () => {
  let navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return <div></div>;
};

export default UnAuthorizePage;
