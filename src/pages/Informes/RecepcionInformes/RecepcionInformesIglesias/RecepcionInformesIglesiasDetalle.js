import React, { Component } from "react";
import LayoutPanelTable from "../../../../components/layouts/panels/LayoutPanelTable";
import HTTP from "../../../../helpers/HTTP";
import Encrypt from "../../../../services/Encrypt";
import { Tabs, Tab } from "react-bootstrap";
import TablaSearch from "../../../../components/tablas/TablaSearch";
import { Redirect } from "react-router";

export default class RecepcionInformesIglesiasDetalle extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.state.usuario = Encrypt.getSession("codigo_persona");
  }

  inicial_state = {
    usuario: "",
    tab_active: "iglesias_reportadas",
    iglesias_reportadas: [],
    iglesias_pendientes: [],
    gestion: null,
    informe: null,
    cargadas: false,
    redirect: false,
  };
  componentDidMount() {
    this.getGestiones();
    this.getInforme();
    this.getIglesiasReportadas();
    this.getIglesiasPendientes();
  }

  async handleChangeTab(key) {
    await this.setState({ tab_active: key });

    if (key === "iglesias_reportadas") {
      this.getIglesiasReportadas();
    } else if (key === "iglesias_pendientes") {
      this.getIglesiasPendientes();
    }
  }
  getGestiones() {
    HTTP.findById(this.props.match.params.gestion, "gestion").then((result) => {
      if (result !== false) {
        this.setState({
          gestion: result,
        });
      } else {
        this.setState({ redirect: true });
      }
    });
  }

  getIglesiasReportadas() {
    HTTP.findById(
      this.props.match.params.id_informe,
      `gestiones/informes/iglesias/enviados/${this.props.match.params.gestion}`
    ).then((result) => {
      if (result !== false) {
        this.setState({
          iglesias_reportadas: result,
        });
      } else {
        this.setState({ redirect: true });
      }
    });
  }

  getIglesiasPendientes() {
    HTTP.findById(
      this.props.match.params.id_informe,
      `gestiones/informes/iglesias/no_enviados/${this.props.match.params.gestion}`
    ).then((result) => {
      if (result !== false) {
        this.setState({
          iglesias_pendientes: result,
        });
      } else {
        this.setState({ redirect: true });
      }
    });
  }
  getInforme() {
    HTTP.findById(this.props.match.params.id_informe, "maestro_informe").then(
      (result) => {
        if (result !== false) {
          this.setState({
            informe: result,
          });
        } else {
          this.setState({ redirect: true });
        }
      }
    );
  }
  columnsIglesiasReportadas = [
    {
      informe_ide: "id",
      text: "id",
      hidden: true,
    },
    {
      dataField: "codigo",
      text: "Código",
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      informe_ide: "informe_maestro",
      text: "id",
      hidden: true,
    },
    {
      dataField: "identificador",
      text: "id",
      hidden: true,
    },
    {
      dataField: "nombre",
      text: "Nombre Iglesia",

      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "tipo_iglesia",
      text: "Tipo Iglesia",

      formatter: (cellContent, row) => {
        return <p>{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "8%", textAlign: "center" };
      },
    },
    {
      dataField: "telefono",
      text: "Teléfono",

      formatter: (cellContent, row) => {
        if (cellContent !== "" && cellContent !== null) {
          return <p className="text-center">{cellContent}</p>;
        } else {
          return <p className="text-center">N/A</p>;
        }
      },
      headerStyle: () => {
        return { width: "8%", textAlign: "center" };
      },
    },

    {
      dataField: "Opciones",
      text: "Opciones",

      formatter: (cellContent, row) => {
        return (
          <div className="text-center">
            <button type="button" className="btn btn-outline-info mr-2">
              <i className="fa fa-download mr-2"></i>Descargar
            </button>
            <button type="button" className="btn btn-outline-info mr-2">
              <i className="fa fa-print mr-2"></i>Imprimir
            </button>
          </div>
        );
      },
      headerStyle: () => {
        return { width: "25%", textAlign: "center" };
      },
    },
  ];

  columnsIglesiasPendientes = [
    {
      dataField: "codigo",
      text: "Código",
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },

    {
      dataField: "nombre",
      text: "Nombre Iglesia",

      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "tipo_iglesia",
      text: "Tipo Iglesia",

      formatter: (cellContent, row) => {
        return <p>{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "8%", textAlign: "center" };
      },
    },
    {
      dataField: "telefono",
      text: "Teléfono",

      formatter: (cellContent, row) => {
        if (cellContent !== "" && cellContent !== null) {
          return <p className="text-center">{cellContent}</p>;
        } else {
          return <p className="text-center">N/A</p>;
        }
      },
      headerStyle: () => {
        return { width: "8%", textAlign: "center" };
      },
    },

    {
      dataField: "Opciones",
      text: "Opciones",

      formatter: (cellContent, row) => {
        return (
          <div className="text-center">
            <button type="button" className="btn btn-outline-info mr-2">
              <i className="fa fa-send mr-2"></i>Enviar Recordatorio
            </button>
          </div>
        );
      },
      headerStyle: () => {
        return { width: "25%", textAlign: "center" };
      },
    },
  ];
  render() {
    if (this.state.redirect === true) {
      return <Redirect to="/recepcion_informes/iglesia" />;
    }
    return (
      <div>
        <LayoutPanelTable
          titulo="Recepción de informes de Iglesias Locales"
          titulo_panel="Panel de Recepción de Informe"
          buttons={
            <button
              type="button"
              className="btn btn-secondary btn-lg mr-2"
              onClick={() => {
                this.setState({ redirect: true });
              }}
            >
              <i className="fa fa-arrow-left mr-2"></i>Salir
            </button>
          }
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="table-responsive">
                <table className="table table-bordered table-bordered-table color-bordered-table muted-bordered-table">
                  <thead>
                    <tr>
                      <th className="text-center">Descripción Gestión</th>

                      <th className="text-center">Fecha Publicación</th>
                      <th className="text-center">Informe a Recibir</th>
                      <th className="text-center">Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {this.state.gestion !== null
                          ? this.state.gestion.descripcion
                          : "N/A"}
                      </td>
                      <td>
                        {this.state.gestion !== null
                          ? this.state.gestion.fecha_publicacion
                          : "N/A"}
                      </td>

                      <td>
                        {this.state.informe !== null
                          ? this.state.informe.nombre
                          : "N/A"}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-outline-info mr-2"
                        >
                          <i className="fa fa-print mr-2"></i>Imprimir Informe
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-12">
              <Tabs
                activeKey={this.state.tab_active}
                onSelect={this.handleChangeTab.bind(this)}
                id="tabs"
              >
                <Tab
                  eventKey={"iglesias_reportadas"}
                  title={`IGLESIAS REPORTADAS: ${this.state.iglesias_reportadas.length}`}
                >
                  <div className="row">
                    <div className="col-lg-12">
                      <h4 className="card-title m-t-10 mb-4">
                        Iglesias que han enviado en informe
                      </h4>
                      <TablaSearch
                        data={this.state.iglesias_reportadas}
                        identificador={"id"}
                        columns={this.columnsIglesiasReportadas}
                      />
                    </div>
                  </div>
                </Tab>

                <Tab
                  eventKey={"iglesias_pendientes"}
                  title={`IGLESIAS PENDIENTES: ${this.state.iglesias_pendientes.length}`}
                >
                  <div className="row">
                    <div className="col-lg-12">
                      <h4 className="card-title m-t-10 mb-4">
                        Iglesias pendientes de enviar el informe
                      </h4>
                      <TablaSearch
                        data={this.state.iglesias_pendientes}
                        identificador={"codigo"}
                        columns={this.columnsIglesiasPendientes}
                      />
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </LayoutPanelTable>
      </div>
    );
  }
}
