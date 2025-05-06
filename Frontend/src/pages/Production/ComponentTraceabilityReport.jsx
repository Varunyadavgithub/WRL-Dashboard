import React from "react";
import Title from "../../components/common/Title";
import Button from "../../components/common/Button";
import SelectField from "../../components/common/SelectField";

const ComponentTraceabilityReport = () => {
  const variants = [
    { label: "Variant A", value: "variant-a" },
    { label: "Variant B", value: "variant-b" },
    { label: "Variant C", value: "variant-c" },
  ];
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Component Traceability Report"
        subTitle="This report provides a detailed traceability of components used in the production process, ensuring quality and compliance."
        align="center"
      />

      {/* Filters Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField label="Model Variant" options={variants} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block font-semibold mb-1">Start Time</label>
            <input
              type="datetime-local"
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Time</label>
            <input
              type="datetime-local"
              className="w-full p-1 border rounded-md"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-wrap items-end gap-2 mt-4 w-full">
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Query clicked")}
            >
              Query
            </Button>
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold"
              onClick={() => console.log("Export clicked")}
            >
              Export
            </Button>
            {/* Count */}
            <div className="mt-4 text-left font-bold text-lg">
              COUNT: <span className="text-blue-700">000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="bg-white border border-gray-300 rounded-md p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Table 1 */}
            {/* <div className="overflow-x-auto mt-6">
              <table className="min-w-full border text-left bg-white rounded-lg">
                <thead className="text-center">
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">Model_Name</th>
                    <th className="px-4 py-2 border">PSNO</th>
                    <th className="px-4 py-2 border">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">Model_01</td>
                      <td className="px-4 py-2 border">201</td>
                      <td className="px-4 py-2 border">201</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}

            {/* Table 2 */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-left bg-white rounded-lg">
                <thead className="text-center">
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">SAP_PO</th>
                    <th className="px-4 py-2 border">PS_No.</th>
                    <th className="px-4 py-2 border">Model_Name</th>
                    <th className="px-4 py-2 border">Reference Barcode</th>
                    <th className="px-4 py-2 border">Component Serial No.</th>
                    <th className="px-4 py-2 border">Component Name</th>
                    <th className="px-4 py-2 border">Component Type</th>
                    <th className="px-4 py-2 border">Supplier_Name</th>
                    <th className="px-4 py-2 border">Scanned On</th>
                    <th className="px-4 py-2 border">Fg Sr. No.</th>
                    <th className="px-4 py-2 border">Asset tag</th>
                    <th className="px-4 py-2 border">SAP Item Code</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                      <td className="px-4 py-2 border">N/A</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentTraceabilityReport;
