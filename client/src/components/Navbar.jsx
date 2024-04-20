import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";

function Header({
  setTasks,
  setIsAuthenticated,
  isAuthenticated,
  setTaskTitle,
  tasks
}) {

 const data = tasks;
  const [allTasks, setAllTasks] = useState([]);

 // Fetch tasks from the server
 const fetchTasks = async () => {
  try {
    const response = await axios.get(
      "http://localhost:4000/api/v1/task/mytask",
      { withCredentials: true }
    );
    // console.log(response.data.tasks)
    setAllTasks(response.data.tasks);
    setTasks(response.data.tasks); // Update tasks with fetched tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

 // Fetch tasks from the server when the component mounts

  useEffect(() => {
   
      fetchTasks();

   
  }, [isAuthenticated,setTasks]);


  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        { withCredentials: "true" }
      );
      toast.success(data.message);
      setIsAuthenticated(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const filterTasks = (filterType) => {
    let filteredTasks = [];
  
    switch (filterType) {
      case "completed":

        filteredTasks = allTasks.filter((task) => task.status === "completed");
        setTaskTitle("Completed Tasks");
        break;
      case "incomplete":
        filteredTasks = allTasks.filter((task) => task.status === "incomplete");
        setTaskTitle("Incomplete Tasks");
        break;
      case "archived":
        filteredTasks = allTasks.filter((task) => task.archived === true);
        setTaskTitle("Archived Tasks");
        break;
      case "all":
        filteredTasks = allTasks;
        setTaskTitle("All Tasks");
        break;
      default:
        filteredTasks = filterTasks;
    }
  

    // Log tasks for debugging
    console.log("Original tasks:", tasks);
    console.log("Filtered tasks:", filteredTasks);
  
    setTasks(filteredTasks);
    
    // Update the state with the filtered tasks
  };
  
   
   

  return (
    <Navbar
      expand="lg"
      className={`bg-body-tertiary ${!isAuthenticated ? "d-none" : ""}`}
    >
      <Container>
        <Navbar.Brand href="#home">TASK MANAGER</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto d-flex gap-6">
            <Link
              to={"/"}
              className="text-decoration-none d-flex align-items-center link-light  "
            >
              Home
            </Link>
            <NavDropdown title="Filter Tasks" id="basic-nav-dropdown" onClick={() => <Navigate to={"/"} />}>
              <NavDropdown.Item onClick={() => filterTasks("all")}>
                All Tasks
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() =>  filterTasks("completed")   
                }>
                Completed Tasks
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => filterTasks("incomplete")}>
                Incomplete Tasks
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => filterTasks("archived")}>
                Archived Tasks
              </NavDropdown.Item>
            </NavDropdown>
            <Link
              to={"/profile"}
              className="text-decoration-none d-flex align-items-center link-light  "
            >
              Profile
            </Link>
            <Button
              className="bg-transparent border-0"
              style={{ width: "fit-content" }}
              onClick={handleLogout}
            >
              LOGOUT
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
