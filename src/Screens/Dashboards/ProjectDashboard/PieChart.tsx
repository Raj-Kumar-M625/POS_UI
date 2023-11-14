import Chart from "react-apexcharts";

export const PieChart = ({ props }: any) => {
  const options: any = {
    labels: Object.keys(props).sort() as string[],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
            },
          },
        },
      },
    },
  };
  const series = Object.values(props) as number[];
  return (
    <div className="donut">
      <Chart options={options} series={series} type="donut" width="350" />
    </div>
  );
};
