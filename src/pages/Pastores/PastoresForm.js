import React, { Component } from "react";
import { Fragment } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import PersonaFormComponent from "../../components/Personas/PersonaFormComponent";
import PersonasBuscadorModal from "../../components/Personas/PersonasBuscadorModal";
import HTTP from "../../helpers/HTTP";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";
import Request from "../../services/Request";
import Alerts from "../../services/Alerts";
import { Redirect } from "react-router";
import UIInput from "../../components/UICommons/UIInput";
import UIAsynSelect from "../../components/UICommons/UIAsynSelect";
import UITextarea from "../../components/UICommons/UITextarea";
import UISelect from "../../components/UICommons/UISelect";

export default class PastoresForm extends Component {
  initialState = {
    controlFormEdition: false,
    canEditForms: true,
    forUpdate: this.props.match.params.codigo ? true : false,
    redirect: false,
    loading: false,
    personaExists: false,

    //datos del pastor a guardar
    licenciaMinisterial: "",
    nivelPastoral: null,
    nivelAcademico: null,
    fechaInicioPastoral: "",

    //Datos adicionales a los anteriores
    idPastor: "",
    codigoPastor: "",
    fechaRetiro: "",
    status: null,
    fallecido: false,
    biografia: "",
    memoria_fallecimiento: "", //Solo si esta fallecido
  
    //Auxiliares Pastores
    nivelesPastorales: null,
    nivelesAcademicos: null,

    //Existencia de documentos
    licenciaMinisterialExists: false,
  };
  constructor(props) {
    super(props);
    //declaraciones de funciones
    this.setPersona = this.setPersona.bind(this);
    this.switchFormsEdition = this.switchFormsEdition.bind(this);
    this.licenciaMinisterialExists = this.licenciaMinisterialExists.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.init_validator();
    this.state = this.initialState;
  }

  componentDidMount() {
    if (this.props.match.params.codigo) {
      this.getPastorData();
    }
  }
  getPastorData() {
    Alerts.loading_reload(true);
    HTTP.findById(this.props.match.params.codigo, "pastores").then((result) => {
      if (result !== false) {
        console.log(result);
        // if (result.estado !== false) {
        this.setState({
          idPastor: result.data.id,
          codigoPastor: result.data.codigo,
          licenciaMinisterial: result.data.licencia_ministerial,
          nivelPastoral: result.data.nivel_pastoral,
          nivelAcademico: result.data.nivel_academico,
          fechaInicioPastoral: result.data.fecha_inicio_pastoral,
          fechaRetiro: result.data.fecha_retiro,
          status: result.data.status,
          fallecido: result.data.fallecido,
          biografia: result.data.biografia,
          memoria_fallecimiento: result.data.memoria_fallecimiento, //Solo si esta fallecido
        });
        this.refs.personaForm.setForUpdateForm(true);
        this.refs.personaForm.fillFromPersona(result.data.persona, () => {
          Alerts.loading_reload(false);
        });
      } else {
      }
    });
  }

  async saveNewPastorAndPersona() {
    const pastorFormData = this.refs.personaForm.getPersonaFormData();

    pastorFormData.append("personaCode", this.refs.personaForm.state.codigo);
    pastorFormData.append(
      "licenciaMinisterial",
      this.state.licenciaMinisterial
    );
    pastorFormData.append("nivelPastoral", this.state.nivelPastoral.value);
    pastorFormData.append("nivelAcademico", this.state.nivelAcademico.value);
    pastorFormData.append(
      "fechaInicioPastoral",
      this.state.fechaInicioPastoral
    );
    pastorFormData.append("fechaRetiro", this.state.fechaRetiro);
    pastorFormData.append("status", this.state.status.value);
    pastorFormData.append("fallecido", this.state.fallecido === true ? 1 : 0);
    pastorFormData.append(
      "memoriaFallecimiento",
      this.state.memoria_fallecimiento
    );
    pastorFormData.append("biografia", this.state.biografia);
    console.log("EXA");
    for (var value of pastorFormData.values()) {
      console.log(value);
    }
    console.log("EXA1");
    HTTP.create(pastorFormData, "pastor", "Pastores", "pastores").then(
      (result) => {
        console.log("RSULT CREATE PASTOR");
        console.log(result);
        this.setState({ loading: false });
        this.setState({ loading: false });
        if (result.data.data) {
          this.setState({ redirect: true });
        }
      }
    );
  }
  async saveNewPastorAndUpdatePerson() {
    const pastorData = {
      personaCode: this.refs.personaForm.state.codigo,
      licenciaMinisterial: this.state.licenciaMinisterial,
      nivelPastoral: this.state.nivelPastoral.value,
      nivelAcademico: this.state.nivelAcademico.value,
      fechaInicioPastoral: this.state.fechaInicioPastoral,
      fechaRetiro:this.state.fechaRetiro !==""?this.state.fechaRetiro:null,
      status:this.state.status.value,
      fallecido:this.state.fallecido === true ? 1 : 0,
      memoriaFallecimiento:this.state.memoria_fallecimiento,
      biografia:this.state.biografia,
    };

    const personaData = this.refs.personaForm.getPersonaData();
    const allData = { ...pastorData, ...personaData };
    HTTP.create(allData, "pastor", "Pastores", "pastores").then((result) => {
      console.log("RSULT CREATE PASTOR");
      console.log(result.data);
      this.setState({ loading: false });
      if (result.data.data) {
        this.setState({ redirect: true });
      }
    });
  }

