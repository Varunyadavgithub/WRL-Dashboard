import React from "react";
import Title from "../../components/common/Title";

const FgReport = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Finished Goods Report"
        subTitle="This report provides a detailed overview of finished goods produced, including quantities, quality assessments, and production timelines."
        align="center"
      />
    </div>
  );
};

export default FgReport;
