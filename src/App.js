import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
// import { useSelector } from "react-redux";
import { Sidebar } from "./components/Sidebar/Sidebar";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import SuperAdmin from "./Pages/SuperAdmin/SuperAdmin";
import Admin from "./Pages/Admin/Admin";
import User from "./Pages/User/User";
import Learning from "./Pages/Learning/Learning";
import TaskPage from "./Pages/TaskPage/TaskPage";
import { useSelector } from "react-redux";
import NotAccess from "./Pages/NotAccess/NotAccess";
import Payment from "./Pages/Payment/Payment";
import Certificate from "./Pages/Certificate/Certificate";
import DetailsPs from "./Pages/DetailsPs/DetailsPs";
import AssignTaskAdmin from "./Pages/AssignTaskAdmin/AssignTaskAdmin";
import { useState } from "react";
import RejectedTask from "./Pages/RejectedTask/RejectedTask";
import DistrictPaymentDetails from "./Pages/DistrictPaymentDetails/DistrictPaymentDetails";
import Chart from "./Pages/Chart/Chart";
import StateCoorAssignTask from "./Pages/StateCoorAssignTask/StateCoorAssignTask";
function App() {
  const UUU = useSelector((state) => state.authReducer.authData);
  console.log(UUU);
  const [taskAssignAdminModalOpen, setTaskAssignAdminModalOpen] =
    useState(false);
  // console.log(UUU);
  // console.log(UUU[0].role);

  const changeModeOfTask = () => {
    setTaskAssignAdminModalOpen(!taskAssignAdminModalOpen);
  };

  // console.log(taskAssignAdminModalOpen);

  return (
    <div className="App">
      <Router>
        <Sidebar taskAssignAdminModalOpen={taskAssignAdminModalOpen}>
          <Routes>
            {/* <Route path="/register" element={<Register />} /> */}

            <Route
              path="/register"
              element={UUU ? <Navigate to="/" /> : <Register />}
            />

            {/* <Route path="/" element={<Home />} /> */}

            <Route
              path="/"
              element={
                UUU ? (
                  UUU?.role === "1" ? (
                    <Home />
                  ) : UUU?.role === "2" ? (
                    <Navigate to="/admin" />
                  ) : (
                    <Navigate to="/user" />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/super-admin"
              element={
                UUU ? (
                  UUU?.role === "1" ? (
                    <SuperAdmin />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/state/assign/task"
              element={
                UUU ? (
                  UUU?.role === "1" ? (
                    <StateCoorAssignTask />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />
            {/*  */}
            <Route
              path="/admin"
              element={
                UUU ? (
                  UUU?.role === "2" ? (
                    <Admin />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/rejected"
              element={
                UUU ? (
                  UUU?.role === "2" ? (
                    <RejectedTask />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/payment-district-coor"
              element={
                UUU ? (
                  UUU?.role === "2" ? (
                    <DistrictPaymentDetails />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/assigntask"
              element={
                UUU ? (
                  UUU?.role === "2" ? (
                    <AssignTaskAdmin changeModeOfTask={changeModeOfTask} />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />
            <Route
              path="/detailsps"
              element={
                UUU ? (
                  UUU?.role === "2" ? (
                    <DetailsPs />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/chat"
              element={
                UUU ? (
                  UUU?.role === "2" ? (
                    <Chart />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />
            {/* admin routes */}
            <Route
              path="/user"
              element={
                UUU ? (
                  UUU?.role === "3" ? (
                    <User />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/learning"
              element={
                UUU ? (
                  UUU?.role === "3" ? (
                    <Learning />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />
            <Route
              path="/tasks"
              element={
                UUU ? (
                  UUU?.role === "3" ? (
                    <TaskPage />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/payment"
              element={
                UUU ? (
                  UUU?.role === "3" ? (
                    <Payment />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/certificate"
              element={
                UUU ? (
                  UUU?.role === "3" ? (
                    <Certificate />
                  ) : (
                    <NotAccess />
                  )
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            {/* <Route path="/certificate" element={<Certificate />} /> */}

            {/* <Route path="/payment" element={<Payment />} /> */}
          </Routes>
        </Sidebar>
      </Router>
    </div>
  );
}

export default App;
