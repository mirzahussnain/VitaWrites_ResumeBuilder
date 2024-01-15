import React from "react";
import { Route, Routes } from "react-router-dom";
import { TemplatesData } from "../utils/helpers";

const EditResume = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start py-4">
      <Routes>
        {TemplatesData.map((template, index) => (
          <Route
            key={`${template?._id}-${index}`}
            path={`/${template.name}`}
            Component={template.component}
          />
        ))}
      </Routes>
    </div>
  );
};

export default EditResume;
