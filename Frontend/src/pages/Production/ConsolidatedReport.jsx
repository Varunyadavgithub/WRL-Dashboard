import React from "react";
import Title from "../../components/common/Title";

const ConsolidatedReport = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Consolidated Report"
        subTitle="This report provides a comprehensive overview of production data, including total output, efficiency metrics, and quality assessments across all production lines."
        align="center"
      />
    </div>
  );
};

export default ConsolidatedReport;
