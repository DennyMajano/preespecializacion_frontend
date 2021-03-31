import React, { Component } from "react";
import LayoutPanelTable from "../../../components/layouts/panels/LayoutPanelTable";
import { Tabs, Tab } from "react-bootstrap";
import LayoutPanelEmpty from "../../../components/layouts/panels/LayoutPanelEmpty";
export default class GestionesInformes extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
  }

  inicial_state = {
    tab_active: "gestion_activa",
  };
  async handleChangeTab(key) {
    await this.setState({ tab_active: key });

    // if (key === "periodos_configurando") {
    //   this.refs.tabla_configurados.clear();
    // } else if (key === "periodos_finalizados") {
    //   this.refs.tabla_finalizados.clear();
    // }
  }
  render() {
    return (
      <React.Fragment>
        <LayoutPanelTable
          titulo="Gestión de informes mensuales"
          rutacreate="/informes_mensuales/gestiones_entrega/new"
        >
          <div className="form-body">
            <div className="row">
              <div className="col-12 form-group ">
                <Tabs
                  activeKey={this.state.tab_active}
                  onSelect={this.handleChangeTab.bind(this)}
                  id="tabas"
                >
                  <Tab eventKey="gestion_activa" title="Gestión Activa">
                    <div className="row">
                      <div className="col-lg-12 mt-4 ">
                        <LayoutPanelEmpty titulo_panel="Gestion: GEST-1245454">
                          <div className="row">
                            <div className="col-lg-12 ">
                              <table className="table table-bordered table-bordered-table color-bordered-table muted-bordered-table">
                                <thead>
                                  <tr>
                                    <th>Tipo Gestión</th>
                                    <th>Descripción</th>
                                    <th>Fecha Publicación</th>
                                    <th>Fecha inicio</th>
                                    <th>Fecha Fin</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Informes de Iglesia</td>
                                    <td>
                                      Informes correspondiente al mes de Marzo
                                      de 2021
                                    </td>
                                    <td>
                                      Domingo, 14 de Marzo de 2021 - 4:35 AM
                                    </td>
                                    <td>Lunes, 15 Marzo de 2021 - 12:00 AM</td>
                                    <td>
                                      Miércoles, 15 Marzo de 2021 - 11:59 PM
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </LayoutPanelEmpty>
                      </div>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="gestiones_configuracion"
                    title="Gestiones no publicadas"
                  >
                    <div className="row">
                      <div className="col-lg-12 mt-4 ">
                        <LayoutPanelEmpty titulo_panel="Gestion: GEST-1245454">
                          <div className="row">
                            <div className="col-lg-12 ">
                              <table className="table table-bordered table-bordered-table color-bordered-table muted-bordered-table">
                                <thead>
                                  <tr>
                                    <th>Tipo Gestión</th>
                                    <th>Descripción</th>
                                    <th>Fecha Creación</th>
                                    <th>Fecha inicio</th>
                                    <th>Fecha Fin</th>
                                    <th>Estado</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Informes de Iglesia</td>
                                    <td>
                                      Informes correspondiente al mes de Abril
                                      de 2021
                                    </td>
                                    <td>
                                      Domingo, 30 de Marzo de 2021 - 4:35 AM
                                    </td>
                                    <td>Jueves, 15 Abril de 2021 - 12:00 AM</td>
                                    <td>
                                      Viernes, 30 Abril de 2021 - 11:59 PM
                                    </td>
                                    <td>No Publicada</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </LayoutPanelEmpty>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </LayoutPanelTable>
      </React.Fragment>
    );
  }
}
