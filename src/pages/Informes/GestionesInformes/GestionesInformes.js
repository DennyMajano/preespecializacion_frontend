import React, { Component } from "react";
import LayoutPanelTable from "../../../components/layouts/panels/LayoutPanelTable";
import { Tabs, Tab } from "react-bootstrap";
import LayoutPanelEmpty from "../../../components/layouts/panels/LayoutPanelEmpty";
import Request from "../../../services/Request";
import HTTP from "../../../helpers/HTTP";
import Alerts from "../../../services/Alerts";
export default class GestionesInformes extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
  }

  inicial_state = {
    tab_active: "gestion_activa",
    gestiones_nopublicadas: [],
    gestiones_publicadas: [],
  };
  async handleChangeTab(key) {
    await this.setState({ tab_active: key });

    if (key === "periodos_cogestion_activanfigurando") {
    } else if (key === "gestiones_inactivas") {
      this.getGestionesNoPublicadas();
    }
  }
  componentDidMount() {
    this.getGestionesNoPublicadas();
    this.getGestionesPublicadas();
  }

  actualizar(id) {
    this.props.history.push(
      `/informes_mensuales/gestiones_entrega/update/${id}`
    );
  }
  asignacion(id) {
    this.props.history.push(
      `/informes_mensuales/gestiones_entrega/asignacion_informes/${id}`
    );
  }

  asignados(id) {
    this.props.history.push(
      `/informes_mensuales/gestiones_entrega/asignados/${id}`
    );
  }
  getGestionesNoPublicadas() {
    HTTP.findAll("gestiones/inactivas").then((result) => {
      if (result !== false) {
        this.setState({ gestiones_nopublicadas: result });
      }
    });
  }
  getGestionesPublicadas() {
    HTTP.findAll("gestiones/activas").then((result) => {
      if (result !== false) {
        this.setState({ gestiones_publicadas: result });
      }
    });
  }
  delete(codigo) {
    const data = {
      codigoGestion: codigo,
    };
    HTTP.delete_disable(
      data,
      "gestión de informe",
      "gestiones de informe",
      "gestion"
    ).then((result) => {
      if (result !== false) {
        this.getGestionesNoPublicadas();
      }
    });
  }
  Publicar(codigo) {
    Alerts.QuestionYesNo(
      "¿Está seguro que desea publicar la gestión?",
      "Administración de gestiones de informe",
      "question"
    ).then((resp) => {
      if (resp) {
        const data = {
          codigoGestion: codigo,
        };
        Alerts.loading_reload(true);
        Request.PUT("gestion/publicar", data).then((result) => {
          Alerts.loading_reload(false);
          if (result !== false) {
            if (result.status === 200) {
              Alerts.alertEmpty(
                "¡Gestión publicada con éxito",
                "Administración de gestiones de informe",
                "success"
              );
              this.getGestionesNoPublicadas();
              this.getGestionesPublicadas();
              this.setState({
                tab_active: "gestion_activa",
              });
            } else {
              Alerts.alertEmpty(
                "¡No se pudo publicar",
                "Administración de gestiones de informe",
                "error"
              );
            }
          } else {
            Alerts.alertEmpty(
              "¡No se pudo publicar",
              "Administración de gestiones de informe",
              "error"
            );
          }
        });
      }
    });
  }
  finalizar(codigo) {
    Alerts.QuestionYesNo(
      "¿Está seguro que desea finalizar la gestión?",
      "Administración de gestiones de informe",
      "question"
    ).then((resp) => {
      if (resp) {
        const data = {
          codigoGestion: codigo,
        };
        Alerts.loading_reload(true);
        Request.PUT("gestion/cerrar", data).then((result) => {
          Alerts.loading_reload(false);
          if (result !== false) {
            if (result.status === 200) {
              Alerts.alertEmpty(
                "¡Gestión finalizada con éxito",
                "Administración de gestiones de informe",
                "success"
              );

              this.getGestionesPublicadas();
              this.setState({
                tab_active: "gestion_activa",
              });
            } else {
              Alerts.alertEmpty(
                "¡No se pudo finalizar",
                "Administración de gestiones de informe",
                "error"
              );
            }
          } else {
            Alerts.alertEmpty(
              "¡No se pudo finalizar",
              "Administración de gestiones de informe",
              "error"
            );
          }
        });
      }
    });
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
                  <Tab eventKey="gestion_activa" title="Gestiones Activas">
                    <div className="row">
                      <div className="col-lg-12 mt-4 ">
                        {this.state.gestiones_publicadas.length > 0 ? (
                          this.state.gestiones_publicadas.map((element) => {
                            return (
                              <LayoutPanelEmpty
                                titulo_panel={`Gestion: ${element.codigo}`}
                                key={element.id}
                                buttons={
                                  <React.Fragment>
                                    <button
                                      onClick={this.asignados.bind(
                                        this,
                                        element.id
                                      )}
                                      className="btn btn-outline-info mr-2"
                                    >
                                      <i className="fa fa-file-text-o mr-2"></i>
                                      Ver Informes Gestión
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-inverse"
                                      onClick={this.finalizar.bind(
                                        this,
                                        element.codigo
                                      )}
                                    >
                                      <i className="fa fa-close"></i> Finalizar
                                    </button>
                                  </React.Fragment>
                                }
                              >
                                <div className="row">
                                  <div className="col-lg-12">
                                    <div className="table-responsive">
                                      <table className="table table-bordered table-bordered-table color-bordered-table muted-bordered-table">
                                        <thead>
                                          <tr>
                                            <th className="text-center">
                                              Tipo Gestión
                                            </th>
                                            <th className="text-center">
                                              Descripción
                                            </th>
                                            <th className="text-center">
                                              Fecha Publicación
                                            </th>
                                            <th className="text-center">
                                              Fecha Inicio
                                            </th>
                                            <th className="text-center">
                                              Fecha Fin
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>{element.tipo_gestion_name}</td>
                                            <td>{element.descripcion}</td>
                                            <td>{element.fecha_publicacion}</td>
                                            <td>
                                              {element.fecha_recibir_inicio}
                                            </td>
                                            <td>{element.fecha_recibir_fin}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </LayoutPanelEmpty>
                            );
                          })
                        ) : (
                          <div className="col-lg-12 ">
                            <h3>NO HAY NADA</h3>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="gestiones_inactivas"
                    title="Gestiones no publicadas"
                  >
                    <div className="row">
                      <div className="col-lg-12 mt-4 ">
                        {this.state.gestiones_nopublicadas.length > 0 ? (
                          this.state.gestiones_nopublicadas.map((element) => {
                            return (
                              <LayoutPanelEmpty
                                key={element.id}
                                titulo_panel={`Gestion: ${element.codigo}`}
                                buttons={
                                  <React.Fragment>
                                    <button
                                      onClick={this.actualizar.bind(
                                        this,
                                        element.id
                                      )}
                                      className="btn btn-outline-info mr-2"
                                    >
                                      <i className="fa fa-pencil mr-2"></i>
                                      Actualizar
                                    </button>
                                    <button
                                      onClick={this.asignacion.bind(
                                        this,
                                        element.id
                                      )}
                                      className="btn btn-outline-info mr-2"
                                    >
                                      <i className="fa fa-file-text-o mr-2"></i>
                                      Informes Gestión
                                    </button>
                                    <button
                                      type="button"
                                      onClick={this.Publicar.bind(
                                        this,
                                        element.codigo
                                      )}
                                      className="btn btn-outline-info mr-2"
                                    >
                                      <i className="fa fa-pencil mr-2"></i>
                                      Publicar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={this.delete.bind(
                                        this,
                                        element.codigo
                                      )}
                                      className="btn btn-outline-danger"
                                    >
                                      <i className="fa fa-pencil mr-2"></i>
                                      Eliminar
                                    </button>
                                  </React.Fragment>
                                }
                              >
                                <div className="row">
                                  <div className="col-lg-12 ">
                                    <div className="table-responsive">
                                      <table className="table table-bordered table-bordered-table color-bordered-table muted-bordered-table">
                                        <thead>
                                          <tr>
                                            <th className="text-center">
                                              Tipo Gestión
                                            </th>
                                            <th className="text-center">
                                              Descripción
                                            </th>
                                            <th className="text-center">
                                              Fecha Creación
                                            </th>
                                            <th className="text-center">
                                              Fecha Inicio
                                            </th>
                                            <th className="text-center">
                                              Fecha Fin
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>{element.tipo_gestion_name}</td>
                                            <td>{element.descripcion}</td>
                                            <td>{element.fecha_cr}</td>
                                            <td>
                                              {element.fecha_recibir_inicio}
                                            </td>
                                            <td>{element.fecha_recibir_fin}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </LayoutPanelEmpty>
                            );
                          })
                        ) : (
                          <div className="col-lg-12 ">
                            <h3>No hay nada</h3>
                          </div>
                        )}
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
