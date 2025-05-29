import { useState } from "react";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Title from "../../components/common/Title";
import Loader from "../../components/common/Loader";

const ProductionPlaning = () => {
  const [loading, setLoading] = useState(false);
  const planMonthOptions = [
    { label: "January", value: "january" },
    { label: "February", value: "february" },
    { label: "March", value: "march" },
    { label: "April", value: "april" },
    { label: "May", value: "may" },
    { label: "June", value: "june" },
    { label: "July", value: "july" },
    { label: "August", value: "august" },
    { label: "September", value: "september" },
    { label: "October", value: "october" },
    { label: "November", value: "november" },
    { label: "December", value: "december" },
  ];

  const [selectedPlanMonth, setSelectedPlanMonth] = useState(
    planMonthOptions[0]
  );
  const planOptions = [
    { label: "FG Label", value: "fglabel" },
    { label: "Forming Barcode", value: "formingbarcode" },
  ];
  const [selectedPlan, setSelectedPlan] = useState(planOptions[0]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="Production Planing" align="center" />
      {/* Filters Section */}
      <div className="flex gap-2">
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <SelectField
                label="Model Name"
                // options={modelNames}
                // value={selectedModel?.value || ""}
                // onChange={(e) =>
                //   setSelectedModel(
                //     modelNames.find((opt) => opt.value === e.target.value) || 0
                //   )
                // }
                className="max-w-64"
              />
              <SelectField
                label="Plan Month"
                options={planMonthOptions}
                value={selectedPlanMonth?.value || ""}
                onChange={(e) => {
                  const selected = planMonthOptions.find(
                    (opt) => opt.value === e.target.value
                  );
                  if (selected) {
                    setSelectedPlanMonth(selected);
                  }
                }}
                className="max-w-64"
              />
            </div>
            <div className="flex flex-col gap-2">
              <InputField
                label="Add Quantity"
                type="text"
                placeholder="Enter Quantity"
                className="max-w-64"
              />
              <InputField
                label="Remark"
                type="text"
                placeholder="Enter Remark"
                className="max-w-64"
              />
            </div>
          </div>
        </div>
        <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
          <SelectField
            label="Select Plan"
            options={planOptions}
            value={selectedPlan?.value || ""}
            onChange={(e) => {
              const selected = planOptions.find(
                (opt) => opt.value === e.target.value
              );
              if (selected) {
                setSelectedPlan(selected);
              }
            }}
            className="max-w-64"
          />
          <div className="flex items-center gap-4 mt-4">
            <Button
              bgColor={loading ? "bg-gray-400" : "bg-green-500"}
              textColor={loading ? "text-white" : "text-black"}
              className={`font-semibold ${loading ? "cursor-not-allowed" : ""}`}
              // onClick={() => handleAddFg()}
              disabled={loading}
            >
              Search
            </Button>
            <Button
              bgColor="bg-yellow-300"
              textColor="text-black"
              className="font-semibold hover:bg-yellow-400"
              // onClick={() => handleUpdateModelName()}
            >
              Update
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md">
        <div className="w-full bg-white border border-gray-300 rounded-md p-4">
          {/* Data Table */}
          {loading ? (
            <Loader />
          ) : (
            <div className="w-full max-h-[600px] overflow-x-auto">
              <table className="min-w-full border bg-white text-xs text-left rounded-lg table-auto">
                <thead className="bg-gray-200 sticky top-0 z-10 text-center">
                  <tr>
                    <th className="px-1 py-1 border min-w-[120px]">Plan No.</th>
                    <th className="px-1 py-1 border min-w-[120px]">
                      Plan Month Year
                    </th>
                    <th className="px-1 py-1 border min-w-[120px]">Name</th>
                    <th className="px-1 py-1 border min-w-[120px]">Plan Qty</th>
                    <th className="px-1 py-1 border min-w-[120px]">
                      Print Lbl
                    </th>
                    <th className="px-1 py-1 border min-w-[120px]">
                      Plan Type
                    </th>
                    <th className="px-1 py-1 border min-w-[120px]">Remark</th>
                    <th className="px-1 py-1 border min-w-[120px]">
                      User Name
                    </th>
                    <th className="px-1 py-1 border min-w-[120px]">
                      Created On
                    </th>
                    <th className="px-1 py-1 border min-w-[120px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {traceabilityData.length > 0 ? (
                    traceabilityData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100 text-center">
                        <td className="px-1 py-1 border">{item.PSNo}</td>
                        <td className="px-1 py-1 border">{item.Model_Name}</td>
                        <td className="px-1 py-1 border">
                          {item.Reference_Barcode}
                        </td>
                        <td className="px-1 py-1 border">
                          {item.Component_Serial_Number}
                        </td>
                        <td className="px-1 py-1 border">
                          {item.Component_Name}
                        </td>
                        <td className="px-1 py-1 border">
                          {item.Component_Type}
                        </td>
                        <td className="px-1 py-1 border">
                          {item.Supplier_Name}
                        </td>
                        <td className="px-1 py-1 border">
                          {item.ScannedOn &&
                            item.ScannedOn.replace("T", " ").replace("Z", "")}
                        </td>
                        <td className="px-1 py-1 border">{item.Fg_Sr_No}</td>
                        <td className="px-1 py-1 border">{item.Asset_tag}</td>
                        <td className="px-1 py-1 border">
                          {item.SAP_Item_Code}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-4">
                        No data found.
                      </td>
                    </tr>
                  )} */}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionPlaning;
