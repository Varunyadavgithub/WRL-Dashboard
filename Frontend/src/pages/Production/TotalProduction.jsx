import React from "react";
import Title from "../../components/common/Title";

const TotalProduction = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Total Production"
        subTitle="This report provides a comprehensive overview of the total production output, including quantities produced, production rates, and any discrepancies or issues encountered during the production process."
        align="center"
      />
    </div>
  );
};

export default TotalProduction;
