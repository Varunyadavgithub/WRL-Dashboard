import React from "react";
import Title from "../../components/common/Title";

const ComponentDetails = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg">
      <Title
        title="Component Details"
        subTitle="This report provides detailed information about the components used in the production process, including specifications, suppliers, and usage statistics."
        align="center"
      />
    </div>
  );
};

export default ComponentDetails;
