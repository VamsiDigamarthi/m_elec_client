import React, { useEffect, useState } from "react";
import "./StateCoorAssignTask.css";
import { APIS, headers } from "../../data/header";
import { ToastContainer } from "react-toastify";
import {
  staticCoordinatorTaskAddedSuccess,
  taskAddedAlredyRegis,
} from "../../util/showmessages";
const stateTask = [
  {
    name: "Proceedings Collections",
    task: ["PS List", "PS Work Orders"],
  },
  {
    name: "Work Completion Tasks",
    task: ["Work Completed Certificate", "Data Submission Certificate"],
  },
];

const StateCoorAssignTask = () => {
  // THIS TWO STATES ARE STORED PS DETAILS
  const [initialMainPsData, setInitialMainPsData] = useState([]);
  const [mainCamDataFromApp, setMainCamDataFromApp] = useState([]);

  // UNIQUE STATE VALUES STORE DATA
  const [uniqueState, setUniqueState] = useState([]);

  // STORE ONE STATE VALUE
  const [selectedState, setSelectedState] = useState("");

  // STORE UNIQUE DISTRICT VALUES
  const [disticts, setDisticts] = useState(null);

  // STORE ONE DISTRICT VALUE
  const [selectedDist, setSelectedDist] = useState(null);

  // STORE THE STATIC FIRST TASK
  const [selectTask, setSelectTask] = useState("");

  // SELECT DROP DOWN STATIC TASK STORE COORESPONDING SUB TASKS
  const [selectSubTask, setSelectSubTask] = useState(null);

  // SELECT DROP DOWN STATIC TASK STORE COORESPONDING SUB TASKS FIRST VALUE SHOW THE DROP DOWN
  const [selectedSubTaskValue, setSelectedSubTaskValue] = useState(null);

  // THIS TWO STATES ARE STORE SUB-TASKS VALUES
  const [firstSubTask, setFirstSubTask] = useState([]);
  const [secondSubTask, setSecondSubTask] = useState([]);

  // STORE THE CORRESPONDING DISTRICT COORDINATOR VALUES
  const [
    correspondingDistrictCoordinator,
    setCorrespondingDistrictCoordinator,
  ] = useState(null);

  // STORE DISTRICT COORDINATOR TASKS
  const [districtCoorTask, setDistrictCoorTask] = useState([]);

  // INITIALLLY GET ALL PS DETAILS BECAUSE FILTER STATE AND DISTRICT NAMES
  const onGetAllPsDetails = () => {
    APIS.get("/state/all-ps-details-fetch-super-admin", {
      headers: headers,
    })
      .then((res) => {
        // console.log(res.data);
        setInitialMainPsData(res.data);
        setMainCamDataFromApp(res.data);
      })
      .catch((e) => {
        console.log(e?.response?.data?.msg);
      });
  };
  useEffect(() => {
    onGetAllPsDetails();
  }, []);

  // STATE DROP DOWN CHANGE THIS FUNCTION CALL AND STORE CORRESPONDING DISTRICT VALUES
  // AND FILTER UNIQUE DISTRICT VALUES
  const selectSate = (e) => {
    setDisticts([]);

    const allDistrict = mainCamDataFromApp.filter(
      (each) => each.State === e.target.value
    );

    const uniqueDistrict = [
      ...new Set(allDistrict.map((item) => item.District)),
    ];
    setSelectedState(e.target.value);
    setSelectedDist(uniqueDistrict[0]);

    setDisticts(uniqueDistrict);
  };

  // DISTRICT VALUES CHANGE STORE DISTRICT VALUES FROM `selectedDist` STATE
  const selectDistName = (e) => {
    setSelectedDist(e.target.value);
  };

  // INITIALLY PAGE LOAD SET UNIQUE STATE FILTER FUNCTION
  useEffect(() => {
    const unique = [...new Set(mainCamDataFromApp?.map((item) => item.State))];
    setUniqueState(unique);
  }, [mainCamDataFromApp]);

  // SELECT STATE AND DISTRICT VALUS FROM DROP DOWN AND BTN CLICK THIS FUNCTION CALL
  // AND FETCH THE CORRESPONDING DISTRICT COORDINATOR DETAILS
  const onFilterDistrictCoor = (e) => {
    // console.log(selectedDist, selectedState);
    APIS.get(
      `/state/fetch-district-coordinator/${selectedDist}/state/${selectedState}`,

      {
        headers: headers,
      }
    )
      .then((res) => {
        console.log(res.data);
        setCorrespondingDistrictCoordinator(res.data);
      })
      .catch((e) => console.log(e));
  };

  /* 
    AFTER DISTRICT COORDINATOR DATA FETCH THAT COORESPONDING DISTRICT COORDINATOR 
    TASK FETCH FROM DATA BASE
  */
  useEffect(() => {
    const fetchDistrictTask = () => {
      const id = correspondingDistrictCoordinator?._id;
      APIS.get(
        `/state/distrci/task/${id}`,

        {
          headers: headers,
        }
      )
        .then((res) => {
          // console.log(res.data);
          setDistrictCoorTask(res.data);
        })
        .catch((e) => console.log(e));
    };

    correspondingDistrictCoordinator && fetchDistrictTask();
  }, [correspondingDistrictCoordinator]);

  // SELECT THE STATIC TASK FROM DROP DOWN THIS FUNCTION CALL
  const onChangeTaskSelected = (e) => {
    setSelectTask(e.target.value);
    const filterSubTask = stateTask.filter(
      (each) => each.name === e.target.value
    );
    // console.log(filterSubTask);
    setSelectSubTask(filterSubTask[0]?.task);
    setSelectedSubTaskValue(filterSubTask[0]?.task[0]);
  };

  // SELECT THE SUB STATIC TASK FROM DROP DOWN THIS FUNCTION CALL
  const onChangeSubTaskFun = (e) => {
    setSelectedSubTaskValue(e.target.value);
  };

  /*
   AFTER SELECTED STATIC TASKS AND BTN CLICK THIS FUNCTION CALL
   AND STORE THERE TASKS FROM DATABASE COORESPONDING DISTRICT COORDINATOR
   AND THIS RESPONSE SUCCESS AGAIN CALL API TO GET DISTRICT COORDINATOR TASKS
  */
  const onSubmitedTaskForDistrict = (e) => {
    const id = correspondingDistrictCoordinator?._id;
    APIS.post(
      `/state/assign/task/district/coor/${id}`,
      {
        selectTask,
        selectedSubTaskValue,
      },
      {
        headers: headers,
      }
    )
      .then((res) => {
        // console.log(res.data);
        staticCoordinatorTaskAddedSuccess();
        onFilterDistrictCoor();
      })
      .catch((e) => {
        taskAddedAlredyRegis(e?.response?.data?.msg);
      });
  };

  // DISTRIC COORDINATOR TASK FILTER THERE ARE TWO TYPES
  useEffect(() => {
    const firstTask = districtCoorTask.filter(
      (each) => each.task_heading === "Proceedings Collections"
    );
    const secondTask = districtCoorTask.filter(
      (each) => each.task_heading === "Work Completion Tasks"
    );
    setFirstSubTask(firstTask);

    setSecondSubTask(secondTask);
  }, [districtCoorTask]);

  return (
    <div className="state__coor__assigntask__main">
      <h2>Assign Static Taks</h2>
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
      <div className="state__coor__main__modal__card">
        <div className="state__assigntask__filter__card">
          <select onChange={selectSate}>
            <option disabled hidden selected>
              SELECT STATE
            </option>
            {uniqueState?.map((each, key) => (
              <option key={key}>{each}</option>
            ))}
          </select>
          <select value={selectedDist} onChange={selectDistName}>
            <option disabled hidden selected>
              SELECT DISTRICT{" "}
            </option>
            {disticts?.map((each, key) => (
              <option key={key}>{each}</option>
            ))}
          </select>
          <button onClick={onFilterDistrictCoor}>Filter</button>
        </div>

        {correspondingDistrictCoordinator !== null ? (
          <div className="state__district__coor__available__data">
            <div className="state__district__filter__name__card">
              <span>
                Name <span>{correspondingDistrictCoordinator?.name}</span>
              </span>
              <span>
                Phone <span>{correspondingDistrictCoordinator?.phone}</span>
              </span>
            </div>
            {/* task display Card */}
            <div className="all__task__display__state__coo__card">
              <h3
                className={`${
                  firstSubTask.length &&
                  "all__task__display__state__coo__card__h3"
                }`}
              >
                {firstSubTask.length > 0 && firstSubTask[0].task_heading}
              </h3>
              {firstSubTask.map((each, key) => (
                <div className="display__each__task" key={key}>
                  <span>{each.sub_task}</span>
                  <span
                    className={`${
                      each.completed !== "no"
                        ? "task__completed"
                        : "task__not__completed"
                    }`}
                  >
                    {each.completed !== "no" ? "Completed" : "Not Completed"}
                  </span>
                </div>
              ))}
              <h3
                className={`${
                  secondSubTask.length &&
                  "all__task__display__state__coo__card__h3"
                }`}
              >
                {secondSubTask.length > 0 && secondSubTask[0].task_heading}
              </h3>
              {secondSubTask.map((each, key) => (
                <div className="display__each__task" key={key}>
                  <span>{each.sub_task}</span>
                  <span
                    className={`${
                      each.completed !== "no"
                        ? "task__completed"
                        : "task__not__completed"
                    }`}
                  >
                    {each.completed !== "no" ? "Completed" : "Not Completed"}
                  </span>
                </div>
              ))}
            </div>
            {districtCoorTask?.length !== 4 && (
              <div className="assign__task__text__show__display__main__card">
                <span>Assign Tasks</span>

                <div className="state__assign__task__card">
                  <select onChange={onChangeTaskSelected}>
                    <option disabled hidden selected>
                      SELECT TASK
                    </option>
                    {stateTask.map((each, key) => (
                      <option key={key} value={each.name}>
                        {each.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedSubTaskValue}
                    onChange={onChangeSubTaskFun}
                  >
                    <option disabled hidden selected>
                      SELECT TASK
                    </option>
                    {selectSubTask?.map((each, key) => (
                      <option key={key} value={each}>
                        {each}
                      </option>
                    ))}
                  </select>
                  <button onClick={onSubmitedTaskForDistrict}>Apply</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="state__district__coor__not__found__card">
            <h1>Data Not Found</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateCoorAssignTask;
