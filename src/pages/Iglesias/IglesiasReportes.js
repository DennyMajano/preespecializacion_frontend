import React, { Component } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import AsyncSelect from "react-select/async";
import HTTP from "../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";
import TablaFilter from "../../components/tablas/TablaFilter";
import Request from "../../services/Request";
import Alerts from "../../services/Alerts";
import { Menu, Item, contextMenu, IconFont } from "react-contexify";

export default class IglesiasReportes extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: "Asignación de reportes a iglesias",
    nombre: "",
    informe: "",
    informes: [],
    codigo_iglesia: "",
    loading: false,
    redirect: false,
    disabled_select: true,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    this.setState({ informes: this.getInfomes() });

    this.getById();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  getById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "iglesias").then((result) => {
        if (result !== false) {
          this.setState({
            nombre: result.nombre,
            codigo_iglesia: result.codigo,
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
      text: "Nombre Informe",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-3">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "fecha",
      text: "Fecha y hora Asinación",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
  ];

  getInfomesParam = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "maestro_informe/select/tipo/1").then(
          (data) => {
            if (data !== false) {
              data.forEach((element) => {
                tempArray.push({
                  label: `${element.nombre}`,
                  value: element.id,
                });
              });
              callback(tempArray);
            } else {
              callback([]);
            }
          }
        );
      }, 500);
    }
  };
  getInfomes() {
    let data = [];

    HTTP.findAll("maestro_informe/select/tipo/1").then((result) => {
      result.forEach((element) => {
        data.push({ label: element.nombre, value: element.id });
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
        iglesia: this.state.codigo_iglesia,
        informe:
          this.state.informe !== "" && this.state.informe !== null
            ? this.state.informe.value
            : null,
      };
      Alerts.loading_reload(true);

      Request.POST("iglesias_informes", data).then((result) => {
        Alerts.loading_reload(false);

        if (result !== false) {
          if (result.status === 201) {
            Alerts.alertEmpty(
              "Informe asignado con éxito!",
              "Administración de Iglesia",
              "success"
            );
            this.refs.tabla.clear();

            this.setState({
              informe: "",
            });
          } else if (result.status === 409) {
            Alerts.alertEmpty(
              "¡El Informe ya fue asignado!",
              "Administración de Iglesias",
              "warning"
            );
          }
        } else {
          Alerts.alertEmpty(
            "¡No se pudo asignar!",
            "Administración de Iglesias",
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
      "asignación de informe",
      "Iglesias",
      "iglesias_informes"
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
        },
      });
    },
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/organizacion/iglesias" />;
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
              <div className="col-lg-6 form-group">
                <label htmlFor="">Iglesia:</label>

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
              <div className="col-lg-6 form-group">
                <label htmlFor="">Reporte: (*)</label>

                <AsyncSelect
                  id="informe"
                  name="informe"
                  placeholder="Seleccione una opción"
                  value={this.state.informe}
                  isClearable={true}
                  loadOptions={this.getInfomesParam}
                  defaultOptions={this.state.informes}
                  isDisabled={this.state.disabled_select}
                  onChange={(e) => {
                    this.setState({
                      informe: e,
                    });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                />
                {this.validator.message(
                  "reporte",
                  this.state.informe,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "reporte",
                      this.state.informe,
                      "required"
                    )}
                  </span>
                )}
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
            <h3 className="box-title">Reportes Asignados</h3>
            <hr className="m-t-0 m-b-2" />
            <div className="row p-t-20">
              <div className="col-lg-12">
                <TablaFilter
                  ref="tabla"
                  ruta={`iglesias_informes/all/${this.props.match.params.id}`}
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
