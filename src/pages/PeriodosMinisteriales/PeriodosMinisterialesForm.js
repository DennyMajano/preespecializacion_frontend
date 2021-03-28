import React, { Component } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import HTTP from "../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";
import InputNumberValidator from "../../helpers/InputNumberValidator";

export default class PeriodosMinisterialesForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.init_validator();
  }

  inicial_state = {
    title: this.props.match.params.id
      ? "Actualización de periodo ministerial"
      : "Registro de periodo ministerial",

    descripcion: "",
    anio: "",
    loading: false,

    redirect: false,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  componentDidMount() {
    document.getElementById("descripcion").focus();
    InputNumberValidator.validation();
    this.getById();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  hide_alert_validator() {
    this.validator.hideMessages();
    this.forceUpdate();
  }

  getById() {
    if (this.props.match.params.id) {
      HTTP.findById(this.props.match.params.id, "periodo").then((result) => {
        if (result !== false) {
          this.setState(result);
        } else {
          this.setState({ redirect: true });
        }
      });
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      this.setState({ loading: true });

      if (this.props.match.params.id) {
        const data = {
          codigo: this.props.match.params.id,
          anio: this.state.anio,
          descripcion: this.state.descripcion,
        };
        HTTP.update(
          data,
          "periodo ministerial",
          "periodos_ministeriales",
          "periodos"
        ).then((result) => {
          this.setState({ loading: false });
          if (result !== false) {
            this.setState({ redirect: true });
          }
        });
      } else {
        const data = {
          anio: this.state.anio,
          descripcion: this.state.descripcion,
        };
        HTTP.create(
          data,
          "periodo ministerial",
          "periodos_ministeriales",
          "periodos"
        ).then((result) => {
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

  render() {
    if (this.state.redirect) {
      return <Redirect to="/periodos_ministeriales" />;
    }
    return (
      <React.Fragment>
        <LayoutPanelFormulario
          titulo={this.state.title}
          submit={this.onSubmit}
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
                  <i className="fa fa-close mr-2"></i>CANCELAR
                </button>

                <button
                  type="submit"
                  className="btn btn-info"
                  disabled={this.state.loading}
                >
                  <i className="fa fa-save mr-2"></i>
                  {this.state.loading === false ? "GUARDAR" : "GUARDANDO..."}
                </button>
              </div>
            </div>
          }
        >
          <div className="form-body">
            <div className="row p-t-20">
              <div className="col-lg-6 form-group">
                <label htmlFor="">Descripción: (*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Descripción"
                  id="descripcion"
                  value={this.state.descripcion}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "Descripción",
                  this.state.descripcion,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message(
                      "Descripción",
                      this.state.descripcion,
                      "required"
                    )}
                  </span>
                )}
              </div>
              <div className="col-lg-6 form-group">
                <label htmlFor="">Año: (*)</label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Año del periodo ministerial"
                  id="anio"
                  value={this.state.anio}
                  onChange={this.handleInputChange}
                />
                {this.validator.message(
                  "anio",
                  this.state.anio,
                  "required"
                ) && (
                  <span className="label label-light-danger">
                    {this.validator.message("Año", this.state.anio, "required")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </LayoutPanelFormulario>
      </React.Fragment>
    );
  }
}
