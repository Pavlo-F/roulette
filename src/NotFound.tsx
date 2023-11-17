import React, { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NotFound = memo(() => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return <div>Not found</div>;
});
