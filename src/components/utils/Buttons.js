import React from "react";

export default function Buttons(props) {
  return (
    <React.Fragment>
      <div className="btn-group">
        <button type="button" className="btn btn-outline-inverse mr-2 ">
          <i className="fa fa-close mr-2"></i>CANCELAR
        </button>

        <button type="submit" className="btn btn-info ">
          <i className="fa fa-save mr-2"></i>GUARDAR
        </button>
      </div>
    </React.Fragment>
  );
}
