import React, { useState } from "react";
import { useEffect } from "react";
import fileDownload from "js-file-download";
import Axios from "axios";
import { parseBlob, getToken } from "../../../utils/ApiUtils";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { SERVER_API } from "../../../config";
import { Button, Loader, Container, Header, Message } from "semantic-ui-react";
import moment from "moment";
import LineChart from "./LineChart";
import { Log } from "../../../utils/LogUtil";

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

let timeOut = null;

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <Button primary onClick={onClick}>
    {value}
  </Button>
));

function ExportData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(endDate.addDays(-30));

  useEffect(() => {}, []);

  function setErrorTimeOut(error) {
    setError(error);
    timeOut = setTimeout(() => setError(null), 3000);
  }

  const getAnswerExport = () => {
    setLoading(true);
    const start = moment(startDate).format("YYYY-MM-DD");
    const end = moment(endDate).format("YYYY-MM-DD");
    if (startDate >= endDate) {
      setErrorTimeOut("Ngày bắt đầu, ngày kết thúc không hợp lệ!");
      setLoading(false)
      return;
    }
    Log(`${SERVER_API}/answers/export?start=${start}&end=${end}`);
    Axios.get(`${SERVER_API}/answers/export?start=${start}&end=${end}`, {
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
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flex: 1,
        width: "80%"
      }}
    >
      <Header textAlign="center" style={{fontFamily:'Tahoma, Geneva, sans-serif',fontSize:'15pt'}}>Thống kê bài làm toàn bộ hệ thống</Header>
      <Loader active={loading} />
      <Message error hidden={error === null} content={error} />
      <div
        style={{
          marginTop:'30px',
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <span style={{ display: "inline-block" }}>
          <b style={{ marginRight: "5px"}}>Từ ngày:</b>
          <DatePicker
            selected={startDate}
            dateFormat="dd/MM/yyyy"
            onChange={setStartDate}
            customInput={<CustomInput />}
            placeholderText="Từ ngày"
          />
        </span>
        <span style={{ display: "inline-block" }}>
          <b style={{ marginRight: "5px"}}>Đến ngày:</b>
          <DatePicker
            selected={endDate}
            dateFormat="dd/MM/yyyy"
            onChange={setEndDate}
            customInput={<CustomInput />}
          />
        </span>
        <span style={{ display: "inline-block" }}>
          <Button
            size="medium"
            basic
            color="green"
            icon="download"
            content="Tải xuống"
            onClick={getAnswerExport}
          />
        </span>
      </div>
      <LineChart title="" start={moment(startDate).format("YYYY-MM-DD")} end={moment(endDate).format("YYYY-MM-DD")} />
    </Container>
  );
}

export default ExportData;
