import React, { Component } from "react";
import LayoutPanelTable from "../../components/layouts/panels/LayoutPanelTable";
import TablaFilter from "../../components/tablas/TablaFilter";
import { Menu, Item, Separator, contextMenu, IconFont } from "react-contexify";
import HTTP from "../../helpers/HTTP";
import { Tabs, Tab } from "react-bootstrap";
import Request from "../../services/Request";
import Alerts from "../../services/Alerts";
export default class PeriodosMinisteriales extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
  }

  inicial_state = {
    tab_active: "periodo_vigente",
    id: "",
    codigo: "",
    descripcion: "",
    anio: "",
    estado: "",
  };

  async handleChangeTab(key) {
    await this.setState({ tab_active: key });

    if (key === "periodos_configurando") {
      this.refs.tabla_configurados.clear();
    } else if (key === "periodos_finalizados") {
      this.refs.tabla_finalizados.clear();
    }
  }
  columns = [
    {
      dataField: "id",
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
      dataField: "codigo",
      text: "Código",
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "descripcion",
      text: "Descripción",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "anio",
      text: "Año",
      sort: true,
      formatter: (cellContent, row) => {
        return <p>{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },

    {
      dataField: "estado",
      text: "Estado",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent === 1) {
          return (
            <p className="text-center">
              <span className="label label-light-info"> CONFIGURANDO</span>
            </p>
          );
        } else if (cellContent === 2) {
          return (
            <p className="text-center">
              <span className="label label-light-info">Vigente</span>
            </p>
          );
        } else if (cellContent === 3) {
          return (
            <p className="text-center">
              <span className="label label-light-info">Finalizado</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
  ];
  eliminar = async ({ event, props }) => {
    const data = {
      id: props.id,
    };
    HTTP.delete_disable(
      data,
      "periodo ministerial",
      "periodos ministeriales",
      "periodo"
    ).then((result) => {
      this.refs.tabla_configurados.clear();
    });
  };

  update = ({ event, props }) => {
    this.props.history.push("/periodos_ministeriales/update/" + props.id);
  };

  rowEventsConfigurados = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();

      contextMenu.show({
        id: "menu_configurados",
        event: e,
        props: {
          codigo: row.codigo,
          id: row.id,
        },
      });
    },
  };
  componentDidMount() {
    this.getPeriodoVigente();
  }

  Vigente = async ({ event, props }) => {
    Alerts.QuestionYesNo(
      "¿Está seguro que desea convertir en periodo vigente?",
      "Administración de periodos ministeriales"
    ).then((resp) => {
      if (resp) {
        const data = {
          codigo: props.codigo,
        };
        Alerts.loading_reload(true);
        Request.PUT("periodo/vigente", data).then((result) => {
          Alerts.loading_reload(false);

          if (result !== false) {
            if (result.status === 200) {
              Alerts.alertEmpty(
                "¡Periodo en vigencia con éxito!",
                "Administración de periodos ministeriales",
                "success"
              );
              this.refs.tabla_configurados.clear();
            } else if (result.status === 409) {
              Alerts.alertEmpty(
                "¡Ya existe un periodo en vigencia!",
                "Administración de periodos ministeriales",
                "warning"
              );
            }
          }
        });
      }
    });
  };
  getPeriodoVigente() {
    HTTP.findById(2, "periodos/estado").then((result) => {
      if (result !== false) {
        this.setState(result[0]);
      }
    });
  }
  render() {
    return (
      <React.Fragment>
        <LayoutPanelTable
          titulo="Administración de periodos ministeriales"
          rutacreate="/periodos_ministeriales/new"
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-12 form-group">
                <Tabs
                  activeKey={this.state.tab_active}
                  onSelect={this.handleChangeTab.bind(this)}
                  id="tabs_periodos_ministeriales"
                >
                  <Tab eventKey="periodo_vigente" title="Periodo vigente">
                    <div className="row">
                      <div className="col-lg-6 col-md-8 col-sm-12 mx-auto m-t-30">
                        {/* Card */}
                        <div className="card border border-dark">
                          <div className="card-header border-bottom border-dark">
                            Periodo Ministerial Vigente
                          </div>
                          <div className="card-body text-center">
                            <h4 className="card-title">
                              {this.state.descripcion}
                            </h4>

                            <button type="button" className="btn btn-info">
                              Go somewhere
                            </button>
                          </div>
                          <div className="card-footer text-muted border-top border-secondary text-center">
                            Iglesia de Dios de la Profecía Universal
                          </div>
                        </div>
                        {/* Card */}
                      </div>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="periodos_configurando"
                    title="Periodos Configurados"
                  >
                    <div className="form-body">
                      <div className="row p-t-20">
                        <div className="col-12 form-group">
                          <TablaFilter
                            ref="tabla_configurados"
                            ruta={"periodos/estado/1"}
                            rowEvents={this.rowEventsConfigurados}
                            identificador={"id"}
                            columns={this.columns}
                            titulo_tabla="Escriba el registro que desea buscar"
                          />
                          <Menu id={"menu_configurados"}>
                            <Item onClick={this.update}>
                              <IconFont className="fa fa-pencil" /> ACTUALIZAR
                            </Item>
                            <Separator />
                            <Item onClick={this.Vigente}>
                              <IconFont className="fa fa-trash" />
                              CONVERTIR EN VIGENTE
                            </Item>
                            <Separator />
                            <Item onClick={this.eliminar}>
                              <IconFont className="fa fa-trash" />
                              ELIMINAR
                            </Item>
                          </Menu>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="periodos_finalizados"
                    title="Periodos Configurados"
                  >
                    <div className="form-body">
                      <div className="row p-t-20">
                        <div className="col-12 form-group">
                          <TablaFilter
                            ref="tabla_finalizados"
                            ruta={"periodos/estado/3"}
                            //rowEvents={this.rowEventsConfigurados}
                            identificador={"id"}
                            columns={this.columns}
                            titulo_tabla="Escriba el registro que desea buscar"
                          />
                        </div>
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
