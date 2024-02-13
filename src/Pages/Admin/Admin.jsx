import React, { useEffect, useState } from "react";
import "./Admin.css";
import Chart from "react-apexcharts";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { APIS, headers } from "../../data/header";
import { updatesStaticTask } from "../../util/showmessages";
const Admin = () => {
  const UUU = useSelector((state) => state.authReducer.authData);

  // THIS ALL STATES ARE STORE CHARTS VALUES
  const options = {
    labels: ["Assign", "Not Assign"],
    colors: ["#b8bbbf", "#ff6f00"],
  };
  const locationOptions = {
    labels: ["Assign Locations", "Not Assign Locations"],
    colors: ["#b8bbbf", "#ff6f00"],
  };
  const [update, setUpdate] = useState([30, 70]);
  const [updateLocations, setUpdateLocations] = useState([70, 30]);

  //  STORE PS-DETAILS COORESPONDING DISTRICT COORDINATOR
  const [psAcDetailsBasedOnDistrictCoor, setPsAcDetailsBasedOnDistrictCoor] =
    useState([]);

  // STORE THE TASKS FROM DISTRICT COORDINATORS
  const [ownTask, setOwnTask] = useState([]);

  // STORE UNIQUE LOCATIONS
  const [psDetailsUniqueLocations, setPsDetailsUniqueLocations] = useState([]);

  // STORE UNIQUE LOCATIONS ASSIGN TASK PERCENTAGES
  const [uniqueLocationsAssign, setUniqueLocationsAssign] = useState([]);

  //  STORE UNIQUE LOCATIONS NOT ASSIGN TASK PERCENTAGES
  const [uniqueNotAssignLocations, setUniqueNotAssignLocations] = useState([]);

  // THIS IS PS-NUMBERS PIE-CHART VALUES STORE STATE
  const [psChartNumber, setPsChartNumber] = useState([]);

  // THIS IS LOCATION PIE-CHART VALUES STORE STATE
  const [locationChartNumber, setLocationChartNumber] = useState([]);

  // STORE THE SUB-TASKS AFTER FILTERING THE TASK
  const [firstSubTask, setFirstSubTask] = useState([]);
  const [secondSubTask, setSecondSubTask] = useState([]);

  // AFTER FILTERING COMPLTED TASK STORE PERCENTAGES
  const [firstTaskPercentage, setFirstTaskPercentage] = useState(0);
  const [secondTaskPercentage, setSecondTaskPercentage] = useState(0);

  // INITIALLY PS-DETAILS FETCH FROM DATABASE - COORESPONDING DISTRICT COORDINATOR
  const onPsDetailsBasedOnDistrict = () => {
    let district = UUU?.district;
    APIS.get(`/district/district-coor-ps-ac-number/${district}`, {
      headers: headers,
    })
      .then((res) => {
        // console.log(res.data);
        setPsAcDetailsBasedOnDistrictCoor(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // INITIALLY FETCH ALL DISTRICT COORDINATOR TASKS
  const onFetchAllTaskDistrictCoor = () => {
    let id = UUU?._id;
    APIS.get(
      `/state/distrci/task/${id}`,

      {
        headers: headers,
      }
    )
      .then((res) => {
        // console.log(res.data);
        setOwnTask(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    onPsDetailsBasedOnDistrict();
    onFetchAllTaskDistrictCoor();
  }, []);

  /*
     AFTER FETCHING THE STATIC TASKS FROM DATA BASE 
     FILTER THE TASK BASED ON SUB-TASKS AND DISPLAY THE UI
   */
  useEffect(() => {
    const firstTask = ownTask.filter(
      (each) => each.task_heading === "Proceedings Collections"
    );
    const secondTask = ownTask.filter(
      (each) => each.task_heading === "Work Completion Tasks"
    );
    setFirstSubTask(firstTask);

    setSecondSubTask(secondTask);
  }, [ownTask]);

  /*
   AFTER FILTERING THE SUB-TAKS THAT COORESPONDING PERCENTAGES CALCULATIONS FUNCTION
   AND STORE THE `firstTaskPercentage` `secondTaskPercentage` STATE
  */
  useEffect(() => {
    let firstTaskPerArr = firstSubTask.filter(
      (each) => each.completed === "yes"
    );

    let firstTaskPer = (firstTaskPerArr.length / firstSubTask.length) * 100;
    console.log(firstTaskPer);

    let secondTaskPerArr = secondSubTask.filter(
      (each) => each.completed === "yes"
    );

    let secondTaskPer = (secondTaskPerArr.length / secondSubTask.length) * 100;
    // console.log(firstTaskPer);
    setFirstTaskPercentage(firstTaskPer);
    // console.log(secondTaskPer);
    setSecondTaskPercentage(secondTaskPer);
  }, [firstSubTask, secondSubTask]);

  // THIS FUNCTION CALCULATED THE PS NUMBER ASSIGN OR NOT AND SHOW CHARTS
  const calPsChart = () => {
    const assignPsChart = psAcDetailsBasedOnDistrictCoor.filter(
      (each) => each.assign === "yes"
    );
    const assignPsChartPer =
      (assignPsChart.length / psAcDetailsBasedOnDistrictCoor.length) * 100;
    const notAssignPsChart =
      psAcDetailsBasedOnDistrictCoor.length - assignPsChart.length;
    const notAssignPsChartPer =
      (notAssignPsChart / psAcDetailsBasedOnDistrictCoor.length) * 100;
    setPsChartNumber([assignPsChartPer, notAssignPsChartPer]);
  };

  /*
   AFTER PS-DETAILS FETCHING CALCULATED CHART VALUES AND PERCENTAGES
   AND FILTER UNIQUE LOCATIONS AND COORESPONDING UNIQUE LOCATIONS FILTER ASSIGN TASKS
   AND NOT-ASSIGN TASKS AND SET CHART
  */
  useEffect(() => {
    calPsChart();
    const key = "Location";
    const arrayUniqueByKey = [
      ...new Map(
        psAcDetailsBasedOnDistrictCoor.map((item) => [item[key], item])
      ).values(),
    ];
    setPsDetailsUniqueLocations(arrayUniqueByKey);
    const assignTask = arrayUniqueByKey.filter((each) => each.assign === "yes");
    setUniqueLocationsAssign(assignTask);
    const notAssignLoc = arrayUniqueByKey.length - assignTask.length;
    setUniqueNotAssignLocations(notAssignLoc);
    const assignLocationPer =
      (assignTask.length / arrayUniqueByKey.length) * 100;
    const notAssignLocationPer = (notAssignLoc / arrayUniqueByKey.length) * 100;
    setLocationChartNumber([assignLocationPer, notAssignLocationPer]);
  }, [psAcDetailsBasedOnDistrictCoor]);

  // AFTER ALL LOCATIONS AND PS-NUMBER CALCULATIONS CALL THIS FUNCTION SHOW CHARTS
  useEffect(() => {
    setUpdate(psChartNumber);
    setUpdateLocations(locationChartNumber);
  }, [psChartNumber, locationChartNumber]);

  /*
  WHEN DISTRICT COORDINATOR STATIC TASK UPDATE THIS FUNCTION WILL CALL
  AND UPDATED THERE TASK FROM DATABES
  AND FETCH THERE COORESPONDING TASKS FROM DATABSE
  */
  const onOwnTasdkCompletedFun = (id) => {
    console.log(id);
    let district = UUU?._id;
    APIS.put(`/district/update/own/task/${district}/task/${id}`, {
      headers: headers,
    })
      .then((res) => {
        console.log(res.data);
        updatesStaticTask();
        onFetchAllTaskDistrictCoor();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="admin__main__page">
      <span className="all__pages__over__view new__over__view">Over View</span>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="tosted"
      />
      <div className="district__dashboard__main">
        <div className="district__name__display">
          <h3>
            Hi <span style={{ color: "#ff6f00" }}>{UUU?.name}</span>
          </h3>
          <span>Check Your All Status Of Locations</span>
        </div>
        <div className="ps_location_card">
          <div className="Ps_cards_card">
            <span>{psAcDetailsBasedOnDistrictCoor?.length}</span>
            <span>No Of PS </span>
          </div>
          <div className="Ps_cards_card">
            <span>{psDetailsUniqueLocations?.length}</span>
            <span>No Of Locations</span>
          </div>
          <div className="Ps_cards_card">
            <span>{uniqueLocationsAssign?.length}</span>
            <span>No Of Assigned Locations</span>
          </div>
          <div className="Ps_cards_card">
            <span>{uniqueNotAssignLocations}</span>
            <span>No Of Un-Assigned Locations</span>
          </div>
        </div>
        {/* charts */}
        <div className="charts__admin__display">
          <Chart options={options} series={update} type="pie" width="100%" />
          <Chart
            options={locationOptions}
            series={updateLocations}
            type="pie"
            width="120%"
          />
        </div>
      </div>
      {/* Static Tasks */}
      <div className="district__coor__static__task">
        {firstSubTask?.length > 0 && (
          <div className="district__proceedings__card">
            <div className="proceeding__card">
              <h4>{firstSubTask.length > 0 && firstSubTask[0].task_heading}</h4>
              <span>{firstTaskPercentage} %</span>
            </div>
            {firstSubTask.map((each, key) => (
              <div
                className="display__each__task new__added__admi__task"
                key={key}
              >
                <span>{each.sub_task}</span>

                {each.completed === "yes" ? (
                  <div className="task__completed__admin__data__card">
                    <span>Task Completd</span>
                  </div>
                ) : (
                  <div className="admin__takethe__input__from__task__card">
                    <button onClick={() => onOwnTasdkCompletedFun(each?._id)}>
                      Your Task is Completed Please Click to Confirm
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {secondSubTask?.length > 0 && (
          <div className="district__proceedings__card">
            <div className="proceeding__card">
              <h5>
                {secondSubTask.length > 0 && secondSubTask[0].task_heading}
              </h5>
              <span>{secondTaskPercentage} %</span>
            </div>
            {secondSubTask.map((each, key) => (
              <div className="display__each__task" key={key}>
                <span>{each.sub_task}</span>
                {each.completed === "yes" ? (
                  <div className="task__completed__admin__data__card">
                    <span>Task Completd</span>
                  </div>
                ) : (
                  <div className="admin__takethe__input__from__task__card">
                    <button onClick={() => onOwnTasdkCompletedFun(each?._id)}>
                      Your Task is Completed Please Click to Confirm
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
