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
import Select from "react-select";

export default class UsuariosIglesias extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    disabled_select_iglesia: true,
    disabled_select_zona: true,
    disabled_select_distrito: true,
    disabled_select: true,
    loading: false,

    nombre: "",
    persona: "",
    zona: "",
    zonas: [],
    distrito: "",
    distritos: [],
    iglesia: "",
    iglesias: [],
    redirect: false,
    title: "Asignación de Iglesias a Usuarios",
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  async componentDidMount() {
    this.setState({ zonas: this.getZonasSelect() });
    //document.getElementById("nombre").focus();
    this.getUserById();
  }
  getZonasSelect() {
    let data = [];
    HTTP.findAll(`zonas/select`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
          codigo: element.codigo,
        });
      });
      this.setState({ disabled_select_zona: false });
    });

    return data;
  }

  getDistritos(codigo_zona) {
    let data = [];

    HTTP.findAll(`distritos/select/${codigo_zona}`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
          codigo: element.codigo,
        });
      });

      this.setState({ disabled_select_distrito: false });
    });

    return data;
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  getUserById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "usuarios").then((result) => {
        if (result !== false) {
          this.setState({
            nombre:
              result.persona !== "" && result.persona !== null
                ? result.persona.label
                : "",
            persona:
              result.persona !== "" && result.persona !== null
                ? result.persona.codigo
                : "",
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
      text: "NOMBRE IGLESIA ASIGNADA",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-3">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "fecha_asignacion",
      text: "FECHA ASIGNACIÓN",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
  ];
  getIglesias(codigo_distrito) {
    let data = [];

    HTTP.findAll(`iglesias/distrito/${codigo_distrito}`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
          codigo: element.codigo,
        });
      });

      this.setState({ disabled_select_iglesia: false });
    });

    return data;
  }
  timer_iglesias = null;
  getIglesiasParam = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_iglesias);
      this.timer_iglesias = setTimeout(() => {
        HTTP.findById(
          inputValue,
          `iglesias/distrito/${
            this.state.distrito !== "" && this.state.distrito !== false
              ? this.state.distrito.codigo
              : ""
          }`
        ).then((data) => {
          if (data !== false) {
            data.forEach((element) => {
              tempArray.push({
                label: element.nombre,
                value: element.id,
                codigo: element.codigo,
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

  asignar() {
    if (this.validator.allValid()) {
      const data = {
        iglesia:
          this.state.iglesia !== "" && this.state.iglesia !== null
            ? this.state.iglesia.codigo
            : null,
        persona: this.state.persona,
      };
      Alerts.loading_reload(true);

      Request.POST("usuarios/asignar_iglesia", data).then((result) => {
        Alerts.loading_reload(false);

        if (result !== false) {
          if (result.status === 201) {
            Alerts.alertEmpty(
              "¡Iglesia asignada con éxito!",
              "Administración de usuarios",
              "success"
            );
            this.refs.tabla.clear();

            this.setState({
              iglesia: "",
            });
          } else if (result.status === 409) {
            Alerts.alertEmpty(
              "¡La iglesia ya fue asignada!",
              "Administración de usuarios",
              "warning"
            );
          }
        } else {
          Alerts.alertEmpty(
            "¡No se pudo asignar!",
            "Administración de usuarios",
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

    HTTP.delete_disable(
      data,
      "asignación de iglesia",
      "usuarios",
      "usuarios/iglesia_asignada"
    ).then((result) => {
      this.refs.tabla.clear();
    });
  };
  rowEvents = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();

      contextMenu.show({
        id: "menu",
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
      return <Redirect to="/administracion/usuarios" />;
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
            <h3 className="box-title">Detalles de Asignación</h3>
            <hr className="m-t-0 m-b-5" />
            <div className="row p-t-20">
              <div className="col-lg-3 form-group">
                <label htmlFor="">Usuario:</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  id="nombre"
                  value={this.state.nombre}
                  disabled={true}
                />
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="">Zona: (*)</label>

                <Select
                  id="zona"
                  name="zona"
                  placeholder="Seleccione una opción"
                  value={this.state.zona}
                  isClearable={true}
                  options={this.state.zonas}
                  isDisabled={this.state.disabled_select_zona}
                  ref="select_distrito"
                  onChange={(e) => {
                    this.setState({ zona: e });
                    if (e !== null) {
                      this.setState({
                        distritos: this.getDistritos(e.codigo),
                        iglesia: "",
                        iglesias: [],
                        distrito: "",
                        disabled_select_iglesia: true,
                      });
                      this.refs.select_iglesias.blur();
                      this.refs.select_distrito.blur();
                    } else {
                      this.setState({
                        distrito: "",
                        distritos: [],
                        disabled_select_distrito: true,
                        iglesia: "",
                        iglesias: [],
                        disabled_select_iglesia: true,
                      });
                      this.refs.select_distrito.blur();
                      this.refs.select_iglesias.blur();
                    }
                  }}
                />
                {this.validator.message(
                  "zona",
                  this.state.zona,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "zona",
                      this.state.zona,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="">Distrito: (*)</label>

                <Select
                  id="distrito"
                  name="distrito"
                  placeholder="Seleccione una opción"
                  value={this.state.distrito}
                  isClearable={true}
                  options={this.state.distritos}
                  isDisabled={this.state.disabled_select_distrito}
                  onChange={(e) => {
                    this.setState({ distrito: e });

                    if (e !== null) {
                      this.setState({
                        iglesias: this.getIglesias(e.codigo),
                        iglesia: "",
                      });
                      this.refs.select_iglesias.blur();
                    } else {
                      this.setState({
                        iglesia: "",
                        iglesias: [],
                        disabled_select_iglesia: true,
                      });
                      this.refs.select_iglesias.blur();
                    }
                  }}
                />
                {this.validator.message(
                  "distrito",
                  this.state.distrito,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "distrito",
                      this.state.distrito,
                      "required"
                    )}
                  </span>
                )}
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="">Iglesia a Asignar: (*)</label>

                <AsyncSelect
                  id="iglesia"
                  name="iglesia"
                  placeholder="Seleccione una opción"
                  value={this.state.iglesia}
                  isClearable={true}
                  loadOptions={this.getIglesiasParam}
                  defaultOptions={this.state.iglesias}
                  isDisabled={this.state.disabled_select_iglesia}
                  ref="select_iglesias"
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ iglesia: e });
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
            <hr className="m-t-0 m-b-1" />
            <h3 className="box-title">Iglesias Asignadas</h3>
            <hr className="m-t-0 m-b-2" />
            <div className="row p-t-20">
              <div className="col-lg-12">
                <TablaFilter
                  ref="tabla"
                  ruta={`iglesias/asignadas/${this.props.match.params.id}`}
                  rowEvents={this.rowEvents}
                  identificador={"id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el registro que desea buscar"
                />
                <Menu id={"menu"}>
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