  async updatePastor() {
    const personaData = this.refs.personaForm.getPersonaData();
    const pastorData = {
      personaCode: this.refs.personaForm.state.codigo,
      codigoPastor: this.state.codigoPastor,
      licenciaMinisterial: this.state.licenciaMinisterial,
      nivelPastoral: this.state.nivelPastoral.value,
      nivelAcademico: this.state.nivelAcademico.value,
      fechaInicioPastoral: this.state.fechaInicioPastoral,
      fechaRetiro:this.state.fechaRetiro !==""?this.state.fechaRetiro:null,
      status:this.state.status.value,
      fallecido:this.state.fallecido === true ? 1 : 0,
      memoriaFallecimiento:this.state.memoria_fallecimiento==null?"":this.state.memoria_fallecimiento,
      biografia:this.state.biografia,
    };

    const personPastor = {...personaData,...pastorData};
    console.log(personPastor);
    HTTP.update(personPastor, "pastor", "pastores", "pastores").then(
      (result) => {
        console.log(result);
        //this.setState({redirect:true})
      }
    );
  }
  async onSubmit(e) {
    e.preventDefault();
    console.log("OnSubmit");
    console.log(this.refs.personaForm.validator.allValid());
    console.log(this.validator.allValid());
    if (
      this.validator.allValid() &&
      this.refs.personaForm.validator.allValid()
    ) {
      this.setState({ loading: true });
      console.log("OnSubmit2");
      if (this.state.forUpdate) {

        this.updatePastor();
      } else {
        console.log("OnSubmit4");
        if (this.state.personaExists) {
          console.log("OnSubmit5");
          this.saveNewPastorAndUpdatePerson();
        } else {
          console.log("OnSubmit6");
          this.saveNewPastorAndPersona();
        }
      }
    } else {
      console.log("OnSubmitERRO");
      this.refs.personaForm.validator.showMessages();
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  timerLicenciaMinisterialExists = null;
  licenciaMinisterialExists() {
    clearTimeout(this.timerLicenciaMinisterialExists);
    if (this.state.licenciaMinisterial !== "") {
      this.timerLicenciaMinisterialExists = setTimeout(() => {
        Request.GET("pastores", this.state.licenciaMinisterial).then(
          (result) => {
            if (result.status === 200 && result.data.data) {
              console.log("Existe");
              this.setState({ licenciaMinisterialExists: true });
            } else {
              console.log("No existe");
              this.setState({ licenciaMinisterialExists: false });
            }
          }
        );
      }, 800);
    }
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }
  validatorMessage(name, state, extraOptions = "") {
    return (
      this.validator.message(
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
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };
  setPersona(data) {
    Alerts.loading_reload(true);
    this.refs.personaForm.findPerson(
      data.codigo,
      () => {
        Alerts.loading_reload(false);
      },
      () => {
        this.setState({
          controlFormEdition: true,
          canEditForms: false,
          personaExists: true,
        });
      }
    );
  }

  switchFormsEdition() {
    this.setState((prevState) => ({
      canEditForms: !prevState.canEditForms,
    }));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/recursos_humanos/pastores" />;
    }

    return (
      <Fragment>
        <LayoutPanelFormulario
          titulo="Registro de pastores"
          tools={this.UItoolForMainCard()}
          buttons={this.UIBottomButtonsMainCard()}
        >
          {/* Parte para datos del pastor arriba*/}
          {this.UIFormDataPastorTop()}
          {/* Componente del formulario persona */}
          {/* Parte segunda del formulario de pastor */}
          {this.UIFormDataPastorBottom()}
          <PersonaFormComponent
            ref="personaForm"
            disableFields={!this.state.canEditForms}
          ></PersonaFormComponent>
        </LayoutPanelFormulario>

        <PersonasBuscadorModal
          ref="per"
          getPersona={this.setPersona}
          rutaAConsultar="personas/activesNotPastores"
        ></PersonasBuscadorModal>
      </Fragment>
    );
  }

  UItoolForMainCard() {
    return (
      <div>
        {this.state.controlFormEdition ? (
          <button
            type="button"
            className="btn btn-info"
            onClick={this.switchFormsEdition}
          >
            <i className="fa fa-edit mr-2"></i>EDITAR CAMPOS
          </button>
        ) : (
          ""
        )}
        {this.state.forUpdate || (
          <button
            type="button"
            className="btn btn-info ml-2 "
            onClick={() => {
              this.refs.per.toggle();
              console.log("clcik");
            }}
          >
            <i className="fa fa-search mr-2"></i>
            Buscar persona
          </button>
        )}
      </div>
    );
  }

  UIFormDataPastorTop() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-lg-12">
            <h3 className="box-title">Datos del pastor</h3>
            <hr className="mt-0 mb-4"></hr>
          </div>
          <UIInput
            id="licenciaMinisterial"
            value={this.state.licenciaMinisterial}
            onChange={this.handleInputChange}
            label="Licencia ministerial:(*)"
            placeholder="Licencia ministerial"
            afterInput={[
              this.state.licenciaMinisterialExists && (
                <span className="label label-light-danger">
                  Esta licencia ministerial ya existe
                </span>
              ),
              this.validatorMessage(
                "licencia ministerial",
                "licenciaMinisterial"
              ),
            ]}
            inputProps={
              this.state.forUpdate || {
                onKeyUp: this.licenciaMinisterialExists,
              }
            }
          ></UIInput>
          <UIAsynSelect
            label="Nivel pastoral: (*)"
            apiPath="nivel_pastor/select"
            id="nivelPastoral"
            value={this.state.nivelPastoral}
            onChange={(e) => {
              this.setState({ nivelPastoral: e });
            }}
            afterSelect={this.validatorMessage(
              "Nivel pastoral",
              "nivelPastoral"
            )}
          ></UIAsynSelect>
          <UIAsynSelect
            label="Nivel académico: (*)"
            apiPath="nivel_academico/select"
            id="nivelAcademico"
            value={this.state.nivelAcademico}
            onChange={(e) => {
              this.setState({ nivelAcademico: e });
            }}
            afterSelect={this.validatorMessage(
              "Nivel académico",
              "nivelAcademico"
            )}
          ></UIAsynSelect>

          <UIInput
            type="date"
            id="fechaInicioPastoral"
            placeholder="dd-mm-yyyy"
            value={this.state.fechaInicioPastoral}
            onChange={this.handleInputChange}
            label="Fecha de inicio pastoral:(*)"
            afterInput={this.validatorMessage(
              "Fecha de inicio pastoral",
              "fechaInicioPastoral"
            )}
          ></UIInput>
          <UIInput
            type="date"
            id="fechaRetiro"
            placeholder="dd-mm-yyyy"
            value={this.state.fechaRetiro}
            onChange={this.handleInputChange}
            label="Fecha de retiro:"
          ></UIInput>
          <UISelect
            label="Estado: (*)"
            id="status"
            options={[
              { label: "Activo", value: 1 },
              { label: "Con permiso", value: 3 },
              { label: "De baja", value: 0 },
              { label: "Retirado", value: 2 },
            ]}
            loadDataAtMount={false}
            value={this.state.status}
            onChange={(e) => {
              this.setState({ status: e });
            }}
            afterSelect={this.validatorMessage("Estado", "status")}
          ></UISelect>
          <div className="col-lg-6 form-group">
            <input
              type="checkbox"
              className="form-check-input filled-in chk-col-light-blue"
              id="usa_sistema"
              checked={this.state.fallecido}
              onChange={(e) => {
                this.setState({
                  fallecido: e.target.checked,
                });
              }}
            />
            <label className="form-check-label mt-4" htmlFor="usa_sistema">
              Fallecido
            </label>
          </div>
        </div>
      </Fragment>
    );
  }
  UIFormDataPastorBottom() {
    return (
      <div className="row">
        <UITextarea
          disabled={this.state.fallecido !== true}
          id="memoria_fallecimiento"
          placeholder="Memoria del pastor..."
          value={this.state.memoria_fallecimiento}
          onChange={this.handleInputChange}
          label="Memoria de fallecimiento:"
         
        ></UITextarea>
        <UITextarea
          id="biografia"
          placeholder="Nació en..."
          value={this.state.biografia}
          onChange={this.handleInputChange}
          label="Biografia del pastor:"
          
        ></UITextarea>
      </div>
    );
  }
  UIBottomButtonsMainCard() {
    return (
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
            disabled={this.state.loading}
          >
            <i className="fa fa-save mr-2"></i>
            {this.state.loading === false ? "GUARDAR" : "GUARDANDO..."}
          </button>
        </div>
      </div>
    );
  }
}
