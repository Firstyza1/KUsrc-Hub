import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Subject from "./components/Subjects/Subjects";
import "./App.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.body.className =
      location.pathname === "/Community" ? "no-padding" : "";
  }, [location]);

  return (
    <>
      <Subject />
    </>
  );
}

export default App;
