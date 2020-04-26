import React from "react";
import { Line } from "react-chartjs-2";
import { useEffect } from "react";
import { useState } from "react";
import { userCall, QueryString } from "../../../utils/ApiUtils";
import _ from "lodash";
import { Log } from "../../../utils/LogUtil";
import { SERVER_API } from "../../../config";
import moment from "moment";

function createData(data, label) {
  return {
    labels: label,
    datasets: [
      {
        label: "Số lượt làm bài",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointRadius:5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHitRadius: 10,
        data: data,
      },
    ],
  };
}
function Graph({ start, end }) {
  const [graphLabel, setGraphLabel] = useState([]);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const queryString = new QueryString();
    queryString.put("start", start);
    queryString.put("end", end);
    userCall(
      "GET",
      `${SERVER_API}/statistic/date${queryString.get()}`,
      ({ answerByDateCount }) => {
        const label = answerByDateCount.map(
          ({ _id }) => `${_id.day}/${_id.month}/${_id.year}`
        );
        setGraphLabel(label);
        const value = answerByDateCount.map((item) => item.count);
        setGraphData(value);
      },
      (err) => Log(err),
      (err) => Log(err),
      () => {}
    );
    Log("effect run")
  }, [start, end]);
  const data = createData(graphData,graphLabel)
  Log(data);
  return <Line data={data} />;
}

export default function LineChart({ title, start, end }) {
  return (
    <div>
      <h2>{title}</h2>
      <Graph start={start} end={end} />
    </div>
  );
}
