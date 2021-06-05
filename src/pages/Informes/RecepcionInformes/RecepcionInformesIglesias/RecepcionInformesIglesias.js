import React, { Component } from "react";
import LayoutPanelTable from "../../../../components/layouts/panels/LayoutPanelTable";
import HTTP from "../../../../helpers/HTTP";
import Encrypt from "../../../../services/Encrypt";
import { Tabs, Tab } from "react-bootstrap";
import TablaFilter from "../../../../components/tablas/TablaFilter";

export default class RecepcionInformesIglesias extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.state.usuario = Encrypt.getSession("codigo_persona");
  }

  inicial_state = {
    usuario: "",
    tab_active: "",
    gestiones: [],
    cargadas: false,
  };
  componentDidMount() {
    this.getGestiones();
  }

  async handleChangeTab(key) {
    await this.setState({ tab_active: key });

    this.refs[key].clear();
  }
  getGestiones() {
    HTTP.findAll("gestiones/activas").then((result) => {
      if (result !== false) {
        this.setState({
          gestiones: result,
          tab_active: result.length > 0 ? result[0].codigo : "",
          cargadas: true,
        });
      } else {
        this.setState({ redirect: true });
      }
    });
  }
  columns = [
    {
      dataField: "informe_id",
      text: "id",
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "recibidos",
      text: "id",
      hidden: true,
    },
    {
      dataField: "identificador",
      text: "id",
      hidden: true,
    },
    {
      dataField: "informe_nombre",
      text: "Nombre Informe",

      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "mes_nombre",
      text: "Mes",

      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "8%", textAlign: "center" };
      },
    },

    {
      dataField: "total",
      text: "Iglesias Reportadas",

      formatter: (cellContent, row) => {
        if (parseInt(row.recibidos) === parseInt(cellContent)) {
          return (
            <div className="text-center">
              <span className="label label-light-success font-16">
                {row.recibidos}/{cellContent}
              </span>
            </div>
          );
        } else {
          return (
            <div className="text-center">
              <span className="label label-light-danger font-16">
                {row.recibidos}/{cellContent}
              </span>
            </div>
          );
        }
      },
      headerStyle: () => {
        return { width: "10%", textAlign: "center" };
      },
    },
    {
      dataField: "Opciones",
      text: "Opciones",

      formatter: (cellContent, row) => {
        if (parseInt(row.recibidos) > 0) {
          return (
            <div className="text-center">
              <button type="button" className="btn btn-outline-info mr-2">
                <i className="fa fa-download mr-2"></i>Descargar Todo
              </button>
              <button type="button" className="btn btn-outline-info mr-2">
                <i className="fa fa-print mr-2"></i>Imprimir Todo
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary mr-2"
                onClick={() => {
                  this.props.history.push(
                    `/recepcion_informes/iglesia/detalle_informe_recibido/${this.state.tab_active}/${row.informe_id}`
                  );
                }}
              >
                <i className="fa fa-clipboard mr-2"></i>Detalles
              </button>
            </div>
          );
        } else {
          return (
            <div className="text-center">
              <button
                type="button"
                className="btn btn-outline-secondary mr-2"
                onClick={() => {
                  this.props.history.push(
                    `/recepcion_informes/iglesia/detalle_informe_recibido/${this.state.tab_active}/${row.informe_id}`
                  );
                }}
              >
                <i className="fa fa-clipboard mr-2"></i>Detalles
              </button>
            </div>
          );
        }
      },
      headerStyle: () => {
        return { width: "25%", textAlign: "center" };
      },
    },
  ];
  render() {
    return (
      <div>
        <LayoutPanelTable
          titulo="Recepción de informes de Iglesias Locales"
          titulo_panel="Gestiones activas de informes de Iglesias Locales"
        >
          {this.state.cargadas === true ? (
            <div className="row">
              {this.state.gestiones.length > 0 ? (
                <div className="col-lg-12">
                  <Tabs
                    activeKey={this.state.tab_active}
                    onSelect={this.handleChangeTab.bind(this)}
                    id="tabs"
                  >
                    {this.state.gestiones.map((element, index) => {
                      return (
                        <Tab
                          eventKey={element.codigo}
                          title={element.descripcion.toUpperCase()}
                          key={element.codigo}
                        >
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="table-responsive">
                                <table className="table table-bordered table-bordered-table color-bordered-table muted-bordered-table">
                                  <thead>
                                    <tr>
                                      <th className="text-center">
                                        Código Gestión
                                      </th>

                                      <th className="text-center">
                                        Fecha Publicación
                                      </th>
                                      <th className="text-center">
                                        Fecha de Inicio para Envío
                                      </th>
                                      <th className="text-center">
                                        Fecha Límite para Envío
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{element.codigo}</td>
                                      <td>{element.fecha_publicacion}</td>

                                      <td>{element.fecha_recibir_inicio}</td>
                                      <td>{element.fecha_recibir_fin}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <h4 className="card-title m-t-10">
                                Informes De Gestión
                              </h4>
                              <TablaFilter
                                buscador={false}
                                key={element.id}
                                ref={element.codigo}
                                ruta={`gestiones/informes/${element.codigo}`}
                                rowEvents={this.rowEvents}
                                identificador={"informe_id"}
                                columns={this.columns}
                                titulo_tabla="Escriba el registro que desea buscar"
                              />
                            </div>
                          </div>
                        </Tab>
                      );
                    })}
                  </Tabs>
                </div>
              ) : (
                <div className="text-center">
                  <h1>NO TIENE IGLESIAS ASIGNADAS</h1>
                  <span>
                    Si concidera que fue un error, comuniquese con el
                    administrador
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </LayoutPanelTable>
      </div>
    );
  }
}
