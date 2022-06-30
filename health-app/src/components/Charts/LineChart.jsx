import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({ heartrate, labels, timestamp }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: timestamp,
      },
    },
  };
  const data = {
    labels: [...labels],
    datasets: [
      {
        label: "Dataset 1",
        data: [...heartrate],
        borderColor: "#36A2EB",
        backgroundColor: "rgb(48,48,48)",
      },
    ],
  };
  

  return <Line options={options} data={data} />;
}
