import React, { useState } from "react";
import Button from "../../components/common/Button";
import ExportButton from "../../components/common/ExportButton";
import Title from "../../components/common/Title";
import InputField from "../../components/common/InputField";
import DateTimePicker from "../../components/common/DateTimePicker";

const FGCasting = () => {
  const [loading, setLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [date, setDate] = useState("");

  const handleClearFilters = () => {};

  const handleQuery = () => {
    console.log("Clicked");
  };         

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title title="FG Casting" align="center" />

      {/* Filters */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 rounded-md flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <InputField
            label="Serial Number"
            type="text"
            placeholder="Enter Serial Number"
            className="max-w-4xl"
          />
          <div className="flex items-center justify-center gap-4">
            <Button
              bgColor={loading ? "bg-gray-400" : "bg-blue-500"}
              textColor={loading ? "text-white" : "text-black"}
              className={`font-semibold ${loading ? "cursor-not-allowed" : ""}`}
              onClick={console.log("k")}
              disabled={loading}
            >
              Query
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-center my-4">
            <Button
              bgColor="bg-white"
              textColor="text-black"
              className="border border-gray-400 hover:bg-gray-100 px-3 py-1"
              onClick={handleClearFilters}
            >
              Clear Filter
            </Button>
            <ExportButton />
          </div>
        </div>

        {/* Second Row */}
        <div className="w-full">
          <fieldset className="border border-black p-4 rounded-md">
            <legend className="font-semibold text-gray-700 px-2">
              Casting Details
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Column 1 */}
              <div className="flex flex-col gap-4">
                <InputField
                  label="Vehicle No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="vehicleNo"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
                <InputField
                  label="Lr No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="lrNo"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-4">
                <InputField
                  label="Transporter"
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="transporter"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
                <InputField
                  label="Location"
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="location"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-4">
                <InputField
                  label="Seal No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="sealNo"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
                <InputField
                  label="Driver Ph. No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="driverPhNo"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-4">
                <InputField
                  label="Invoice No."
                  type="text"
                  placeholder="Enter details"
                  className="w-full"
                  name="invoiceNo"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
                <DateTimePicker
                  label="Date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-purple-100 border border-dashed border-purple-400 p-4 mt-4 rounded-md"></div>
    </div>
  );
};

export default FGCasting;
