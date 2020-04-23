import React from "react";
import { useState, useEffect } from "react";
import { userCall, parseBlob, getToken } from "../../../utils/ApiUtils";
import { SERVER_API } from "../../../config";
import { Button, Loader, Message } from "semantic-ui-react";
import fileDownload from "js-file-download";
import Axios from "axios";
import _ from "lodash";
import {Default} from 'react-spinners-css'
import { Log } from "../../../utils/LogUtil";

const boxStyle = {
  height: "150px",
  width: "250px",
  backgroundColor: "rgb(236,236,236)",
  display: "flex",
  flexDirection: "column",
  justitfyContent: "space-between",
  alignItems: "center",
  borderRadius: "5px",
  marginLeft:'10px',
  marginTop: '10px',
  marginBottom:'10px'
};
const headerStyle = {
  color: "rgb(57,137,204)",
  fontSize: 24,
  fontWeight: "900",
  width: '240px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign:'center',
  fontFamily:'Tahoma, Geneva, sans-serif',
  marginTop:'5px'
};
const contentStyle = {
  color: "rgb(133,188,111)",
  fontSize: 45,
  fontWeight: "900",
  alignSelf: "center",
};

function Box({ title, content }) {
  return (
    <div style={boxStyle}>
      <h1 style={headerStyle}>{title}</h1>
      {
          _.isNumber(content)?(<h1 style={contentStyle}>{content}</h1>):( <Default />) 
      }
    </div>
  );
}
let timeout = 0;
function Statistics() {
  const [statistic, setStatistic] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
  const getAnswerExport = () => {
    setLoading(true);
    Axios.get(`${SERVER_API}/answers/export`, {
      headers: {
        Authorization: getToken(),
      },
      responseType: "blob",
    })
      .then((res) => {
        if (res.data.type === "application/json") {
          parseBlob(res.data, ({ message }) => {
            setErrorTimeOut(message);
          });
        } else {
          let blob = new Blob([res.data], {
            type: res.headers["content-type"],
          });
          fileDownload(blob, "Thong ke bai lam toan he thong.xlsx");
        }
      })
      .catch(setErrorTimeOut)
      .finally(() => setLoading(false));
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        minHeight: "30vh"
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
      <Button size='massive' basic color="green" icon="download" onClick={getAnswerExport} content='Xuất bài làm toàn bộ hệ thống' />
      <Loader active={loading} />
    </div>
  );
}

export default Statistics;
