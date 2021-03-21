import React, { Component } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import AsyncSelect from "react-select/async";
import SimpleSelect from "react-select";
import HTTP from "../../helpers/HTTP";
import { Redirect } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";
import Request from "../../services/Request";
import Alerts from "../../services/Alerts";
import PersonaFormComponent from "../../components/Personas/PersonaFormComponent";

export default class PersonasForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.initial_state;
    this.mailExists = this.mailExists.bind(this);
    this.switchEditForms = this.switchEditForms.bind(this);
    this.deleteAccess = this.deleteAccess.bind(this);
    this.onPersonaNotExists = this.onPersonaNotExists.bind(this);
    this.onPersonaLoaded = this.onPersonaLoaded.bind(this);
    this.init_validator();
  }

  initial_state = {
    title: this.props.match.params.codigo
      ? "Actualización de persona"
      : "Registro de persona",

    //Para creacion de usuario
    createUser: false,
    userId: "",
    iglesia: null,
    correo_electronico: "",
    rol: null,
    alias: "",

    //auxiliares PErsonas

    //Auxiliares usuarios
    iglesias: [],
    roles: [],

    //Auxiliares para edicion
    canEdit: this.props.match.params.codigo ? false : true,
    isForCreate: this.props.match.params.codigo ? false : true,
    creatingUser: false,
    hasUser: false,

    mailExists: null,

    //persona
    documentExists: null,
    phoneExists: null,

    loading: false,
    redirect: false,
  };
  timer_cuentas = null;

  //NEED
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  //Cuando los componentes se han montado
  componentDidMount() {
    if (this.props.match.params.codigo) Alerts.loading_reload(true);
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
    this.validatorUser = new SimpleReactValidator({ locale: "esp" });
  }

  onSubmit = async (e) => {
    e.preventDefault();

    if (
      (this.refs.personaForm.validator.allValid() &&
        this.state.createUser === false) ||
      (this.refs.personaForm.validator.allValid() &&
        this.state.createUser === true &&
        this.validatorUser.allValid())
    ) {
      this.setState({ loading: true });
      //Obtenemos los datos de la persona del componente
      //el codigo y id sino estan se encuentran en null
      const personData = this.refs.personaForm.getPersonaData();

      if (!this.state.isForCreate) {
        if (this.state.canEdit) {
          HTTP.update(personData, "persona", "personas", "personas").then(
            (result) => {
              if (!this.state.createUser) {
                this.setState({ redirect: true });
              }
            }
          );
        }

        if (this.state.createUser === true) {
          const userData = {
            iglesia: this.state.iglesia.codigo,
            correo_electronico: this.state.correo_electronico,
            rol: this.state.rol.value,
            alias: this.state.alias,
            persona: personData.codigo,
          };

          HTTP.create(userData, "usuario", "usuarios", "usuarios").then(
            (result) => {
              this.setState({ redirect: true });
            }
          );
        }
      } else {
        const formDataPersonForInsert = this.refs.personaForm.getPersonaFormData();

        if (this.state.createUser === true) {
          formDataPersonForInsert.append("createUser", 1);
          formDataPersonForInsert.append("iglesia", this.state.iglesia.codigo);
          formDataPersonForInsert.append(
            "correo_electronico",
            this.state.correo_electronico
          );
          formDataPersonForInsert.append("rol", this.state.rol.value);
          formDataPersonForInsert.append("alias", this.state.alias);
        }

        HTTP.create(
          formDataPersonForInsert,
          "persona",
          "personas",
          "personas"
        ).then((result) => {
          this.setState({ loading: false });
          if (result.data.result > 0) {
            this.setState({ redirect: true });
          }
        });
      }
    } else {
      this.refs.personaForm.validator.showMessages();
      if (this.state.createUser === true) this.validatorUser.showMessages();
      this.forceUpdate();
    }
  };

  //USUARIO
  validatorMessageUser(name, state, extraOptions = "") {
    return (
      this.validatorUser.message(
        name,
        this.state[state],
        "required" + extraOptions
      ) && (
        <span className="label label-light-danger">
          {this.validator.message(
            name,
            this.state[state],
            "required" + extraOptions
          )}
        </span>
      )
    );
  }

  switchEditForms() {
    this.setState({
      canEdit: !this.state.canEdit,
    });

    this.refs.personaForm.disableFields(this.state.canEdit);
  }

  //Par usuarios

  getRoles() {
    let data = [];

    HTTP.findAll("roles/select").then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.name,
          value: element.rol_id,
        });
      });
    });

    return data;
  }

  getPersonUserIfExists() {
    
    HTTP.findById(this.props.match.params.codigo, "usuarios/all").then((result) => {
      this.setState({
        hasUser: result.length ? true : false,
        userId: result.length ? result[0].id : 0,
      });
      Alerts.loading_reload(false);
    });
  }
  deleteAccess() {
    const data = {
      code: this.state.userId,
    };
    HTTP.disable(data, "usuario", "Usuarios", "usuarios").then((result) => {
      this.setState({ redirect: result });
    });
  }
  getIglesias() {
    let data = [];

    HTTP.findAll("iglesias/select").then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
          codigo: element.codigo,
        });
      });
    });

    return data;
  }

  getIglesiasForSelect = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "iglesias/select").then((data) => {
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

  timerMailExist = null;
  mailExists() {
    clearTimeout(this.timerMailExist);
    if (this.state.correo_electronico !== "") {
      this.timerMailExist = setTimeout(() => {
        Request.GET(
          "usuarios/validar/correo",
          this.state.correo_electronico
        ).then((result) => {
          if (result.status === 200) {
            this.setState({ mailExists: result.data.valor === 1 });
          }
        });
      }, 800);
    }
  }

  onPersonaNotExists(){
    this.setState({redirect: true});
  }
  onPersonaLoaded(){
    this.getPersonUserIfExists();
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/recursos_humanos/personas" />;
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
                  <i className="fa fa-close mr-2"></i>CANCELAR
                </button>

                <button
                  type="button"
                  className="btn btn-info"
                  onClick={this.onSubmit}
                  disabled={
                    this.state.loading ||
                    !(this.state.canEdit || this.state.createUser)
                  }
                >
                  <i className="fa fa-save mr-2"></i>
                  {this.state.loading === false ? "GUARDAR" : "GUARDANDO..."}
                </button>
              </div>
            </div>
          }
          tools={
            !this.state.isForCreate && (
              <button
                type="button"
                className="btn btn-info"
                onClick={this.switchEditForms}
              >
                <i className="fa fa-edit mr-2"></i>EDITAR CAMPOS
              </button>
            )
          }
        >
          <PersonaFormComponent
            ref="personaForm"
            codigoPersona={this.props.match.params.codigo}
            onPersonaNotExists = {this.onPersonaNotExists}
            onPersonaLoaded = {this.onPersonaLoaded}
          ></PersonaFormComponent>


          <div className="form-body">
            <div className="row">
              <div className="col-lg-6 form-group" hidden={this.state.hasUser}>
                <input
                  type="checkbox"
                  className="form-check-input filled-in chk-col-light-blue"
                  id="usa_sistema"
                  checked={this.state.createUser}
                  onChange={(e) => {
                    this.setState({
                      createUser: e.target.checked,
                      iglesias: this.getIglesias(),
                      roles: this.getRoles(),
                    });
                  }}
                />
                <label className="form-check-label mt-4" htmlFor="usa_sistema">
                  Crear usuario de acceso al sistema
                </label>
              </div>
              <div className="col-lg-6 form-group" hidden={!this.state.hasUser}>
                <div className="alert alert-warning" role="alert">
                  <div className="mb-2">
                    Esta persona tiene un usuario con acceso al sistema
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.deleteAccess}
                  >
                    ELIMINAR ACCESO
                  </button>
                </div>
              </div>
            </div>
            <div className="row" hidden={!this.state.createUser}>
              <div className="col-lg-3 form-group">
                <label htmlFor="alias">Alias:(*)</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Alias"
                  id="alias"
                  name="alias"
                  disabled={!this.state.createUser}
                  value={this.state.alias}
                  onChange={this.handleInputChange}
                />
                {this.validatorMessageUser("alias", "alias")}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="correo_electronico">
                  Correo electrónico:(*)
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="ejemplo@mail.com"
                  id="correo_electronico"
                  name="correo_electronico"
                  value={this.state.correo_electronico}
                  onChange={this.handleInputChange}
                  onKeyUp={this.mailExists}
                />
                {this.validatorMessageUser(
                  "Correo electrónico",
                  "correo_electronico",
                  "|email"
                )}
                {this.state.mailExists === true ? (
                  <span className="label label-light-danger">
                    Este correo electrónico ya existe
                  </span>
                ) : null}
              </div>

              <div className="col-lg-3 form-group">
                <label htmlFor="iglesia">Iglesia: (*)</label>
                <AsyncSelect
                  id="iglesia"
                  name="iglesia"
                  placeholder="Seleccione una opción"
                  value={this.state.iglesia}
                  defaultOptions={this.state.iglesias}
                  loadOptions={this.getIglesiasForSelect}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({ iglesia: e });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                />
                {this.validatorMessageUser("iglesia", "iglesia")}
              </div>
              <div className="col-lg-3 form-group">
                <label htmlFor="rol">Rol: (*)</label>
                <SimpleSelect
                  id="rol"
                  name="rol"
                  placeholder="Seleccione una opción"
                  value={this.state.rol}
                  options={this.state.roles}
                  onChange={(e) => {
                    // this.handleFocusSelect(true)
                    this.setState({
                      rol: e,
                    });
                  }}
                  noOptionsMessage={() => {
                    return "No existen datos";
                  }}
                />
                {this.validatorMessageUser("rol", "rol")}
              </div>
            </div>
          </div>
        </LayoutPanelFormulario>
      </React.Fragment>
    );
  }
}
