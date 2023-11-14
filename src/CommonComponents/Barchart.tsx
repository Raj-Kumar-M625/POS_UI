import { Chart } from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement
);

export const Barchart = () => {
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const labels = ["Rahul", "Suresh", "Suresh", "Suresh", "Suresh"];
  const data1 = {
    labels: labels,
    datasets: [
      {
        label: "Un Assigned Employees",
        data: [5, 10, 15, 20, 25, 30, 35, 40],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <div className="container w-50 border border-3 overflow-scroll">
        <Chart
          type="bar"
          options={options}
          data={data1}
          style={{ overflow: "scroll" }}
        />
      </div>
    </>
  );
};
