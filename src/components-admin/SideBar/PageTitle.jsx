import React from "react";
import NavuserAdmin from "../../components/Navbar/NavuserAdmin";
function PageTitle({ pageTitle }) {
  return (
    <div className="PageTitle">
      <div className="PageTitle-content">
        <p>{pageTitle}</p>
      </div>

      {/* <div className="user-menu-admin"> */}
        <NavuserAdmin />
      {/* </div> */}
    </div>
  );
}

export default PageTitle;
