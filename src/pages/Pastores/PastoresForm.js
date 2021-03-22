import React, { Component } from "react";
import { Fragment } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import PersonaFormComponent from "../../components/Personas/PersonaFormComponent";
import PersonasBuscadorModal from "../../components/Personas/PersonasBuscadorModal";

import AsyncSelect from "react-select/async";
import HTTP from "../../helpers/HTTP";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";
import Request from "../../services/Request";
import Alerts from "../../services/Alerts";
import { Redirect } from "react-router";

export default class PastoresForm extends Component {
  initialState = {
    controlFormEdition: false,
    canEditForms: true,
    forUpdate: this.props.match.params.codigo ? true : false,
    redirect: false,
    loading: false,
    forCreate: this.props.match.params.codigo?false:true,
    personaExists: false,




    //datos del pastor a guardar
   /*  licenciaMinisterial: "",
    nivelPastoral: null,
    nivelAcademico: null,
    fechaInicioPastoral: "", */
    licenciaMinisterial: "xx",
    nivelPastoral: {label: "testNP",value:1},
    nivelAcademico: {label: "testNA",value:1},
    fechaInicioPastoral: "2020-03-03",

    //Datos adicionales a los anteriores
    codigoPastor: "",
    fechaRetiro: "",
    fallecido: null,

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
    this.setState({
      nivelesPastorales: this.getNivelesPastorales(),
      nivelesAcademicos: this.getNivelesAcademicos(),
    });
  }
  timer_cuentas = null;
  getNivelesPastorales() {
    let data = [];

    HTTP.findAll("nivel_pastor/select").then((result) => {
      console.log(result);
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });
    });

    return data;
  }
  getNivelesPastoralesForSelect = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "nivel_pastor/select").then((data) => {
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
  getNivelesAcademicos() {
    let data = [];

    HTTP.findAll("nivel_academico/select").then((result) => {
      console.log(result);
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });
    });

    return data;
  }
  getNivelesAcademicosForSelect = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "nivel_academico/select").then((data) => {
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

  async saveNewPastorAndPersona() {
 
    const pastorFormData = this.refs.personaForm.getPersonaFormData();
   
    pastorFormData.append("personaCode", this.refs.personaForm.state.codigo)
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
    console.log("EXA");
    for (var value of pastorFormData.values()) {
      console.log(value);
   }
   console.log("EXA1");
    HTTP.create(
      pastorFormData,
      "pastor",
      "Pastores",
      "pastores"
    ).then((result) => {
      console.log("RSULT CREATE PASTOR");
      console.log(result);
      this.setState({ loading: false });
      this.setState({ loading: false });
      if (result.data.data) {
        this.setState({ redirect: true });
      } 
    });

  }
  async saveNewPastorAndUpdatePerson(){
    const pastorData ={
      personaCode: this.refs.personaForm.state.codigo,
      licenciaMinisterial: this.state.licenciaMinisterial,
      nivelPastoral: this.state.nivelPastoral.value,
      nivelAcademico: this.state.nivelAcademico.value,
      fechaInicioPastoral: this.state.fechaInicioPastoral
    };

    const personaData = this.refs.personaForm.getPersonaData();
    const allData = {...pastorData,...personaData};
    HTTP.create(
      allData,
      "pastor",
      "Pastores",
      "pastores"
    ).then((result) => {
      console.log("RSULT CREATE PASTOR");
      console.log(result.data.data);
      this.setState({ loading: false });
      if (result.data.data) {
        this.setState({ redirect: true });
      } 
    });

   
    

  }
  async onSubmit(e){
    e.preventDefault();
    if(this.validator.allValid() && this.refs.personaForm.validator.allValid()){
      this.setState({ loading: true });

      if(this.state.personaExists){
        this.saveNewPastorAndUpdatePerson();
      }
      else{
        this.saveNewPastorAndPersona();
      }
     
    }
    else{
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
              console.log("Existe")
              this.setState({ licenciaMinisterialExists: true });
            } else{
              console.log("No existe")
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
        this.setState({ controlFormEdition: true, canEditForms: false, personaExists: true });
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
          {/* Parte para datos del pastor */}
          {this.UIFormDataPastor()}
          {/* Componente del formulario persona */}
          <PersonaFormComponent
            ref="personaForm"
            disableFields={!this.state.canEditForms}
          ></PersonaFormComponent>
        </LayoutPanelFormulario>

        <PersonasBuscadorModal
          ref="per"
          getPersona={this.setPersona}
          rutaAConsultar = "personas/activesNotPastores"
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
      </div>
    );
  }

  UIFormDataPastor() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-lg-12">
            <h3 className="box-title">Datos del pastor</h3>
            <hr className="mt-0 mb-4"></hr>
          </div>
          <div className="col-lg-3 form-group">
            <label htmlFor="licenciaMinisterial">
              Licencia ministerial:(*)
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="12345689"
              id="licenciaMinisterial"
              name="licenciaMinisterial"
              value={this.state.licenciaMinisterial}
              onChange={this.handleInputChange}
              onKeyUp={this.licenciaMinisterialExists}
            />
            {this.validatorMessage(
              "licencia ministerial",
              "licenciaMinisterial"
            )}
            {this.state.licenciaMinisterialExists === true ? (
              <span className="label label-light-danger">
                Esta licencia ministerial ya existe
              </span>
            ) : null}
          </div>
          <div className="col-lg-3 form-group">
            <label htmlFor="nivelPastoral">Nivel pastoral: (*)</label>
            <AsyncSelect
              isDisabled={this.state.nivelesPastorales === null}
              id="nivelPastoral"
              name="nivelPastoral"
              placeholder="Seleccione una opción"
              value={this.state.nivelPastoral}
              defaultOptions={this.state.nivelesPastorales}
              loadOptions={this.getNivelesPastoralesForSelect}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ nivelPastoral: e });
              }}
              noOptionsMessage={() => {
                return "No existen datos";
              }}
            />
            {this.validatorMessage("Nivel pastoral", "nivelPastoral")}
          </div>
          <div className="col-lg-3 form-group">
            <label htmlFor="nivelPastoral">Nivel académico: (*)</label>
            <AsyncSelect
              isDisabled={this.state.nivelesAcademicos === null}
              id="nivelAcademico"
              name="nivelAcademico"
              placeholder="Seleccione una opción"
              value={this.state.nivelAcademico}
              defaultOptions={this.state.nivelesAcademicos}
              loadOptions={this.getNivelesAcademicosForSelect}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ nivelAcademico: e });
              }}
              noOptionsMessage={() => {
                return "No existen datos";
              }}
            />
            {this.validatorMessage("Nivel académico", "nivelAcademico")}
          </div>
          <div className="col-lg-3 form-group">
            <label htmlFor="fechaNacimiento">
              Fecha de inicio pastoral:(*)
            </label>

            <input
              type="date"
              className="form-control"
              placeholder="dd-mm-yyyy"
              id="fechaInicioPastoral"
              name="fechaInicioPastoral"
              value={this.state.fechaInicioPastoral}
              onChange={this.handleInputChange}
            />
            {this.validatorMessage(
              "fecha de inicio pastoral",
              "fechaInicioPastoral"
            )}
          </div>
        </div>
      </Fragment>
    );
  }

  
  UIBottomButtonsMainCard(){
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
              disabled={
                this.state.loading
              }
            >
              <i className="fa fa-save mr-2"></i>
              {this.state.loading === false ? "GUARDAR" : "GUARDANDO..."}
            </button>
          </div>
        </div>
      
    );
  }
}
