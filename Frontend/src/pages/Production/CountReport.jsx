import React from "react";
import Title from "../../components/common/Title";

const CountReport = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Production Count Report"
        subTitle="This report provides a detailed overview of production counts, including quantities produced, efficiency metrics, and quality assessments across all production lines."
        align="center"
      />
    </div>
  );
};

export default CountReport;
