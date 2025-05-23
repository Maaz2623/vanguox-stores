import React from "react";

const MainPage = () => {
  return (
    <div className="min-h-screen bg-white rounded-lg overflow-hidden border flex">
      <LeftSection />
      {/* Right section can go here */}
    </div>
  );
};

export default MainPage;

const LeftSection = () => {
  return <div className="border-r h-full w-[20%]">Left Section</div>;
};
