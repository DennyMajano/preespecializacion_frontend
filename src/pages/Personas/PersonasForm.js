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
import ExtFile from "../../services/ExtFile";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default class PersonasForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.initial_state;
    this.phoneNumberExists = this.phoneNumberExists.bind(this);
    this.mailExists = this.mailExists.bind(this);
    this.documentNumberExists = this.documentNumberExists.bind(this);
    this.switchEditForms = this.switchEditForms.bind(this);
    this.deleteAccess = this.deleteAccess.bind(this);
    this.toggleImageForm = this.toggleImageForm.bind(this);
    this.init_validator();
  }

  initial_state = {
    title: this.props.match.params.id
      ? "Actualización de persona"
      : "Registro de persona",
    //Para registro de la persona
    id:null,
    codigo:null,
    nombre: null,
    apellido: null,
    telefono: null,
    sexo: null,
    fotoPerfil: null, //P
    nacionalidad: null,
    fechaNacimiento: null, 
    departamentoNacimiento:null,
    municipioNacimiento: null,
    cantonNacimiento: null,
    departamentoResidencia: null,
    municipioResidencia: null,
    cantonResidencia: null,
    tipoDocumento: null,
    numeroDocumento: "",
    estadoCivil: null,
    profesion: null,
    direccion: null,
    //Para creacion de usuario
    createUser: false,
    userId: null,
    iglesia: null,
    correo_electronico: null,
    rol: null,
    alias: "",

    //auxiliares
    sexos: [],
    departamentos: [],
    municipiosNacimiento: null,
    cantonesNacimiento:null,
    municipiosResidencia: null,
    cantonesResidencia:null,
    nacionalidades: [],
    tiposDocumento: [],
    estadosCiviles: [],
    profesiones: [],
    iglesias:[],
    roles: [],


    //Auxiliares para edicion
    canEdit: false,
    isForCreate: this.props.match.params.id?false:true,
    hasUser: false,
    disabled_select_rol: true,
    disabled_select_persona: true,
    disabled_select_iglesi: true,
    correo: "",
    
    phoneExists: null,
    mailExists: null,
    documentExists: null,

    loading: false,
    redirect: false,
    modalImageIsOpen: false,
    changingFoto: false,
  };
