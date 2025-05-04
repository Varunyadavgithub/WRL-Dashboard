import React from "react";
import Title from "../../components/common/Title";

const StopLossReport = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Stop Loss Report"
        subTitle="This report provides a detailed analysis of stop-loss events in the production process, including reasons for stoppages, duration, and impact on overall efficiency."
        align="center"
      />
    </div>
  );
};

export default StopLossReport;
