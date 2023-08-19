import React from "react";
import { SectionIntro } from "~/components/shared/SectionIntro";

const AdminHome = () => {
  return (
    <>
      <SectionIntro
        eyebrow="Admin"
        title="Dashboard"
        className="mt-4 sm:mt-6 lg:mt-8"
      >
        <div className="flex w-full flex-col justify-between md:flex-row">
          <p>Control panel for managing RKS Machinery.</p>
        </div>
      </SectionIntro>
    </>
  );
};

export default AdminHome;