timer_cuentas = null;

  
  getPersonToUpdate(){
    if(this.props.match.params.id){
      Alerts.loading_reload(true)
      HTTP.findById(this.props.match.params.id, "personas").then((result) => {
        console.log(result);
        if (result.estado !== false) {
          this.setState({
            id:result.estado.id,
            codigo:result.estado.codigo,
            nombre: result.estado.nombres,
            apellido: result.estado.apellidos,
            telefono: result.estado.telefono,
            sexo: result.estado.sexo,
            nacionalidad: result.estado.nacionalidad,
            fechaNacimiento: result.estado.fecha_nacimiento, 
            departamentoNacimiento:result.estado.departemento_nacimiento,
            municipioNacimiento: result.estado.municipio_nacimiento,
            cantonNacimiento: result.estado.canton_nacimiento,
            departamentoResidencia: result.estado.departamento_residencia,
            municipioResidencia: result.estado.municipio_residencia,
            cantonResidencia: result.estado.canton_residencia,
            tipoDocumento: result.estado.tipo_documento,
            numeroDocumento: result.estado.numero_documento,
            estadoCivil: result.estado.estado_civil,
            profesion: result.estado.profesion_oficio,
            direccion: result.estado.direccion,
          });
          this.getPersonUserIfExists();
        } else {
          this.setState({ redirect: true });
        }
      });
    }
  }
  getPersonUserIfExists(){
    HTTP.findById(this.state.codigo,"usuarios/all").then(
      result => {
        this.setState(
          {
           hasUser: result.length?true:false,
           userId: result.length?result[0].id:0,
          }
        );
        Alerts.loading_reload(false);
      }
      
    )
  }
  //NEED
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };
  getSexos() {
    let data = [];

    HTTP.findAll("generales/comodin/sexo_persona").then((result) => {
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
  getSexosForSelect(inputValue, callback) {
    let data = [];

    HTTP.findAll("generales/comodin/sexo_persona").then((result) => {
        console.log(result);
        result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });
    });

    callback(data);
  }

  getNacionalidades() {
    let data = [];

    HTTP.findAll("generales/nacionalidad").then((result) => {
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
  getNacionalidadesForSelect = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "generales/nacionalidad").then((data) => {
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
  
  getProfesiones() {
    let data = [];

    HTTP.findAll("generales/profesiones").then((result) => {
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
  getProfesionesForSelect = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, "generales/profesiones").then((data) => {
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
  getIglesias() {
    let data = [];

    HTTP.findAll("iglesias/select").then((result) => {
        result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
          codigo: element.codigo
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
                codigo: element.codigo
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

  getDepartamentos() {
    let data = [];

    HTTP.findAll("generales/departamentos").then((result) => {
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

  getMunicipios(idDepartamento) {
    let data = [];

    HTTP.findById(idDepartamento,"generales/municipios").then((result) => {
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

  getCantones(idMunicipio) {
    let data = [];

    HTTP.findById(idMunicipio,"generales/cantones").then((result) => {
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
  getTiposDocumentos() {
    let data = [];

    HTTP.findAll("generales/tipo_documento").then((result) => {
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
  getEstadosCiviles() {
    let data = [];

    HTTP.findAll("generales/estado_civil").then((result) => {
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

  handleFileChange = (e) => {
    const idComponente = e.target.id;
    if (e.target.files[0] !== undefined) {
      let name = e.target.files[0].name;

      if (ExtFile.isImage(name)) {
        this.setState({
          [idComponente]: e.target.files[0],
        });
      } else {
        Alerts.alertEmpty(
          "¡El archivo seleccionado no es válido!",
          "Solo se permiten archivos PNG, JPG, JPEG",
          "warning"
        );
        e.target.value = null;
        this.setState({
          [idComponente]: null,
        });
      }
    } else {
      this.setState({
        [idComponente]: null,
      });
    }
  };
  //Cuando los componentes se han montado
  componentDidMount() {
    this.setState({ 
        sexos: this.getSexos(),
        nacionalidades: this.getNacionalidades(),
        departamentos: this.getDepartamentos(),
        tiposDocumento: this.getTiposDocumentos(),
        estadosCiviles: this.getEstadosCiviles(),
        profesiones: this.getProfesiones()
    });

    this.getPersonToUpdate();
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
    this.validatorUser = new SimpleReactValidator({ locale: "esp" });
  }

  hide_alert_validator() {
    this.validator.hideMessages();
    this.forceUpdate();
  }

  toggleImageForm() {
    this.setState((prevState) => ({
      modalImageIsOpen: !prevState.modalImageIsOpen,
    }));
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if ((this.validator.allValid() && this.state.createUser ===false) || (this.validator.allValid() && this.state.createUser === true && this.validatorUser.allValid()) ) {
      this.setState({ loading: true });
      if(!this.state.isForCreate){

        
        if(this.state.canEdit){
         
          const data3 ={
            "code":this.state.id,
            "codigo":this.state.codigo,
            "nombre":this.state.nombre,
            "apellido":this.state.apellido,
            "telefono":this.state.telefono,
            "sexo":this.state.sexo.value,
            "nacionalidad":this.state.nacionalidad.value,
            "fechaNacimiento":this.state.fechaNacimiento,
            "departamentoNacimiento":this.state.departamentoNacimiento.value,
            "municipioNacimiento":this.state.municipioNacimiento.value,
            "cantonNacimiento":this.state.cantonNacimiento.value,
            "departamentoResidencia":this.state.departamentoResidencia.value,
            "municipioResidencia":this.state.municipioResidencia.value,
            "cantonResidencia":this.state.cantonResidencia.value,
            "tipoDocumento":this.state.tipoDocumento.value,
            "numeroDocumento":this.state.numeroDocumento,
            "estadoCivil":this.state.estadoCivil.value,
            "profesion":this.state.profesion.value,
            "direccion":this.state.direccion,
          }
          HTTP.update(data3,"persona","personas","personas").then(
            result =>{
              
              if(!this.state.createUser){
                this.setState({redirect:true});
              }
             
            }
          );
        }
        
        if(this.state.createUser === true){
          console.log("USER UPDATE");
          const userData = {
            "iglesia":this.state.iglesia.codigo,
            "correo_electronico":this.state.correo_electronico,
            "rol":this.state.rol.value,
            "alias":this.state.alias,
            "persona": this.state.codigo
          }
          HTTP.create(userData,"usuario","usuarios","usuarios").then(
            result =>{
              this.setState({redirect:true});
            }
          );
      }
      }
      else{
        
        const data = new FormData();
        data.append("nombre",this.state.nombre);
        data.append("apellido",this.state.apellido);
        data.append("telefono",this.state.telefono);
        data.append("sexo",this.state.sexo.value);
        data.append("nacionalidad",this.state.nacionalidad.value);
        data.append("fechaNacimiento",this.state.fechaNacimiento);
        data.append("departamentoNacimiento",this.state.departamentoNacimiento.value);
        data.append("municipioNacimiento",this.state.municipioNacimiento.value);
        data.append("cantonNacimiento",this.state.cantonNacimiento.value);
        data.append("departamentoResidencia",this.state.departamentoResidencia.value);
        data.append("municipioResidencia",this.state.municipioResidencia.value);
        data.append("cantonResidencia",this.state.cantonResidencia.value);
        data.append("tipoDocumento",this.state.tipoDocumento.value);
        data.append("numeroDocumento",this.state.numeroDocumento);
        data.append("estadoCivil",this.state.estadoCivil.value);
        data.append("profesion",this.state.profesion.value);
        data.append("direccion",this.state.direccion);
        if (this.state.fotoPerfil !== null) {
            data.append(
              "fotoPerfil",
              this.state.fotoPerfil,
              this.state.fotoPerfil.name ? this.state.fotoPerfil.name : ""
            );
        }
  
        if(this.state.createUser === true){
            data.append("createUser",1);
            data.append("iglesia",this.state.iglesia.codigo);
            data.append("correo_electronico",this.state.correo_electronico);
            data.append("rol",this.state.rol.value);
            data.append("alias",this.state.alias);
        }
  
        HTTP.create(data, "persona", "personas", "personas").then(
            (result) => {
              this.setState({ loading: false });
              if (result.data.result>0) {
                this.setState({ redirect: true });
              }
            }
          );
      }
    } else {
      this.validator.showMessages();
      if(this.state.createUser === true) this.validatorUser.showMessages();
      this.forceUpdate();
    }
  };

  changeFoto = async (e) =>{
    this.setState({changingFoto: true});
    const data = new FormData();
    data.append(
      "fotoPerfil",
      this.state.fotoPerfil,
      this.state.fotoPerfil.name ? this.state.fotoPerfil.name : ""
    );
      data.append(
        "userId",
        this.state.id,
      );
    HTTP.create(data, "persona", "personas", "personas/avatar").then(
      (result) => {
        this.setState({changingFoto: false});
        this.toggleImageForm();
      }
    );
  }
  /** Inicio validaciones  */
  timer_correo = null;

  validar_correo(correo) {
    clearTimeout(this.timer_correo);

    if (this.props.match.params.id) {
      if (this.state.correo_old !== null && correo !== this.state.correo_old) {
        this.timer_correo = setTimeout(() => {
          Request.GET("usuarios/validar/correo", correo).then((result) => {
            if (result !== false) {
              if (result.status === 200) {
                if (result.data.valor > 0) {
                  this.setState({ correo_existe: true });
                } else {
                  this.setState({ correo_existe: false });
                }
              } else {
                this.setState({ correo_existe: false });
              }
            } else {
              this.setState({ correo_existe: false });
            }
          });
        }, 800);
      }
    } else {
      this.timer_correo = setTimeout(() => {
        Request.GET("usuarios/validar/correo", correo).then((result) => {
          if (result !== false) {
            if (result.status === 200) {
              if (result.data.valor > 0) {
                this.setState({ correo_existe: true });
              } else {
                this.setState({ correo_existe: false });
              }
            } else {
              this.setState({ correo_existe: false });
            }
          } else {
            this.setState({ correo_existe: false });
          }
        });
      }, 800);
    }
  }
  timerMailExist = null;
  mailExists() {
    clearTimeout(this.timerMailExist);
    if(this.state.correo_electronico !== ""){
      this.timerMailExist = setTimeout(() => {
        Request.GET("usuarios/validar/correo", this.state.correo_electronico).then((result) => {
          if(result.status === 200){
            this.setState({mailExists: result.data.valor === 1});
          }   
        });
      }, 800);
    }
    
  }
  timerPhoneExist = null;
  phoneNumberExists() {
    clearTimeout(this.timerPhoneExist);
    if(this.state.telefono !== ""){
      this.timerPhoneExist = setTimeout(() => {
        Request.GET("personas/phone", this.state.telefono).then((result) => {
          if(result.status === 200){
            this.setState({phoneExists: true});
          }
          else if(result.status === 404){
            this.setState({phoneExists: false});
          }
          
        });
      }, 800);
    }
    
  }
  timerDocumentExist = null;
  documentNumberExists() {
    clearTimeout(this.timerDocumentExist);
    if(this.state.numeroDocumento !== ""){
      this.timerDocumentExist = setTimeout(() => {
        Request.GET("personas/document", this.state.numeroDocumento).then((result) => {
          if(result.status === 200){
            this.setState({documentExists: true});
          }
          else if(result.status === 404){
            this.setState({documentExists: false});
          }
          
        });
      }, 800);
    }
    
  }
  /**Fin validciones de unicos */


  // UI funciones
  validatorMessage(name,state, extraOptions=""){
    
    return this.validator.message(
      name,
      this.state[state],
      "required"+extraOptions
     ) && (
      <span className="label label-light-danger">
        {this.validator.message(
        name,
        this.state[state],
        "required"+extraOptions
      )}
      </span>
    )
    
  }
  validatorMessageUser(name,state, extraOptions=""){
    
    return this.validatorUser.message(
      name,
      this.state[state],
      "required"+extraOptions
     ) && (
      <span className="label label-light-danger">
        {this.validator.message(
        name,
        this.state[state],
        "required"+extraOptions
      )}
      </span>
    )
    
  }


  switchEditForms(){
    this.setState({
      canEdit: !this.state.canEdit
    });
  }

  deleteAccess(){
    const data = {
      code: this.state.userId
    }
  HTTP.disable(data,"usuario","Usuarios","usuarios").then(
    result => {
      this.setState({redirect: result})
    }
  );
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/administracion/personas" />;
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
                  disabled={this.state.loading || !this.state.canEdit}
                >
                  <i className="fa fa-save mr-2"></i>
                  {this.state.loading === false ? "GUARDAR" : "GUARDANDO..."}
                </button>
              </div>
            </div>
                }
                tools = {
                  (!this.state.isForCreate && 
                  
                    
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick = {this.switchEditForms}
                  >
                    <i className="fa fa-edit mr-2"></i>EDITAR CAMPOS
                  </button>)
                } >
    
            <div className="form-body">
              <fieldset disabled = {(this.state.isForCreate === false && this.state.canEdit === false)}>     
                <div className="row">

                    <div className="col-lg-3 form-group">
                    <label htmlFor="nombre">Nombre:(*)</label>

                    <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre"
                    id="nombre"
                    name="nombre"
                    value={this.state.nombre}
                    onChange={this.handleInputChange}
                    />
                    {this.validatorMessage("nombre","nombre")}
                    </div>
                    <div className="col-lg-3 form-group">
                    <label htmlFor="apellido">Apellido:(*)</label>

                    <input
                    type="text"
                    className="form-control"
                    placeholder="Apellido"
                    id="apellido"
                    name="apellido"
                    value={this.state.apellido}
                    onChange={this.handleInputChange}
                    />
                    {this.validatorMessage("apellido","apellido")}
                </div>
                    <div className="col-lg-3 form-group">
                    <label htmlFor="telefono">Teléfono:(*)</label>

                    <input
                    type="tel"
                    className="form-control"
                    placeholder="5555-5555"
                    id="telefono"
                    name="telefono"
                    value={this.state.telefono}
                    onChange={this.handleInputChange}
                    onKeyUp={this.phoneNumberExists}
                    />
                    {this.validatorMessage("telefono","telefono")}
                    {
                    this.state.phoneExists === true ? (
                      <span className="label label-light-danger">
                        Este teléfono ya existe
                      </span>
                    ) : null
                    }
                </div>
                    <div className="col-lg-3 form-group">
                    <label htmlFor="sexo">Sexo: (*)</label>
                    <SimpleSelect
                        isDisabled = {(this.state.isForCreate === false && this.state.canEdit === false)}
                        id="sexo"
                        name="sexo"
                        placeholder="Seleccione una opción"
                        value={this.state.sexo}
                        options={this.state.sexos}
                        onChange={(e) => {
                            // this.handleFocusSelect(true)
                            this.setState({ sexo: e });
                          }}
                        noOptionsMessage={() => {
                        return "No existen datos";
                    }} />
                    {this.validatorMessage("sexo","sexo")}
                </div>
                    <div className="col-lg-3 form-group">
                    <label htmlFor="nacionalidad">Nacionalidad: (*)</label>
                    <AsyncSelect
                    isDisabled = {(this.state.isForCreate === false && this.state.canEdit === false)}
                        id="nacionalidad"
                        name="nacionalidad"
                        placeholder="Seleccione una opción"
                        value={this.state.nacionalidad}
                        defaultOptions={this.state.nacionalidades}
                        loadOptions = {this.getNacionalidadesForSelect}
                        onChange={(e) => {
                            // this.handleFocusSelect(true)
                            this.setState({ nacionalidad: e });
                          }}
                        noOptionsMessage={() => {
                        return "No existen datos";
                    }} />
                    {this.validatorMessage("nacionalidad","nacionalidad")}
                </div>
                    <div className="col-lg-3 form-group">
                    <label htmlFor="fechaNacimiento">Fecha de nacimiento:(*)</label>

                    <input
                    type="date"
                    className="form-control"
                    placeholder="dd-mm-yyyy"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={this.state.fechaNacimiento}
                    onChange={this.handleInputChange}
                    />
                    {this.validatorMessage("fecha de nacimiento","fechaNacimiento")}
                </div>
                    <div className="col-lg-3 form-group">
                    <label htmlFor="estadoCivil">Estado civil: (*)</label>
                    <SimpleSelect
                        isDisabled = {(this.state.isForCreate === false && this.state.canEdit === false)}
                        id="estadoCivil"
                        name="estadoCivil"
                        placeholder="Seleccione una opción"
                        value={this.state.estadoCivil}
                        options={this.state.estadosCiviles}
                        onChange={(e) => {
                            // this.handleFocusSelect(true)
                            this.setState({ 
                                estadoCivil: e
                            });
                          }}
                        noOptionsMessage={() => {
                        return "No existen datos";
                    }} />
                    {this.validatorMessage("Estado civil","estadoCivil")}
                </div>
                    <div className="col-lg-3 form-group">
                    <label htmlFor="profesion">Profesión: (*)</label>
                    <AsyncSelect

                    isDisabled = {(this.state.isForCreate === false && this.state.canEdit === false)}
                        id="profesion"
                        name="profesion"
                        placeholder="Seleccione una opción"
                        value={this.state.profesion}
                        defaultOptions={this.state.profesiones}
                        loadOptions = {this.getProfesionesForSelect}
                        onChange={(e) => {
                            // this.handleFocusSelect(true)
                            this.setState({ 
                                profesion: e
                            });
                          }}
                        noOptionsMessage={() => {
                        return "No existen datos";
                    }} />
                    {/*this.validatorMessage("Profesión","profesion")*/}
                </div>
                    <div className="col-lg-6 form-group">
                    <label htmlFor="direccion">Dirección:(*)</label>

                    <input
                    type="text"
                    className="form-control"
                    placeholder="Av. las palmeras..."
                    id="direccion"
                    name="direccion"
                    value={this.state.direccion}
                    onChange={this.handleInputChange}
                    />
                    {this.validatorMessage("dirección","direccion")}
                </div>
                    <div className="col-lg-3 form-group" hidden={!this.state.isForCreate}>
                        <label htmlFor="fotoPerfil">Fotografía:</label>
                        <input
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        className="form-control"
                        placeholder="Imagen"
                        id="fotoPerfil"
                        name="fotoPerfil"
                        onChange={this.handleFileChange}
                        />
                    </div>

                </div>    
                <div className="row">
                  <div className="col-lg-4 form-group">
                      <label htmlFor="departamentoNacimiento">Departamento de nacimiento: (*)</label>
                      <SimpleSelect
                        isDisabled = {(this.state.isForCreate === false && this.state.canEdit === false)}
                          id="departamentoNacimiento"
                          name="departamentoNacimiento"
                          placeholder="Seleccione una opción"
                          value={this.state.departamentoNacimiento}
                          options={this.state.departamentos}
                          onChange={(e) => {
                              // this.handleFocusSelect(true)
                              this.setState({ 
                                  departamentoNacimiento: e,
                                  municipiosNacimiento: this.getMunicipios(e.value)
                              
                              });
                            }}
                          noOptionsMessage={() => {
                          return "No existen datos";
                      }} />
                      {this.validatorMessage("Departamento de nacimiento","departamentoNacimiento")}
                  </div>
                  <div className="col-lg-4 form-group">
                      <label htmlFor="municipioNacimiento">Municipio de nacimiento: (*)</label>
                      <SimpleSelect
                          isDisabled = {(this.state.municipiosNacimiento == null && this.state.isForCreate ) || (this.state.isForCreate === false && this.state.canEdit === false)}
                          id="municipioNacimiento"
                          name="municipioNacimiento"
                          placeholder="Seleccione una opción"
                          value={this.state.municipioNacimiento}
                          options={this.state.municipiosNacimiento}
                          onChange={(e) => {
                              // this.handleFocusSelect(true)
                              this.setState({ 
                                  municipioNacimiento: e ,
                                  cantonesNacimiento: this.getCantones(e.value)
                              });
                            }}
                          noOptionsMessage={() => {
                          return "No existen datos";
                      }} />
                      {this.validatorMessage("Municipio de nacimiento","municipioNacimiento")}
                  </div>
                  <div className="col-lg-4 form-group">
                      <label htmlFor="cantonNacimiento">Cantón de nacimiento: (*)</label>
                      <SimpleSelect
                      isDisabled = {(this.state.cantonesNacimiento == null && this.state.isForCreate ) || (this.state.isForCreate === false && this.state.canEdit === false)}
                          id="cantonNacimiento"
                          name="cantonNacimiento"
                          placeholder="Seleccione una opción"
                          value={this.state.cantonNacimiento}
                          options={this.state.cantonesNacimiento}
                          on
                          onChange={(e) => {
                              // this.handleFocusSelect(true)
                              this.setState({ 
                                  cantonNacimiento: e
                              });
                            }}
                          noOptionsMessage={() => {
                          return "No existen datos";
                      }} />
                      {this.validatorMessage("Cantón de nacimiento","cantonNacimiento")}
                  </div>

                  <div className="col-lg-4 form-group">
                      <label htmlFor="departamentoResidencia">Departamento de residencia: (*)</label>
                      <SimpleSelect
                      isDisabled = {(this.state.isForCreate === false && this.state.canEdit === false)}
                          id="departamentoResidencia"
                          name="departamentoResidencia"
                          placeholder="Seleccione una opción"
                          value={this.state.departamentoResidencia}
                          options={this.state.departamentos}
                          onChange={(e) => {
                              // this.handleFocusSelect(true)
                              this.setState({ 
                                  departamentoResidencia: e,
                                  municipiosResidencia: this.getMunicipios(e.value)
                              
                              });
                            }}
                          noOptionsMessage={() => {
                          return "No existen datos";
                      }} />
                      {this.validatorMessage("Departamento de residencia","departamentoResidencia")}
                  </div>
                  <div className="col-lg-4 form-group">
                      <label htmlFor="municipioResidencia">Municipio de residencia: (*)</label>
                      <SimpleSelect
                        isDisabled = {(this.state.municipiosResidencia == null && this.state.isForCreate ) ||(this.state.isForCreate === false && this.state.canEdit === false)}
                          id="municipioResidencia"
                          name="municipioResidencia"
                          placeholder="Seleccione una opción"
                          value={this.state.municipioResidencia}
                          options={this.state.municipiosResidencia}
                          onChange={(e) => {
                              // this.handleFocusSelect(true)
                              this.setState({ 
                                  municipioResidencia: e ,
                                  cantonesResidencia: this.getCantones(e.value)
                              });
                            }}
                          noOptionsMessage={() => {
                          return "No existen datos";
                      }} />
                      {this.validatorMessage("Municipio de residencia","municipioResidencia")}
                  </div>
                  <div className="col-lg-4 form-group">
                    <label htmlFor="cantonResidencia">Cantón de residencia: (*)</label>
                    <SimpleSelect
                    isDisabled = {(this.state.cantonesResidencia == null && this.state.isForCreate ) ||(this.state.isForCreate === false && this.state.canEdit === false)}
                        id="cantonResidencia"
                        name="cantonResidencia"
                        placeholder="Seleccione una opción"
                        value={this.state.cantonResidencia}
                        options={this.state.cantonesResidencia}
                        onChange={(e) => {
                            // this.handleFocusSelect(true)
                            this.setState({ 
                                cantonResidencia: e
                            });
                          }}
                        noOptionsMessage={() => {
                        return "No existen datos";
                    }} />
                    {this.validatorMessage("Cantón de residencia","cantonResidencia")}
                </div>

            </div>
                <div className="row">
                    <div className="col-lg-3 form-group">
                        <label htmlFor="tipoDocumento">Tipo de documento: (*)</label>
                        <SimpleSelect
                        isDisabled = {(this.state.isForCreate === false && this.state.canEdit === false)}
                            id="tipoDocumento"
                            name="tipoDocumento"
                            placeholder="Seleccione una opción"
                            value={this.state.tipoDocumento}
                            options={this.state.tiposDocumento}
                            onChange={(e) => {
                                // this.handleFocusSelect(true)
                                this.setState({ tipoDocumento: e });
                            }}
                            noOptionsMessage={() => {
                            return "No existen datos";
                        }} />
                        {this.validatorMessage("Tipo de documento","tipoDocumento")}
                    </div>
                    <div className="col-lg-3 form-group">
                    <label htmlFor="numeroDocumento">Número de documento:(*)</label>

                    <input
                    type="text"
                    className="form-control"
                    placeholder="numero de documento"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    value={this.state.numeroDocumento}
                    onChange={this.handleInputChange}
                    onKeyUp={this.documentNumberExists}
                    />
                    {this.validatorMessage("Número de documento","numeroDocumento")}
                    {
                        this.state.documentExists === true ? (
                          <span className="label label-light-danger">
                            Este numero de documento ya existe
                          </span>
                        ) : null
                        }
                </div>
 
                </div>
              </fieldset>
                <div className="row">
                    <div className="col-lg-6 form-group" hidden = {this.state.hasUser}>
                        <input
                        type="checkbox"
                        className="form-check-input filled-in chk-col-light-blue"
                        id="usa_sistema"
                        checked = {this.state.createUser}
                        onChange={(e)=>{
                            this.setState({
                                createUser: e.target.checked,
                                iglesias: this.getIglesias(),
                                roles: this.getRoles()
                            })
                        }}
                        />
                        <label className="form-check-label mt-4" htmlFor="usa_sistema">
                        Crear usuario de acceso al sistema
                        </label>
                    </div>
                    <div className="col-lg-6 form-group" hidden = {!this.state.hasUser}>
                      <div class="alert alert-warning" role="alert">
                        <div className="mb-2">
                        Esta persona tiene un usuario con acceso al sistema
                        </div>
                        <button type ="button" className="btn btn-danger" onClick={this.deleteAccess}>ELIMINAR ACCESO</button>
                      </div>
                        
                    </div>
                    <div className="col-lg-6 form-group" hidden={this.state.isForCreate}>
                        
                      <div class="alert alert-info  " role="alert">
                      <div className="mb-2">
                          Cambiar la foto de perfil de la persona
                        </div>
                      <button
                          type="button"
                          className="btn btn-info"
                          onClick={this.toggleImageForm}
                         
                        >
                          <i className="fa fa-pencil mr-2"></i>
                          CAMBIAR FOTO DE PERFIL
                        </button></div>
                          
                    </div>
                </div>
                <div className="row" hidden = {!this.state.createUser}>
                    <div className="col-lg-3 form-group">
                        <label htmlFor="alias">Alias:(*)</label>

                        <input
                        type="text"
                        className="form-control"
                        placeholder="Alias"
                        id="alias"
                        name="alias"
                        disabled = {!this.state.createUser}
                        value={this.state.alias}
                        onChange={this.handleInputChange}
                        />
                        {this.validatorMessageUser("alias","alias")}
                    </div>
                    <div className="col-lg-3 form-group">
                        <label htmlFor="correo_electronico">Correo electrónico:(*)</label>

                        <input
                        type="text"
                        className="form-control"
                        placeholder="ejemplo@mail.com"
                        id="correo_electronico"
                        name="correo_electronico"
                        value={this.state.correo_electronico}
                        onChange={this.handleInputChange}
                        onKeyUp = {this.mailExists}
                        />
                        {this.validatorMessageUser("Correo electrónico","correo_electronico","|email")}
                        {
                        this.state.mailExists === true ? (
                          <span className="label label-light-danger">
                            Este correo electrónico ya existe
                          </span>
                        ) : null
                        }
                    </div>

                    <div className="col-lg-3 form-group">
                        <label htmlFor="iglesia">Iglesia: (*)</label>
                        <AsyncSelect
                        
                            id="iglesia"
                            name="iglesia"
                            placeholder="Seleccione una opción"
                            value={this.state.iglesia}
                            defaultOptions={this.state.iglesias}
                            loadOptions = {this.getIglesiasForSelect}
                            onChange={(e) => {
                                // this.handleFocusSelect(true)
                                this.setState({ iglesia: e });
                            }}
                            noOptionsMessage={() => {
                            return "No existen datos";
                        }} />
                        {this.validatorMessageUser("iglesia","iglesia")}
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
                                    rol: e
                                });
                            }}
                            noOptionsMessage={() => {
                            return "No existen datos";
                        }} />
                        {this.validatorMessageUser("rol","rol")}
                    </div>
 
                </div>
            </div>
            <Modal
              size="lg"
              style={{ maxWidth: "80%", width: "50%" }}
              isOpen={this.state.modalImageIsOpen}
              centered={true}
            >
              <ModalHeader toggle={this.toggleImageForm}>
                Cambiar foto de perfil
              </ModalHeader>
              <ModalBody>
                <form>
                  <div class="form-group">
                    <label for="fotoPerfil">Nueva foto de perfil</label>
                      <input
                          type="file"
                          accept=".png,.jpeg,.jpg"
                          className="form-control"
                          placeholder="Imagen"
                          id="fotoPerfil"
                          name="fotoPerfil"
                          onChange={this.handleFileChange}
                          />
                  </div>
                          
                </form>
              </ModalBody>
              <ModalFooter className="text-right">
              <button
                    type="button"
                    className="btn btn-info"
                    onClick = {this.changeFoto}
                    disabled ={this.state.changingFoto}
                  >
                    <i className="fa fa-edit mr-2"></i>{this.state.changingFoto?"GUARDANDO":"GUARDAR"}
                  </button>
              </ModalFooter>
            </Modal>
          
            </LayoutPanelFormulario>
        </React.Fragment>
    );
  }
}
