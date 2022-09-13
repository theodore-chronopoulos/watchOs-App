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

export default function MultipleLineChart({heartrate,lower,upper,labels }) {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
        },
      },
    };
    const lower_array = [];
    const upper_arrray = [];
    for(let i=0; i<heartrate.length; i++){
      lower_array.push(lower);
      upper_arrray.push(upper);
    }
    const data = {
      labels: [...labels],
      datasets: [
        {
          label: "Last Measurement",
          data: [...heartrate],
          borderColor: "#36A2EB",
          backgroundColor: "rgb(48,48,48)",
        },
        {
          label: "Lower Limit",
          data: [...lower_array],
          borderColor: "rgb(255,0,0)",
          backgroundColor: "rgb(255,0,0)",
        },
        {
          label: "Upper Limit",
          data: [...upper_arrray],
          borderColor: "rgb(255,0,0)",
          backgroundColor: "rgb(255,0,0)",
        },
      ],
    };
    return <Line options={options} data={data} />;
  }