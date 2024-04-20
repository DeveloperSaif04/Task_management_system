import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ForgotPassword from "./components/auth/ForgotPassword";
import UpdatePassword from "./components/auth/UpadatePassword";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [taskTitle, setTaskTitle] = useState("Tasks");

  const [allTasks, setAllTasks] = useState([]);


  useEffect(() => {
    console.log("Tasks state:", tasks);
  }, [tasks]);

useEffect(() => {

    const handleGetUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(data.user);
      } catch (error) {
        console.log("USER IS NOT AUTHENTICATED!");
        setIsAuthenticated(false);
        setUser({});
      }
    };
    handleGetUser();

}, [isAuthenticated]);


  return (
    <div className="">
      <Router>
        <Navbar
          setTasks={setTasks}
          setIsAuthenticated={setIsAuthenticated}
          isAuthenticated={isAuthenticated}
          setTaskTitle={setTaskTitle}
          tasks={tasks}
          allTask={allTasks}
          setAllTasks={setAllTasks}

        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isAuthenticated={isAuthenticated}
                tasks={tasks}
                setTasks={setTasks}
                taskTitle={taskTitle}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />

          <Route
          path="/forgot-password"
          element={
         
              <ForgotPassword />
           
          }
        />

        <Route
          path="update-password/:id"
          element={
      
              <UpdatePassword />
          
          }
        />

          <Route
            path="/profile"
            element={<Profile user={user} isAuthenticated={isAuthenticated} />}
          />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
};

export default App;
