import React, { Component } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import HTTP from "../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";
import TablaFilter from "../../components/tablas/TablaFilter";
import Request from "../../services/Request";
import Alerts from "../../services/Alerts";
import { Menu, Item, contextMenu, IconFont } from "react-contexify";
import Select from "react-select";

export default class ZonasDepartamento extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: "Asignación de departamentos a zonas",

    nombre: "",
    codigo: "",
    loading: false,
    departamentos: [],
    departamento: "",

    redirect: false,

    disabled_select_departamento: true,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    this.setState({ departamentos: this.getDepartamentos() });
    document.getElementById("nombre").focus();
    this.getZonaById();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  getZonaById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "zonas").then((result) => {
        if (result !== false) {
          this.setState({
            nombre: result.nombre,
            codigo: result.codigo,
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
      hidden: false,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "departamento",
      text: "DEPARTAMENTO",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-3">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
  ];


  getDepartamentos() {
    let data = [];

    HTTP.findAll("generales/departamentos").then((result) => {
      result.forEach((element) => {
        if (element.id !== 15) {
          data.push({ label: element.nombre, value: element.id });
        }
      });
      this.setState({ disabled_select_departamento: false });
    });

    return data;
  }

  asignar() {
    if (this.validator.allValid()) {
      const data = {
        departamento:
          this.state.departamento !== "" && this.state.departamento !== null
            ? this.state.departamento.value
            : null,
        zona: this.state.codigo,
      };
      Alerts.loading_reload(true);
      Request.POST("zonas_departamento", data).then((result) => {
        Alerts.loading_reload(false);

        if (result !== false) {
          if (result.status === 201) {
            Alerts.toast("¡Departamento asignado exitosamente!", "success");
            this.refs.tabla.getData(
              `zonas_departamento/${this.props.match.params.id}/all`
            );

            this.setState({
              departamento: "",
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
      code: props.id,
    };

    Alerts.Question(
      "¿Desea eliminar el departamento de la zona?",
      "Administración de zonas"
    ).then((resp) => {
      if (resp) {
        Alerts.loading_reload(true);

        Request.DELETE("/zonas_departamento", data).then((result) => {
          Alerts.loading_reload(false);

          if (result !== false) {
            if (result.status === 200) {
              this.refs.tabla.getData(
                `zonas_departamento/${this.props.match.params.id}/all`
              );
              Alerts.alertSuccessDelete("asignación de departamento", "zonas");
            } else {
              Alerts.alertErrorDelete("asignación de departamento", "zonas");
            }
          }
        });
      }
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
      return <Redirect to="/organizacion/zonas" />;
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
              <div className="col-lg-6 form-group">
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
              <div className="col-lg-6 form-group">
                <label htmlFor="">Departamento:(*)</label>

                <Select
                  id="departamento"
                  name="departamento"
                  placeholder="Selecione una opción"
                  options={this.state.departamentos}
                  value={this.state.departamento}
                  isClearable={true}
                  isDisabled={this.state.disabled_select_departamento}
                  onChange={(e) => {
                    this.setState({ departamento: e });
                  }}
                />
                {this.validator.message(
                  "departamento",
                  this.state.departamento,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "departamento",
                      this.state.departamento,
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
            <hr class="m-t-0 m-b-1" />
            <h3 class="box-title">Departamentos Asignados</h3>
            <hr class="m-t-0 m-b-2" />
            <div className="row p-t-20">
              <div className="col-lg-12">
                <TablaFilter
                  ref="tabla"
                  ruta={`zonas_departamento/${this.props.match.params.id}/all`}
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
