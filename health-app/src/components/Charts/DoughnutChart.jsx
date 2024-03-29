import React from "react";
import { Doughnut } from "react-chartjs-2";

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
} from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DoughnutChart ({oxygen}){
  
const data = {
  labels: ['Non oxygen percentage', "Oxygen percentage"],
  datasets: [
    {
      data: [100-oxygen, oxygen],
      // backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      backgroundColor: ["#303030", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#303030", "#36A2EB", "#FFCE56"],
      borderWidth: 2
    }
  ]
};

  return <Doughnut data={data} />;
}
