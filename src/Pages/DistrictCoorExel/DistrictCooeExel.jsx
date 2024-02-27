import React, { useEffect, useState } from "react";
import "./DistrictCoorExel.css";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { SpinnerDotted } from "spinners-react";
import { APIS, headers } from "../../data/header";
const DistrictCooeExel = () => {
  const UUU = useSelector((state) => state.authReducer.authData);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoader(true);
    APIS.get(`/district/exeldata/${UUU?.district}`, {
      headers: headers,
    })
      .then((res) => {
        setLoader(false);
        setData(res.data);
      })
      .catch((e) => {
        console.log(e?.response?.data?.msg);
      });
  }, []);

  const onExelDownload = (e) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "electionData" + ".xlsx");
  };

  return (
    <>
      {loader ? (
        <div
          style={{
            width: "100%",
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SpinnerDotted
            size={50}
            thickness={100}
            speed={100}
            color="#36ad47"
          />
        </div>
      ) : (
        <div className="dist-exel-main">
          <div className="exel-data-main">
            <div className="main-exel-table-parent">
              <div className="exel-table-header">
                <span>State</span>
                <span>District</span>
                <span>Locations</span>
                <span>PS No</span>
                <span>Mandal</span>
                <span>PS Address</span>
                <span>Assign</span>
                <span>Employee Name</span>
                <span>Phone</span>
              </div>
              <div className="table__body__card">
                {data?.map((each, key) => (
                  <div key={key} className="table__inner__body">
                    <span>{each.State}</span>
                    <span>{each.District}</span>
                    <span>{each.Location}</span>
                    <span>{each.PS_No}</span>
                    <span>{each.Mandal}</span>
                    <span>{each.PS_Name_and_Address}</span>
                    <span>{each.eassign}</span>
                    <span>{each.name}</span>
                    <span>{each.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="exel-download-btn-card">
        <button onClick={onExelDownload}>DownLoad Exel</button>
      </div>
    </>
  );
};

export default DistrictCooeExel;
