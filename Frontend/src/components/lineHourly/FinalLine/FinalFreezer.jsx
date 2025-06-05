import { Bar } from "react-chartjs-2";

const FinalFreezer = ({ title, data }) => {
  const count = data && data.reduce((sum, item) => sum + (item.COUNT || 0), 0);

  const prepareChartData = () => {
    if (!data || data.length === 0) {
      return { chartData: null, chartOptions: null };
    }

    const chartData = {
      labels: data.map((item) => `H ${item.TIMEHOUR}`),
      datasets: [
        {
          label: "Hourly Count",
          data: data.map((item) => item.COUNT || 0),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderRadius: 5,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        onComplete: (animationContext) => {
          const chart = animationContext.chart;
          const ctx = chart.ctx;
          ctx.font = "12px sans-serif";
          ctx.fillStyle = "#000";
          ctx.textAlign = "center";

          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
              const value = dataset.data[index];
              if (value !== null && value !== undefined) {
                ctx.fillText(value, bar.x, bar.y - 6); // Display above bar
              }
            });
          });
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(...data.map((item) => item.COUNT || 0), 0) + 10,
        },
      },
    };

    return { chartData, chartOptions };
  };

  const { chartData, chartOptions } = prepareChartData();
  return (
    <div className="flex flex-col gap-4">
      <div key={title} className="bg-white rounded shadow flex flex-col">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="font-semibold text-lg">
            Count: <span className="text-blue-700">{count}</span>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="overflow-x-auto">
            <table className="min-w-full border text-left bg-white rounded-lg">
              <thead className="text-center">
                <tr className="bg-gray-200">
                  <th className="px-1 py-1 border">Hour No.</th>
                  <th className="px-1 py-1 border">Time Hour</th>
                  <th className="px-1 py-1 border">Count</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100 text-center">
                      <td className="px-1 py-1 border">
                        {item.HOUR_NUMBER || "N/A"}
                      </td>
                      <td className="px-1 py-1 border">
                        {item.TIMEHOUR || "N/A"}
                      </td>
                      <td className="px-1 py-1 border">
                        {item.COUNT || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center px-1 py-1 border">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {chartData && (
        <div
          className="bg-white p-4 rounded shadow"
          style={{ height: "300px" }}
        >
          <h4 className="text-center font-semibold mb-2">{title} Chart</h4>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default FinalFreezer;
