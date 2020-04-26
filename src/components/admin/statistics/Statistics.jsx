import React from "react";
import { useState, useEffect } from "react";
import { userCall, parseBlob, getToken } from "../../../utils/ApiUtils";
import { SERVER_API } from "../../../config";
import { Button, Loader, Message } from "semantic-ui-react";
import _ from "lodash";
import {Default} from 'react-spinners-css'
import { Log } from "../../../utils/LogUtil";
import ExportData from './ExportData'

const boxStyle = {
  height: "100px",
  width: "200px",
  backgroundColor: "rgb(236,236,236)",
  display: "block",
  flexDirection: "column",
  justitfyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
  marginLeft:'10px',
  marginTop: '10px',
  marginBottom:'10px'
};
const headerStyle = {
  color: "rgb(57,137,204)",
  fontSize: 20,
  fontWeight: "900",
  width: '200px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign:'center',
  fontFamily:'Tahoma, Geneva, sans-serif',
  marginTop:'5px'
};
const contentStyle = {
  color: "rgb(133,188,111)",
  fontSize: 30,
  fontWeight: "900",
  textAlign:'center',
};

function Box({ title, content }) {
  return (
    <div style={boxStyle}>
      <h1 style={headerStyle}>{title}</h1>
      {
          _.isNumber(content)?(<h1 style={contentStyle}>{content}</h1>):( <div style={contentStyle}><Default /></div>) 
      }
    </div>
  );
}
let timeout = 0;
function Statistics() {
  const [statistic, setStatistic] = useState({});
  const [error, setError] = useState(null);
  const [doingCount, setDoingCount] = useState(null);

  useEffect(() => {
    userCall(
      "GET",
      `${SERVER_API}/statistic`,
      (data) => setStatistic(data),
      setErrorTimeOut,
      setErrorTimeOut,
      () => {}
    );
    userCall(
      "GET",
      `${SERVER_API}/exams?status=doing`,
      (data) => setDoingCount(data.doingCount),
      setErrorTimeOut,
      setErrorTimeOut,
      () => {}
    );
    return ()=>{
        clearTimeout(timeout)
        Log('Clean up time out')
    }
  }, []);
  const setErrorTimeOut = (err) => {
    setError(err);
    timeout = setTimeout(() => setError(null), 3000);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        minHeight: "60vh"
      }}
    >
      <Message error hidden={error === null} content={error} />
      <div style={{ flexDirection: "row" , display:'flex', justifyContent:'center', flex:'1 0 auto', flexWrap:'wrap'}}>
        <Box title={"Đang làm bài"} content={doingCount} />
        <Box title={"Số đề thi"} content={statistic.examCount} />
        <Box title={"Số bài giảng"} content={statistic.lectureCount} />
        <Box title={"Số lượt làm bài"} content={statistic.answerCount} />
        <Box title={"Số người dùng"} content={statistic.userCount} />
      </div>
      <ExportData />
    </div>
  );
}

export default Statistics;
