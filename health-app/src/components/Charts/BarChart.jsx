import React from "react";
import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement
  } from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );

export default function BarChart ({hrv}){
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: 'dog',
          },
        },
      };

    const data = {
      labels: ['HRV Value (ms)'],
      datasets: [
        {
          data: [hrv],
          backgroundColor: ["#303030", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#303030", "#36A2EB", "#FFCE56"],
          borderWidth: 1,
          barPercentage: 0.4,
        }
      ],
    };
      return <Bar data={data} />;
    }