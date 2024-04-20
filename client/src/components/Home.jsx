import axios from "axios";
import {  useState } from "react";
import { Button, Card, Stack } from "react-bootstrap";
import toast from "react-hot-toast";
import CreateTaskModal from "./CreateTaskModal";
import UpdateTaskModal from "./UpdateTaskModal";
import ViewTaskModal from "./ViewTaskModal";
import { FaEye } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { Navigate } from "react-router-dom";
import '../App.css';
import ConfirmationModal from "./core/ConfirmationModal";

const Home = ({ isAuthenticated, tasks, setTasks, taskTitle }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewTaskId, setViewTaskId] = useState(null);
  const [updatedTaskId, setUpdateTaskId] = useState(null);
  const [page, setPage] = useState(1)

  const [confirmationModal, setConfirmationModal] = useState(null);

  const removeModal = ()=>{
    setConfirmationModal(null)
  }

  const deleteTask = async (id) => {
    await axios
      .delete(`http://localhost:4000/api/v1/task/delete/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setTasks((prevTasks) => prevTasks.filter((tasks) => tasks._id !== id));
       
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleCreateModalClose = () => setShowCreateModal(false);
  const handleUpdateModalClose = () => setShowUpdateModal(false);
  const handleViewModalClose = () => setShowViewModal(false);

  const handleCreateModalShow = () => setShowCreateModal(true);

  const handleUpdateModalShow = (id) => {
    setUpdateTaskId(id);
    setShowUpdateModal(true);
  };

  const handleViewModalShow = (id) => {
    setViewTaskId(id);
    setShowViewModal(true);
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  const selectPageHandler = (selectedPage) => {
    const maxPages = Math.ceil(tasks.length / 8); 
    if (selectedPage >= 1 && selectedPage <= maxPages && selectedPage !== page) {
      setPage(selectedPage);
    }
  };
  



  function formatDueDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  }
  
  return (
    <div className="container my-4 ">
      <div className="row mb-3">
        <div className="col">
          <h1>{taskTitle}</h1>
        </div>
        <div className="col text-end">
          <Button variant="primary" onClick={handleCreateModalShow}>
            Create Task
          </Button>
        </div>
      </div>
      <div className="row">
      {tasks && tasks.length > 0 ? (
  tasks.slice(page * 8 - 8, page * 8).map((task) => (
    <div key={task._id} className="col-lg-3 col-md-4 col-sm-6 card-dess">
      <div className="card mb-3 shadow-sm"> {/* Added shadow-sm class here */}
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <div className="mb-3">
              <h5 className="card-title font-bold mb-0">Title:</h5>
              <p className="mb-2">{task.title}</p>
            </div>

            <div className="mb-3">
              <h5 className="card-title font-bold mb-0">Description:</h5>
              <p className="mb-2">{task.description}</p>
            </div>

            <div className="mb-3">
              <h5 className="card-title font-bold mb-0">Due date:</h5>
              <p className="mb-2">{formatDueDate(task.dueDate)}</p>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              onClick={() => handleUpdateModalShow(task._id)}
              className="btn btn-primary me-2"
            >
              <MdEdit className="me-1" /> Edit
            </button>
            <button
              onClick={() =>
                setConfirmationModal({
                  text1: "Are you Sure?",
                  text2: "You will be Delete You task.",
                  btn1Text: "Delete",
                  btn1Handler: () => deleteTask(task._id),
                  btn2Text: "Cancel",
                  removeModal: removeModal,
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
              className="btn btn-danger me-2"
            >
              <MdDelete className="me-1" /> Delete
            </button>
            <button
              onClick={() => handleViewModalShow(task._id)}
              className="btn btn-info"
            >
              <FaEye className="me-1" /> View
            </button>
          </div>
        </div>
      </div>
    </div>
  ))
) : (
  <h1>YOU DON'T HAVE ANY {taskTitle}</h1>
)}




<div className="pagination">
  <span className={`arrow ${page > 1 ? "" : "disabled"}`} onClick={() => selectPageHandler(page - 1)}>&#9664;</span>
  {[...Array(Math.ceil(tasks?.length / 8))].map((_, i) => (
    <span key={i} className={`page-number ${page === i + 1 ? "selected" : ""}`} onClick={() => selectPageHandler(i + 1)}>
      {i + 1}
    </span>
  ))}
  <span className={`arrow ${page < Math.ceil(tasks.length / 8) ? "" : "disabled"}`} onClick={() => selectPageHandler(page + 1)}>&#9654;</span>
</div>


      </div>


      <CreateTaskModal
        handleCreateModalClose={handleCreateModalClose}
        showCreateModal={showCreateModal}
        setTasks={setTasks}
      />

      <UpdateTaskModal
        handleUpdateModalClose={handleUpdateModalClose}
        showUpdateModal={showUpdateModal}
        id={updatedTaskId}
        setTasks={setTasks}
      />

      <ViewTaskModal
        handleViewModalClose={handleViewModalClose}
        showViewModal={showViewModal}
        id={viewTaskId}
      />

{confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}

    </div>
  );
};

export default Home;
