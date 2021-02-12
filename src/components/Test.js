import React, { Component } from "react";
import LayoutPanelTable from "./layouts/panels/LayoutPanelTable";

export default class Test extends Component {
  render() {
    return (
      <div>
        <LayoutPanelTable titulo="Administración de módulos">
          <h1>prueba</h1>
        </LayoutPanelTable>
      </div>
    );
  }
}
