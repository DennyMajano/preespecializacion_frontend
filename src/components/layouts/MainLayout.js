import React from "react";
import Header from "../template/Header";
import Footer from "../template/Footer";
import PublicRoute from "../../config/routers/PublicRoute";

function MainLayout(props) {
  return (
    <React.Fragment>
      <div className="fix-sidebar fix-header card-no-border">
        <div id="main-wrapper">
          {/* ============================================================== */}
          {/* Page wrapper  */}
          {/* ============================================================== */}
          <PublicRoute exact key="header" path="/*" component={Header} />

          <div className="page-wrapper">
            {props.children}

            <PublicRoute exact key="footer" path="/*" component={Footer} />

            {/* ============================================================== */}
            {/* End footer */}
            {/* ============================================================== */}
          </div>
          {/* ============================================================== */}
          {/* End Page wrapper  */}
          {/* ============================================================== */}
        </div>
      </div>

      {/* {!Encryption.getSession("token") ? <div> {props.children}</div> : null} */}
    </React.Fragment>
  );
}

export default MainLayout;
