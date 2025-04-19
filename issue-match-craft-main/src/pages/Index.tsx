
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Landing from "./Landing";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  
  return <Landing />;
};

export default Index;
