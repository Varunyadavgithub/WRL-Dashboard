import React from "react";
import Title from "../../components/common/Title";

const ComponentTraceabilityReport = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Component Traceability Report"
        subTitle="This report provides a detailed traceability of components used in the production process, ensuring quality and compliance."
        align="center"
      />
    </div>
  );
};

export default ComponentTraceabilityReport;
