import React from "react";
function LayoutPanelEmpty(props) {
  return (
    <React.Fragment>
      {/* ============================================================== */}
      {/* Bread crumb and right sidebar toggle */}
      {/* ============================================================== */}

      {/* ============================================================== */}
      {/* End Bread crumb and right sidebar toggle */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* Container fluid  */}
      {/* ============================================================== */}
      <div className="container-fluid">
        {/* ============================================================== */}
        {/* Start Page Content */}
        {/* ============================================================== */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-outline-secondary border border-maroon">
              <div className="card-header">
                <div className="pull-left">
                  <h3>
                    {props.titulo_panel
                      ? props.titulo_panel
                      : "Formulario de registro"}
                  </h3>
                </div>
                <div className="pull-right">{props.tools}</div>
              </div>
              <div className="card-body">{props.children}</div>

              {props.buttons ? (
                <div className="card-footer text-center">{props.buttons}</div>
              ) : null}
            </div>
          </div>
        </div>
        {/* ============================================================== */}
        {/* End PAge Content */}
        {/* ============================================================== */}
        {/* ============================================================== */}
      </div>
      {/* ============================================================== */}
      {/* End Container fluid  */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* footer */}
      {/* ============================================================== */}
    </React.Fragment>
  );
}
export default LayoutPanelEmpty;
