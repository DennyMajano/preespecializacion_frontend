import React, { Component } from "react";
import HTTP from "../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../helpers/ValidatorTranslate_es";
import Request from "../../../services/Request";
import Alerts from "../../../services/Alerts";
import { Tabs, Tab } from "react-bootstrap";
import TablaFilter from "../../../components/tablas/TablaFilter";
export default class PresentacionInformesIglesia extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: "Panel para presentación de informes",
    nombre: "",
    loading: false,
    tab_active: "",
    gestiones: [],
    actualizando: false,
    iglesia: null,
    redirect: false,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    // document.getElementById("nombre").focus();
    this.getIglesia();
    this.getGestiones();
  }

  getGestiones() {
    if (this.props.match.params.id) {
      HTTP.findById(
        this.props.match.params.id,
        "gestiones/disponibles/iglesia"
      ).then((result) => {
        if (result !== false) {
          this.setState({
            gestiones: result,
            tab_active: result.length > 0 ? result[0].codigo : "",
          });
        } else {
          this.setState({ redirect: true });
        }
      });
    }
  }
  getIglesia() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "iglesias/detalle").then(
        (result) => {
          if (result !== false) {
            this.setState({
              iglesia: result,
            });
          } else {
            this.setState({ redirect: true });
          }
        }
      );
    }
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  hide_alert_validator() {
    this.validator.hideMessages();
    this.forceUpdate();
  }

  updateZona() {
    if (this.validator.allValid()) {
      this.setState({ actualizando: true });
      const data = {
        code: this.props.match.params.id,
        nombre: this.state.nombre,
      };
      HTTP.update(data, "zona", "zonas", "zonas").then((result) => {
        this.setState({ actualizando: false });

        if (result !== false) {
          this.setState({ redirect: true });
        }
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  asignacionDepartamentos() {
    if (this.validator.allValid()) {
      this.setState({
        loading: true,
      });
      if (this.props.match.params.id) {
        const data = {
          code: this.props.match.params.id,
          nombre: this.state.nombre,
        };
        HTTP.update(data, "zona", "zonas", "zonas").then((result) => {
          this.setState({ actualizando: false });

          if (result !== false) {
            this.props.history.push(
              `/organizacion/zonas/asignacion/${this.props.match.params.id}`
            );
          }
        });
      } else {
        const data = {
          nombre: this.state.nombre,
        };
        Request.POST("zonas", data).then((result) => {
          this.setState({
            loading: false,
          });
          if (result !== false) {
            if (result.status === 201) {
              this.props.history.push(
                `/organizacion/zonas/asignacion/${result.data.zona}`
              );
            } else {
              Alerts.alertEmpty(
                "¡No se pudo crear!",
                "Administración de zonas",
                "error"
              );
            }
          }
        });
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  enviarInforme(codigo_informe, gestion) {
    Alerts.QuestionYesNo(
      "¿Está seguro que desea enviar el informe?",
      "¡Una vez enviado no podrá actualizarlo!",
      "question"
    ).then((resp) => {
      if (resp) {
        const data = {
          codigoInforme: codigo_informe,
        };
        Alerts.loading_reload(true);
        Request.PUT("informe/enviar", data).then((result) => {
          Alerts.loading_reload(false);

          if (result !== false) {
            if (result.status === 200) {
              Alerts.alertEmpty(
                "¡Informe enviado con éxito!",
                "Administración de informes",
                "success"
              );

              this.refs[gestion].clear();
              this.forceUpdate();
            } else {
              Alerts.alertEmpty(
                "¡El informe no pudo ser enviado porque ha ocurrido un error!",
                "Administración de informes",
                "error"
              );
            }
          } else {
            Alerts.alertEmpty(
              "¡El informe no pudo ser enviado porque ha ocurrido un error!",
              "Administración de informes",
              "error"
            );
          }
        });
      }
    });
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
      dataField: "ruta",
      text: "id",
      hidden: true,
    },
    {
      dataField: "informe_ide",
      text: "id",
      hidden: true,
    },
    {
      dataField: "informe",
      text: "Nombre Informe",

      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "opciones",
      text: "Opciones",

      formatter: (cellContent, row) => {
        if (row.estado === 0) {
          return (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  this.props.history.push(
                    `${row.ruta}/gestion/${this.state.tab_active}/${this.props.match.params.id}`
                  );
                }}
                className="btn btn-info"
              >
                <i className="fa fa-pencil-square-o mr-2"></i>Crear Infome
              </button>
            </div>
          );
        } else if (row.estado === 1) {
          return (
            <div className="text-center">
              <div className=" btn-group">
                <button
                  type="button"
                  onClick={() => {
                    this.props.history.push(
                      `${row.ruta}/gestion/${this.state.tab_active}/${this.props.match.params.id}/${row.informe_ide}`
                    );
                  }}
                  className="btn btn-outline-info mr-2"
                >
                  <i className="fa fa-pencil mr-2"></i>ACTUALIZAR
                </button>
                <button
                  type="button"
                  onClick={this.enviarInforme.bind(
                    this,
                    row.informe_ide,
                    this.state.tab_active
                  )}
                  className="btn btn-success mr-2"
                >
                  <i className="fa fa-paper-plane-o mr-2"></i>ENVIAR
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fa fa-eye mr-2"></i>VISTA PREVIA
                </button>
              </div>
            </div>
          );
        } else if (row.estado === 2) {
          return (
            <div className="text-center">
              <button className="btn btn-outline-secondary">
                <i className="fa fa-eye mr-2"></i>VISTA PREVIA
              </button>
            </div>
          );
        }
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "estado",
      text: "ESTADO",

      formatter: (cellContent, row) => {
        if (cellContent === 0) {
          return (
            <p className="text-center">
              <span className="label label-light-danger"> NO ENVIADO</span>
            </p>
          );
        } else if (cellContent === 1) {
          return (
            <p className="text-center">
              <span className="label label-light-info">DIGITANTO</span>
            </p>
          );
        } else if (cellContent === 2) {
          return (
            <p className="text-center">
              <span className="label label-light-success">ENVIADO</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { width: "10%", textAlign: "center" };
      },
    },
  ];
  async handleChangeTab(key) {
    await this.setState({ tab_active: key });

    this.refs[key].clear();
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/presentacion_informes" />;
    }
    return (
      <React.Fragment>
        {/* ============================================================== */}
        {/* Bread crumb and right sidebar toggle */}
        {/* ============================================================== */}
        <div className="row page-titles">
          <div className="col-md-5 align-self-center">
            <h3 className="text-themecolor">{this.state.title}</h3>
          </div>
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
          {/* Row */}
          <div className="row">
            {/* Column */}
            <div className="col-lg-3 col-xlg-3 col-md-5">
              <div className="card">
                <div className="card-body">
                  <center className="m-t-30">
                    {" "}
                    {/* <img
                      src="../assets/images/users/5.jpg"
                      className="img-circle"
                      width={150}
                    /> */}
                    <h4 className="card-title m-t-10">
                      {this.state.iglesia !== null
                        ? this.state.iglesia.nombre
                        : null}
                    </h4>
                    <h6 className="card-subtitle">
                      {this.state.iglesia !== null
                        ? this.state.iglesia.codigo
                        : null}
                    </h6>
                    {/* <div className="row text-center justify-content-md-center">
                      <div className="col-4">
                        <a href="javascript:void(0)" className="link">
                          <i className="icon-people" />{" "}
                          <font className="font-medium">254</font>
                        </a>
                      </div>
                      <div className="col-4">
                        <a href="javascript:void(0)" className="link">
                          <i className="icon-picture" />{" "}
                          <font className="font-medium">54</font>
                        </a>
                      </div>
                    </div> */}
                  </center>
                </div>
                <div>
                  <hr />{" "}
                </div>
                <div className="card-body">
                  {" "}
                  <small className="text-muted">Pastor:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.pastor
                      : "SIN PASTOR ASIGNADO"}
                  </h6>{" "}
                  <small className="text-muted">Zona:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.zona
                      : "SIN ZONA ASIGNADA"}
                  </h6>{" "}
                  <small className="text-muted p-t-15 db">Distrito:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.distrito
                      : null}
                  </h6>{" "}
                  <small className="text-muted p-t-15 db">
                    Departamento - Municipio:
                  </small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.departamento
                      : null}{" "}
                    -{" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.municipio
                      : null}
                  </h6>{" "}
                  <small className="text-muted p-t-15 db">Dirección:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.direccion
                      : null}
                  </h6>
                  <div className="map-box">
                    {this.state.iglesia !== null ? (
                      this.state.iglesia.ruta_mapa !== "" &&
                      this.state.iglesia.ruta_mapa !== null ? (
                        <iframe
                          title="mapa"
                          src={this.state.iglesia.ruta_mapa}
                          width="100%"
                          height={150}
                          frameBorder={0}
                          style={{ border: 0 }}
                          allowFullScreen
                        />
                      ) : null
                    ) : null}
                  </div>{" "}
                  <small className="text-muted p-t-15 db">Teléfono:</small>
                  <h6>
                    {" "}
                    {this.state.iglesia !== null
                      ? this.state.iglesia.telefono
                      : "SIN TEÉFONO ASIGNADO"}
                  </h6>
                </div>
              </div>
            </div>
            {/* Column */}
            {/* Column */}
            <div className="col-lg-9 col-xlg-9 col-md-7">
              {this.state.gestiones.length > 0 ? (
                <div className="card">
                  <div className="card-body">
                    {/* Nav tabs */}
                    <div className="card-body">
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

                                          <td>
                                            {element.fecha_recibir_inicio}
                                          </td>
                                          <td>{element.fecha_recibir_fin}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div className="col-lg-12">
                                  <h4 className="card-title m-t-10">
                                    Informes solicitados
                                  </h4>
                                  <TablaFilter
                                    buscador={false}
                                    key={element.id}
                                    ref={element.codigo}
                                    ruta={`gestion/iglesia/informes/${element.codigo}/${this.props.match.params.id}`}
                                    rowEvents={this.rowEvents}
                                    identificador={"id"}
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
                    {/* Tab panes */}
                  </div>
                  <div className="card-footer text-center">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => {
                        this.props.history.push(
                          "/presentacion_informes/iglesia"
                        );
                      }}
                    >
                      <i className="fa fa-arrow-left"></i> SALIR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body">
                    <h1>NO HAY GESTIONES ACTIVAS</h1>
                  </div>
                  <div className="card-footer text-center">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => {
                        this.props.history.push("/presentacion_informes");
                      }}
                    >
                      <i className="fa fa-arrow-left"></i> SALIR
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Column */}
          </div>
          {/* Row */}
        </div>
        {/* ============================================================== */}
        {/* End Container fluid  */}
        {/* ============================================================== */}
      </React.Fragment>
    );
  }
}
