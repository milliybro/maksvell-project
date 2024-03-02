import Chart from "react-apexcharts";

const data = {
  series: [
    {
      name: "",
      data: [10, 15, 16, 20, 15],
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Maksvel taqsimoti grafigi ",
      align: "left",
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
      },
    },
    xaxis: {
      categories: [200, 400, 600, 800, 1000],
    },
  },
};
function ApexLineChart() {
  return (
    <div>
      <Chart
        options={data.options}
        series={data.series}
        type="line"
        height={350}
      />
    </div>
  );
}
export default ApexLineChart;
