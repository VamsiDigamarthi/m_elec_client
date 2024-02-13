import React, { useEffect, useState } from "react";
import "./RejectedTask.css";
import { GoTasklist } from "react-icons/go";
import { useSelector } from "react-redux";
import { APIS, headers } from "../../data/header";
import ReactPaginate from "react-paginate";
import RejectedTaskAdd from "../../Modals/RejectedTaskAdd/RejectedTaskAdd";
import { ToastContainer, toast } from "react-toastify";
const RejectedTask = () => {
  const UUU = useSelector((state) => state.authReducer.authData);

  // STORE ALL REJECTED TASKS SPECIFIC DISTRICT COO
  const [rejectedTask, setRejectedTask] = useState([]);

  // STORE REJECTED TASK WHENE ACTION CLICK CORRE TASK STORE
  const [signleRejectedTask, setSignleRejectedTask] = useState(null);

  // AFTER ALL REJECTED TASK THIS ALL STATES ARE STORE PAGINATIONS
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 8;
  const currentItems = rejectedTask?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(rejectedTask?.length / 8);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 8) % rejectedTask?.length;
    setItemOffset(newOffset);
  };

  // STORE SHOW MODAL VALUE
  const [openRejectedTaskModal, setOpenRejectedTaskModal] = useState(false);

  // INITIALLY FETCH ALL REJECTED TASKS IN SPECIFIC DISTRICT
  const rejectedTaskApiCall = () => {
    const district = UUU?.district;
    APIS.get(`/district/rejected/tasks/district/${district}`, {
      headers: headers,
    })
      .then((res) => {
        // console.log(res.data);
        setRejectedTask(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    rejectedTaskApiCall();
  }, []);

  // REJECTED TASK ACTION CLICK SHOW MODAL
  const onOpenRejectedTaskModalFun = (each) => {
    setOpenRejectedTaskModal(true);
    setSignleRejectedTask(each);
  };
  // REJECTED TASK ACTION CLICK CLOSE MODAL
  const closeRejectedTaskModalFun = () => {
    setOpenRejectedTaskModal(false);
  };

  const registorSucces = (data) =>
    toast.success(data, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  // console.log(signleRejectedTask);

  return (
    <div className="rejected__task__main__card">
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
      />
      <h1>Rejected Task</h1>
      {currentItems.length > 0 ? (
        <div
          // style={{
          //   filter: openTaskAssignModal && "blur(10px)",
          // }}
          className="table__main__card"
        >
          <div className="table__header__card">
            <span>District</span>
            <span>Location</span>
            <span>PS No</span>
            <span>Mandal</span>
            <span>PS Address</span>
            <span className="table__header__last__span">Action</span>
          </div>
          <div className="table__body__card">
            {currentItems?.map((each, key) => (
              <div
                //   style={{
                //     color: each.assign === "yes" && "#ee8673",
                //   }}
                key={key}
                className="table__inner__body"
              >
                <span>{each.district}</span>
                <span>{each.location}</span>
                <span>{each.PS_No}</span>
                <span>{each.mandal}</span>
                <span>{each.PS_name.toLowerCase().slice(0, 80)}</span>
                <button className="table__action">
                  <GoTasklist
                    onClick={() => onOpenRejectedTaskModalFun(each)}
                    size={20}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3>No Rejected Tasks</h3>
        </div>
      )}
      <div
        // style={{
        //   filter: openTaskAssignModal && "blur(10px)",
        // }}
        className="paginations__card__appcss"
      >
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          className="paginat"
        />
      </div>
      {openRejectedTaskModal && (
        <RejectedTaskAdd
          closeRejectedTaskModalFun={closeRejectedTaskModalFun}
          signleRejectedTask={signleRejectedTask}
          rejectedTaskApiCall={rejectedTaskApiCall}
          registorSucces={registorSucces}
        />
      )}
    </div>
  );
};

export default RejectedTask;
