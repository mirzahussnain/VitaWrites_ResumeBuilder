import React, { Suspense } from "react";
import { Header, Loader } from "../components";
import { Route, Routes } from "react-router-dom";
import { Home } from "../containers";
import {ManageTemplates, EditResume, TemplateDetails, UserProfile} from "../pages";
const HomeScreen = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* header */}
      <Header />
      {/* custom routes */}
      <main className="w-full h-full">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/templates/manage" element={<ManageTemplates/>}/>
            <Route path="/template/details/:templateId" element={<TemplateDetails/>}/>
            <Route path="/profile/:uid" element={<UserProfile/>}/>
            <Route path="/resume/*" element={<EditResume/>}/>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default HomeScreen;
