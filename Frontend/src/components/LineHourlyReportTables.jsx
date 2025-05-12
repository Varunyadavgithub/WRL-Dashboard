
const LineHourlyReportTables = ({ tableConfigurations, lineType }) => {
  // Render individual table
  const renderTable = (title, data) => {
    // Calculate total count
    const totalCount = data && data.reduce(
      (sum, item) => sum + (item.COUNT || item.Count || 0),
      0
    );

    return (
      <div
        key={title}
        className="bg-white p-4 rounded shadow flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="font-semibold text-lg">
            Count: <span className="text-blue-700">{totalCount}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center">
          <div className="overflow-x-auto">
            <table className="min-w-full border text-left bg-white rounded-lg">
              <thead className="text-center">
                <tr className="bg-gray-200">
                  {title !== "Category Count" ? (
                    <>
                      <th className="px-1 py-1 border">Hour No.</th>
                      <th className="px-1 py-1 border">Time Hour</th>
                      <th className="px-1 py-1 border">Count</th>
                    </>
                  ) : (
                    <>
                      <th className="px-1 py-1 border">Category</th>
                      <th className="px-1 py-1 border">Count</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      {title !== "Category Count" ? (
                        <>
                          <td className="px-1 py-1 border">
                            {item.HOUR_NUMBER || "N/A"}
                          </td>
                          <td className="px-1 py-1 border">
                            {item.TIMEHOUR || "N/A"}
                          </td>
                          <td className="px-1 py-1 border">
                            {item.COUNT || "N/A"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-1 py-1 border">
                            {item.Category || "N/A"}
                          </td>
                          <td className="px-1 py-1 border">
                            {item.Count || "N/A"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={title !== "Category Count" ? 3 : 2}
                      className="text-center px-1 py-1 border"
                    >
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tableConfigurations[lineType].tables.map((table) =>
        renderTable(table.title, table.data)
      )}
    </div>
  );
};

export default LineHourlyReportTables;
