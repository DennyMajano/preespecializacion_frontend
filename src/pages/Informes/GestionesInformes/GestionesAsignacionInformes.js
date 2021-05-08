import React, { Component } from "react";
import LayoutPanelFormulario from "../../../components/layouts/panels/LayoutPanelFormulario";
import HTTP from "../../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../../helpers/ValidatorTranslate_es";
import TablaFilter from "../../../components/tablas/TablaFilter";
import Request from "../../../services/Request";
import Alerts from "../../../services/Alerts";
import { Menu, Item, contextMenu, IconFont } from "react-contexify";
import Select from "react-select";
import AsyncSelect from "react-select/async";

export default class GestionesAsignacionInformes extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: "Asignación de informes a gestión",

    nombre: "",
    codigo: "",
    tipo: "",
    loading: false,
    informes: [],
    informe: "",
    mes: 4,
    meses: [],

    redirect: false,

    disabled_select_meses: true,
    disabled_select_informe: true,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    this.setState({ departamentos: this.getInformes() });
    document.getElementById("nombre").focus();
    this.getGestionById();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  getGestionById() {
    if (this.props.match.params.id || this.props.match.params.gestion_activa) {
      HTTP.findById(
        this.props.match.params.id
          ? this.props.match.params.id
          : this.props.match.params.gestion_activa,
        "gestion"
      ).then((result) => {
        if (result !== false) {
          this.setState({
            nombre: result.descripcion,
            codigo: result.codigo,
            tipo: result.tipo_gestion_id,
            informes: this.getInformes(result.tipo_gestion_id),
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
      dataField: "gestion_informe",
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
      dataField: "informe_nombre",
      text: "Informe",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-3">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "mes_nombre",
      text: "Mes",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-3">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
  ];

  getInformesParam = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(
          inputValue,
          `maestro_informe/select/tipo/${this.state.tipo}`
        ).then((data) => {
          if (data !== false) {
            data.forEach((element) => {
              tempArray.push({
                label: element.nombre,
                value: element.id,
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

  getInformes(tipo) {
    let data = [];

    HTTP.findAll(`maestro_informe/select/tipo/${tipo}`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });

      this.setState({ disabled_select_informe: false });
    });

    return data;
  }
  getMeses() {
    let data = [];

    HTTP.findAll(`maestro_informe/select/tipo/`).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });

      this.setState({ disabled_select_informe: false });
    });

    return data;
  }
  asignar() {
    if (this.validator.allValid()) {
      const data = {
        informeId:
          this.state.informe !== "" && this.state.informe !== null
            ? this.state.informe.value
            : null,
        codigoGestion: this.state.codigo,
        mesId: this.state.mes,
      };
      Alerts.loading_reload(true);
      Request.POST("gestion/asignacion", data).then((result) => {
        Alerts.loading_reload(false);

        if (result !== false) {
          if (result.status === 201) {
            Alerts.toast("Informe asignado exitosamente!", "success");
            this.refs.tabla.clear();

            this.setState({
              informe: "",
              mes: "",
            });
            this.validator.hideMessages();
            this.forceUpdate();
          } else if (result.status === 409) {
            Alerts.alertEmpty(
              "¡El departamento ya fue asignado!",
              "Administración de zonas",
              "warning"
            );
          }
        } else {
          Alerts.alertEmpty(
            "¡No se pudo asignar!",
            "Administración de zonas",
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
      codigoGestion: this.state.codigo,
      idGestionInforme: props.id,
    };

    Alerts.Question(
      "¿Desea eliminar el informe de la gestión?",
      "Administración de gestiones"
    ).then((resp) => {
      if (resp) {
        Alerts.loading_reload(true);

        Request.DELETE("gestion/asignacion", data).then((result) => {
          Alerts.loading_reload(false);

          if (result !== false) {
            if (result.status === 200) {
              this.refs.tabla.clear();
              Alerts.alertSuccessDelete("asignación de informe", "gestiones");
            } else {
              Alerts.alertErrorDelete("asignación de informe", "gestiones");
            }
          }
        });
      }
    });
  };
  rowEvents = {
    onContextMenu: (e, row, rowIndex) => {
      e.preventDefault();
      if (!this.props.match.params.gestion_activa) {
        contextMenu.show({
          id: "menu",
          event: e,
          props: {
            id: row.gestion_informe,
          },
        });
      }
    },
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/informes_mensuales/gestiones_entrega" />;
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
                <label htmlFor="">Descripcion:</label>

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
                <label htmlFor="">Informe :(*)</label>

                <AsyncSelect
                  id="informe"
                  name="informe"
                  placeholder="Seleccione una opción"
                  value={this.state.informe}
                  isClearable={true}
                  loadOptions={this.getInformesParam}
                  defaultOptions={this.state.informes}
                  isDisabled={
                    this.state.disabled_select_informe === true ||
                    this.props.match.params.gestion_activa
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ informe: e });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                />
                {this.validator.message(
                  "informe",
                  this.state.informe,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "informe",
                      this.state.informe,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-4 form-group">
                <label htmlFor="">Mes :(*)</label>

                <Select
                  id="mes"
                  name="mes"
                  placeholder="Selecione una opción"
                  options={this.state.meses}
                  value={this.state.mes}
                  isClearable={true}
                  isDisabled={this.state.disabled_select_meses}
                  onChange={(e) => {
                    this.setState({ mes: e });
                  }}
                />
                {this.validator.message("mes", this.state.mes, "required") && (
                  <span className="label label-light-danger">
                    {this.validator.message("mes", this.state.mes, "required")}
                  </span>
                )}
              </div>
              <div className="col-12 card-footer text-center">
                <div className="btn-group">
                  {!this.props.match.params.gestion_activa ? (
                    <button
                      type="button"
                      onClick={this.asignar.bind(this)}
                      className="btn btn-info"
                    >
                      ASIGNAR
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            <hr class="m-t-0 m-b-1" />
            <h3 class="box-title">Informes Asignados</h3>
            <hr class="m-t-0 m-b-2" />
            <div className="row p-t-20">
              <div className="col-lg-12">
                <TablaFilter
                  ref="tabla"
                  ruta={`gestiones/informes/${
                    this.props.match.params.id ||
                    this.props.match.params.gestion_activa
                  }`}
                  rowEvents={this.rowEvents}
                  identificador={"gestion_informe"}
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
