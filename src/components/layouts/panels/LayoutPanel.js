import React from "react";
function LayoutPanel(props) {
  return (
    <React.Fragment>
      {/* ============================================================== */}
      {/* Bread crumb and right sidebar toggle */}
      {/* ============================================================== */}
      <div className="row page-titles">
        <div className="col-md-5 align-self-center">
          <h3 className="text-themecolor">{props.titulo}</h3>
        </div>
        <div className="col-md-7 align-self-center">
          {/* <div className="pull-right">
            <button className="btn btn-outline-info mr-2">
              <i className="fa fa-plus mr-2"></i> Nuevo
            </button>
            <button className="btn btn-outline-info mr-2">
              <i className="fa fa-print mr-2"></i> Imprimir
            </button>
          </div> */}
        </div>
        <div></div>
      </div>
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
                {props.children}
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
export default LayoutPanel;
