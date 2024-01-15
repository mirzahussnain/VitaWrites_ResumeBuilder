import React from "react";
import { Filters, Loader, TemplatePin } from "../components";
import useTemplate from "./../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";

const Home = () => {
  const { data: templates, isError, isLoading, refetch } = useTemplate();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
      {/* filter section */}
      <Filters />
      {/* Render those template - Resume PIN */}
      {isError ? (
        <React.Fragment>
          <p className="text-lg text-txtDark">
            Something went wrong...Please try again later.
          </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
          2xl:grid-cols-4 gap-2"
          >
            <RenderTemplate templates={templates} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 ? (
        <AnimatePresence>
          {templates &&
            templates.map((template, index) => (
              <TemplatePin key={template?._id} data={template} index={index} />
            ))}
        </AnimatePresence>
      ) : (
        <React.Fragment>
          <p>No Data found.</p>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Home;
