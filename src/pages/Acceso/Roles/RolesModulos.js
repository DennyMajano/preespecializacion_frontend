import React, { Component } from "react";
import LayoutPanelFormulario from "../../../components/layouts/panels/LayoutPanelFormulario";
import AsyncSelect from "react-select/async";
import HTTP from "../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../helpers/ValidatorTranslate_es";
import TablaFilter from "../../../components/tablas/TablaFilter";
import Request from "../../../services/Request";
import Alerts from "../../../services/Alerts";
import { Menu, Item, contextMenu, IconFont } from "react-contexify";

export default class RolesModulos extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: "Asignación de módulos a roles",

    nombre: "",
    loading: false,
    modulos_principales: [],
    modulo_principal: "",
    modulos_asinar: [],
    modulo_asignar: "",
    redirect: false,
    disabled_select_asignar: true,
    disabled_select: true,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    this.setState({ modulos_principales: this.getModulosPrincipales() });
    document.getElementById("nombre").focus();
    this.getRolById();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  getRolById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "roles").then((result) => {
        if (result !== false) {
          this.setState({
            nombre: result.name,
          });
        } else {
          this.setState({ redirect: true });
        }
      });
    }
  }

  hide_alert_validator() {
    this.validator.hideMessages();
    this.forceUpdate();
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      this.setState({ loading: true });

      if (this.props.match.params.id) {
        const data = {
          code: this.props.match.params.id,
          name: this.state.nombre,
          principal:
            this.state.modulo_principal !== "" &&
            this.state.modulo_principal !== null
              ? this.state.modulo_principal.value
              : 0,
          modulo_principal: this.state.es_principal,
        };
        HTTP.update(data, "módulo", "módulos", "modulos").then((result) => {
          this.setState({ loading: false });
          if (result !== false) {
            this.setState({ redirect: true });
          }
        });
      } else {
        const data = {
          name: this.state.nombre,
          principal:
            this.state.modulo_principal !== "" &&
            this.state.modulo_principal !== null
              ? this.state.modulo_principal.value
              : 0,
          modulo_principal: this.state.es_principal,
        };
        HTTP.create(data, "módulo", "módulos", "modulos").then((result) => {
          this.setState({ loading: false });
          if (result !== false) {
            this.setState({ redirect: true });
          }
        });
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  columns = [
    {
      dataField: "id",
      text: "CÓDIGO",
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
      text: "NOMBRE MÓDULO",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-3">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "fecha_creacion",
      text: "FECHA REGISTRO",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent !== null) {
          return <p>{cellContent}</p>;
        } else {
          return <p className="text-center">N/A</p>;
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "e_padre",
      text: "TIPO DE MÓDULO",
      sort: true,
      formatter: (cellContent, row) => {
        if (row.e_padre === 1) {
          return (
            <p className="text-center">
              <span className="label label-info"> PRINCIPAL</span>
            </p>
          );
        } else {
          return (
            <p className="text-center">
              <span className="label label-light-info">SECUNDARIO</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "status",
      text: "ESTADO",
      sort: true,
      formatter: (cellContent, row) => {
        if (row.status === 1) {
          return (
            <p className="text-center">
              <span className="label label-light-info"> ACTIVO</span>
            </p>
          );
        } else {
          return (
            <p className="text-center">
              <span className="label label-light-danger">INACTIVO</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
  ];

  getModulosPrincipalesParam = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "roles/select").then((data) => {
          if (data !== false) {
            data.forEach((element) => {
              tempArray.push({
                label: `${element.name}`,
                value: element.rol_id,
              });
            });
            callback(tempArray);
          } else {
            callback([]);
          }
        });
      }, 500);
    }
  };
  getModulosPrincipales() {
    let data = [];

    HTTP.findAll("modulos/select").then((result) => {
      result.forEach((element) => {
        data.push({ label: element.name, value: element.modulo_id });
      });
      this.setState({ disabled_select: false });
    });

    return data;
  }
  getModulosAsignar(idPrincipal) {
    let data = [];

    HTTP.findAll(`modulos/children/${idPrincipal}`).then((result) => {
      this.setState({
        disabled_select_asignar: false,
      });
      result.forEach((element) => {
        data.push({ label: element.name, value: element.modulo_id });
      });
    });

    return data;
  }

  asignar() {
    if (this.validator.allValid()) {
      const data = {
        modulo:
          this.state.modulo_asignar !== "" && this.state.modulo_asignar !== null
            ? this.state.modulo_asignar.value
            : this.state.modulo_principal !== "" &&
              this.state.modulo_principal !== null
            ? this.state.modulo_principal.value
            : null,
        rol: this.props.match.params.id,
      };
      Request.POST("roles_modulos", data).then((result) => {
        if (result !== false) {
          if (result.status === 201) {
            Alerts.toast("¡Módulo asignado con éxito!", "success");
            this.refs.tabla.getData(
              `roles_modulos/all/${this.props.match.params.id}`
            );

            this.setState({
              modulo_asignar: "",
            });
          } else if (result.status === 409) {
            Alerts.alertEmpty(
              "¡El módulo ya fue asignado!",
              "Administración de roles",
              "warning"
            );
          }
        } else {
          Alerts.alertEmpty(
            "¡No se pudo asignar!",
            "Administración de roles",
            "error"
          );
        }
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  eliminar = async ({ event, props }) => {
    const data = {
      code: props.id,
    };
    if (props.principal === 1) {
      Alerts.Question(
        "El módulo a eliminar, es módulo principal, ¿Desea eliminar?",
        "Administración de asignaciones de módulos"
      ).then((resp) => {
        if (resp) {
          Request.DELETE("roles_modulos", data).then((result) => {
            if (result !== false) {
              if (result.status === 200) {
                this.refs.tabla.getData(
                  `roles_modulos/all/${this.props.match.params.id}`
                );
                Alerts.alertSuccessDelete(
                  "asignación de módulo",
                  "asignaciones de módulo"
                );
              } else {
                Alerts.alertErrorDelete(
                  "asignación de módulo",
                  "asignaciones de módulo"
                );
              }
            }
          });
        }
      });
    } else {
      HTTP.disable(
        data,
        "asignación de módulo",
        "asignaciones de módulos",
        "roles_modulos"
      ).then((result) => {
        this.refs.tabla.getData(
          `roles_modulos/all/${this.props.match.params.id}`
        );
      });
    }
  };
  rowEvents = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();

      contextMenu.show({
        id: "menu_modulos",
        event: e,
        props: {
          id: row.id,
          principal: row.e_padre,
        },
      });
    },
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/administracion/roles" />;
    }
    return (
      <React.Fragment>
        <LayoutPanelFormulario
          titulo={this.state.title}
          buttons={
            <div className="card-footer text-center">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-outline-inverse mr-2 "
                  onClick={() => {
                    this.setState({ redirect: true });
                  }}
                  disabled={this.state.loading}
                >
                  <i className="fa fa-arrow-circle-left mr-2"></i>SALIR
                </button>
              </div>
            </div>
          }
        >
          <div className="form-body">
            <h3 class="box-title">Detalles de Asignación</h3>
            <hr class="m-t-0 m-b-5" />
            <div className="row p-t-20">
              <div className="col-lg-4 form-group">
                <label htmlFor="">Nombre rol:</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  id="nombre"
                  value={this.state.nombre}
                  onChange={this.handleInputChange}
                  readOnly={true}
                />
              </div>
              <div className="col-lg-4 form-group">
                <label htmlFor="">Módulo principal:</label>

                <AsyncSelect
                  id="modulo_principal"
                  name="modulo_principal"
                  placeholder="Seleccione una opción"
                  value={this.state.modulo_principal}
                  isClearable={true}
                  loadOptions={this.getModulosPrincipalesParam}
                  defaultOptions={this.state.modulos_principales}
                  isDisabled={this.state.disabled_select}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({
                      modulo_principal: e,
                      disabled_select_asignar: true,
                    });
                    if (e !== null) {
                      this.setState({
                        modulos_asinar: this.getModulosAsignar(e.value),
                      });
                    } else {
                      this.setState({
                        modulos_asinar: [],
                        modulo_asignar: "",
                        disabled_select_asignar: true,
                      });
                    }
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                  // onFocus={() => {
                  //   this.handleFocusSelect(false)

                  // }}
                  // onBlur={() => {
                  //   this.handleFocusSelect(true)
                  // }}
                />
                {this.validator.message(
                  "módulo principal",
                  this.state.modulo_principal,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "módulo principal",
                      this.state.modulo_principal,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-4 form-group">
                <label htmlFor="">Módulo a Asignar:</label>

                <AsyncSelect
                  id="modulo_asignar"
                  name="modulo_asignar"
                  placeholder="Seleccione una opción"
                  value={this.state.modulo_asignar}
                  isClearable={true}
                  loadOptions={this.getModulosPrincipalesParam}
                  defaultOptions={this.state.modulos_asinar}
                  isDisabled={this.state.disabled_select_asignar}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ modulo_asignar: e });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                  // onFocus={() => {
                  //   this.handleFocusSelect(false)

                  // }}
                  // onBlur={() => {
                  //   this.handleFocusSelect(true)
                  // }}
                />
                {/* {this.validator.message(
                  "módulo asignar",
                  this.state.modulo_asignar,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "módulo asignar",
                      this.state.modulo_asignar,
                      "required"
                    )}
                  </span>
                )} */}
              </div>

              <div className="col-12 card-footer text-center">
                <div className="btn-group">
                  <button
                    type="button"
                    onClick={this.asignar.bind(this)}
                    className="btn btn-info"
                  >
                    ASIGNAR
                  </button>
                </div>
              </div>
            </div>
            <hr class="m-t-0 m-b-1" />
            <h3 class="box-title">Módulos Asignados</h3>
            <hr class="m-t-0 m-b-2" />
            <div className="row p-t-20">
              <div className="col-lg-12">
                <TablaFilter
                  ref="tabla"
                  ruta={`roles_modulos/all/${this.props.match.params.id}`}
                  rowEvents={this.rowEvents}
                  identificador={"id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el registro que desea buscar"
                />
                <Menu id={"menu_modulos"}>
                  <Item onClick={this.eliminar}>
                    <IconFont className="fa fa-trash" />
                    ELIMINAR
                  </Item>
                </Menu>
              </div>
            </div>
          </div>
        </LayoutPanelFormulario>
      </React.Fragment>
    );
  }
}
