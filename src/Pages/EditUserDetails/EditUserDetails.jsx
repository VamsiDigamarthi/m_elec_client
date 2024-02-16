import React, { useState } from "react";
import "./EditUserDetails.css";
import { useSelector } from "react-redux";
import { APIS, headers } from "../../data/header";
const EditUserDetails = ({
  editUseSuccess,
  onOpenEditUserDetailsModal,
  getUserDataGromApis,
  userDataFromApi,
}) => {
  const UUU = useSelector((state) => state.authReducer.authData);
  console.log(userDataFromApi);

  const [editUserDetailsState, setEditUserDetailsState] = useState({
    username: userDataFromApi?.name,
    phone: userDataFromApi?.phone,
    phonepe: userDataFromApi?.phonepe,
    address: userDataFromApi?.address,
  });

  const onChangeEditProfileInput = (e) => {
    setEditUserDetailsState({
      ...editUserDetailsState,
      [e.target.name]: e.target.value,
    });
  };

  // console.log(editUserDetailsState);

  const onEditUserSubmit = () => {
    APIS.put(`/user/update-profile/${UUU?._id}`, editUserDetailsState, {
      headers: headers,
    })
      .then((res) => {
        console.log(res.data);
        editUseSuccess();
        onOpenEditUserDetailsModal();
        getUserDataGromApis();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="editmodal__main__card">
      <div className="user__edit__signle__input__div">
        <input
          type="text"
          value={editUserDetailsState.username}
          name="username"
          onChange={onChangeEditProfileInput}
        />
        <span>Name</span>
      </div>
      <div className="user__edit__signle__input__div">
        <input
          type="text"
          onChange={onChangeEditProfileInput}
          value={editUserDetailsState.phone}
          name="phone"
        />
        <span>Phone Number</span>
      </div>
      <div className="user__edit__signle__input__div">
        <input
          type="text"
          onChange={onChangeEditProfileInput}
          value={editUserDetailsState.phonepe}
          name="phonepe"
        />
        <span>UPI Number</span>
      </div>
      <textarea
        rows="5"
        onChange={onChangeEditProfileInput}
        value={editUserDetailsState.address}
        name="address"
      ></textarea>

      <button onClick={onEditUserSubmit}>Submit</button>
    </div>
  );
};

export default EditUserDetails;
