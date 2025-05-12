import { Bar } from "react-chartjs-2";

const LineHourlyReportCharts = ({ tableConfigurations, lineType }) => {
  // Helper function to get chart color
  const getChartColor = (title) => {
    const colorMap = {
      "Final Freezer": "rgba(54, 162, 235, 0.6)",
      "Final Choc": "rgba(255, 99, 132, 0.6)",
      "Final SUS": "rgba(75, 192, 192, 0.6)",
      "Freezer A": "rgba(255, 206, 86, 0.6)",
      "Freezer B": "rgba(153, 102, 255, 0.6)",
      SUS: "rgba(255, 159, 64, 0.6)",
      "Category Count": "rgba(99, 255, 132, 0.6)",
    };

    return colorMap[title] || "rgba(54, 162, 235, 0.6)";
  };

  // Prepare chart data
  const prepareChartData = (data, title) => {
    // Handle category count differently
    const isCategory = title === "Category Count";

    const chartData = {
      labels: isCategory
        ? data.map((item) => item.Category)
        : data.map((item) => `Hour ${item.TIMEHOUR}`),
      datasets: [
        {
          label: isCategory ? "Category Count" : "Hourly Count",
          data: data.map((item) => item.COUNT || item.Count || 0),
          backgroundColor: getChartColor(title),
          borderRadius: 5,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(
            ...data.map((item) => item.COUNT || item.Count || 0),
            100
          ),
        },
      },
    };

    return { chartData, chartOptions };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {tableConfigurations[lineType].tables.map((table, index) => {
        // Skip rendering if no data
        if (!table.data || table.data.length === 0) return null;

        const { chartData, chartOptions } = prepareChartData(
          table.data,
          table.title
        );

        return (
          <div
            key={index}
            className="bg-white p-4 rounded shadow"
            style={{ height: "300px" }}
          >
            <h4 className="text-center font-semibold mb-2">
              {table.title} Chart
            </h4>
            <Bar data={chartData} options={chartOptions} />
          </div>
        );
      })}
    </div>
  );
};

export default LineHourlyReportCharts;
