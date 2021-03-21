import React, { Component } from "react";

import AsyncSelect from "react-select/async";
import SimpleSelect from "react-select";
import HTTP from "../../helpers/HTTP";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";
import Request from "../../services/Request";
import Alerts from "../../services/Alerts";
import ExtFile from "../../services/ExtFile";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Fragment } from "react";

/**
 * Para utilizar este componente basicamente se necesita
 * Metodos
 * -getPersonaFormData
 * -getPersonaData
 * -disableFields(status) //Para habilitar o deshabilitar campos
 *
 * Props para el componente
 * -codigoPersona  //que es para especificar cuando cargue que recupere los datos de iuna persona por ese codigo P-xxxxx
 * -onPersonaNotExists //metodo a ejecutar cuando no exista persona
 * -OnPersonaLoaded //metodo cuando la persona existe y se termina de cargar;
 */

export default class PersonaFormComponent extends Component {
  constructor(props) {
    super(props);
    this.disableFields = this.disableFields.bind(this);
    this.phoneNumberExists = this.phoneNumberExists.bind(this);
    this.documentNumberExists = this.documentNumberExists.bind(this);
    this.toggleImageForm = this.toggleImageForm.bind(this);
    this.init_validator();
    this.state = {
      id: -1,
      codigo: "",
      nombre: "",
      apellido: "",
      telefono: "",
      sexo: null,
      fotoPerfil: null,
      nacionalidad: null,
      fechaNacimiento: "",
      departamentoNacimiento: null,
      municipioNacimiento: null,
      cantonNacimiento: null,
      departamentoResidencia: null,
      municipioResidencia: null,
      cantonResidencia: null,
      tipoDocumento: null,
      numeroDocumento: "",
      estadoCivil: null,
      profesion: null,
      direccion: "",

      //Listas
      sexos: [],
      departamentos: [],
      municipiosNacimiento: null,
      cantonesNacimiento: null,
      municipiosResidencia: null,
      cantonesResidencia: null,
      nacionalidades: [],
      tiposDocumento: [],
      estadosCiviles: [],
      profesiones: [],

      documentExists: null,
      phoneExists: null,
      forUpdate: this.props.codigoPersona ? true : false,
      disabledFields: this.props.codigoPersona ? true : false,

      modalImageIsOpen: false,
      changingFoto: false,
    };
  }

  componentDidMount() {
    this.setState({
      sexos: this.getSexos(),
      nacionalidades: this.getNacionalidades(),
      departamentos: this.getDepartamentos(),
      tiposDocumento: this.getTiposDocumentos(),
      estadosCiviles: this.getEstadosCiviles(),
      profesiones: this.getProfesiones(),
    });

    this.getPersonToUpdate();
  }
  getPersonToUpdate() {
    if (this.props.codigoPersona) {
      HTTP.findById(this.props.codigoPersona, "personas").then((result) => {
        console.log(result);
        console.log(typeof result);
        if (result !== false) {
          // if (result.estado !== false) {
          this.setState({
            id: result.estado.id,
            codigo: result.estado.codigo,
            nombre: result.estado.nombres,
            apellido: result.estado.apellidos,
            telefono: result.estado.telefono,
            sexo: result.estado.sexo,
            nacionalidad: result.estado.nacionalidad,
            fechaNacimiento: result.estado.fecha_nacimiento,
            departamentoNacimiento: result.estado.departemento_nacimiento,
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
          if (this.props.onPersonaLoaded) {
            this.props.onPersonaLoaded();
          }
        } else {
          if (this.props.onPersonaNotExists) {
            this.props.onPersonaNotExists();
          }
        }
      });
    }
  }

  changeFoto = async (e) => {
    this.setState({ changingFoto: true });
    const data = new FormData();
    data.append(
      "fotoPerfil",
      this.state.fotoPerfil,
      this.state.fotoPerfil.name ? this.state.fotoPerfil.name : ""
    );
    data.append("userId", this.state.id);
    HTTP.create(data, "persona", "personas", "personas/avatar").then(
      (result) => {
        this.setState({ changingFoto: false });
        this.toggleImageForm();
      }
    );
  };

  //Validaciones
  timerPhoneExist = null;
  phoneNumberExists() {
    clearTimeout(this.timerPhoneExist);
    if (this.state.telefono !== "") {
      this.timerPhoneExist = setTimeout(() => {
        Request.GET("personas/phone", this.state.telefono).then((result) => {
          if (result.status === 200) {
            this.setState({ phoneExists: true });
          } else if (result.status === 404) {
            this.setState({ phoneExists: false });
          }
        });
      }, 800);
    }
  }
  timerDocumentExist = null;
  documentNumberExists() {
    clearTimeout(this.timerDocumentExist);
    if (this.state.numeroDocumento !== "") {
      this.timerDocumentExist = setTimeout(() => {
        Request.GET("personas/document", this.state.numeroDocumento).then(
          (result) => {
            if (result.status === 200) {
              this.setState({ documentExists: true });
            } else if (result.status === 404) {
              this.setState({ documentExists: false });
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
  //Obtencion de datos
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

    HTTP.findById(idDepartamento, "generales/municipios").then((result) => {
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

    HTTP.findById(idMunicipio, "generales/cantones").then((result) => {
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
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };
  toggleImageForm() {
    this.setState((prevState) => ({
      modalImageIsOpen: !prevState.modalImageIsOpen,
    }));
  }
  /**
   *
   * @returns JSON con todos los valores para personas, inlcuyendo codigo e id si se recuperaron al pasar id en props
   */
  getPersonaData() {
    return {
      id: this.state.id,
      codigo: this.state.codigo,
      nombre: this.state.nombre,
      apellido: this.state.apellido,
      telefono: this.state.telefono,
      sexo: this.state.sexo.value,
      fotoPerfil: this.state.fotoPerfil,
      nacionalidad: this.state.nacionalidad.value,
      fechaNacimiento: this.state.fechaNacimiento,
      departamentoNacimiento: this.state.departamentoNacimiento.value,
      municipioNacimiento: this.state.municipioNacimiento.value,
      cantonNacimiento: this.state.cantonNacimiento.value,
      departamentoResidencia: this.state.departamentoResidencia.value,
      municipioResidencia: this.state.municipioResidencia.value,
      cantonResidencia: this.state.cantonResidencia.value,
      tipoDocumento: this.state.tipoDocumento.value,
      numeroDocumento: this.state.numeroDocumento,
      estadoCivil: this.state.estadoCivil.value,
      profesion: this.state.profesion.value,
      direccion: this.state.direccion,
    };
  }
  /**
   *
   * @returns FormData de los campos para persona incluyendo el de fotografia si se llenó
   */
  getPersonaFormData() {
    const personaFormData = new FormData();
    personaFormData.append("nombre", this.state.nombre);
    personaFormData.append("apellido", this.state.apellido);
    personaFormData.append("telefono", this.state.telefono);
    personaFormData.append("sexo", this.state.sexo.value);
    personaFormData.append("nacionalidad", this.state.nacionalidad.value);
    personaFormData.append("fechaNacimiento", this.state.fechaNacimiento);
    personaFormData.append(
      "departamentoNacimiento",
      this.state.departamentoNacimiento.value
    );
    personaFormData.append(
      "municipioNacimiento",
      this.state.municipioNacimiento.value
    );
    personaFormData.append(
      "cantonNacimiento",
      this.state.cantonNacimiento.value
    );
    personaFormData.append(
      "departamentoResidencia",
      this.state.departamentoResidencia.value
    );
    personaFormData.append(
      "municipioResidencia",
      this.state.municipioResidencia.value
    );
    personaFormData.append(
      "cantonResidencia",
      this.state.cantonResidencia.value
    );
    personaFormData.append("tipoDocumento", this.state.tipoDocumento.value);
    personaFormData.append("numeroDocumento", this.state.numeroDocumento);
    personaFormData.append("estadoCivil", this.state.estadoCivil.value);
    personaFormData.append("profesion", this.state.profesion.value);
    personaFormData.append("direccion", this.state.direccion);

    console.log("FOrm data");
    console.log(personaFormData);

    if (this.state.fotoPerfil !== null) {
      personaFormData.append(
        "fotoPerfil",
        this.state.fotoPerfil,
        this.state.fotoPerfil.name ? this.state.fotoPerfil.name : "foto"
      );
    }
    return personaFormData;
  }
  /**
   *
   * @param {boolean} status - true para deshabilitar, false para habilitar los campos
   */
  disableFields(status) {
    this.setState({ disabledFields: status });
  }
  findPerson(codigo) {
    HTTP.findById(codigo, "personas").then((result) => {
      console.log(result);
      console.log(typeof result);
      if (result !== false) {
        // if (result.estado !== false) {
        this.setState({
          id: result.estado.id,
          codigo: result.estado.codigo,
          nombre: result.estado.nombres,
          apellido: result.estado.apellidos,
          telefono: result.estado.telefono,
          sexo: result.estado.sexo,
          nacionalidad: result.estado.nacionalidad,
          fechaNacimiento: result.estado.fecha_nacimiento,
          departamentoNacimiento: result.estado.departemento_nacimiento,
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
        if (this.props.onPersonaLoaded) {
          this.props.onPersonaLoaded();
        }
      } else {
        if (this.props.onPersonaNotExists) {
          this.props.onPersonaNotExists();
        }
      }
    });
  }
  render() {
    return (
      <Fragment>
        <fieldset
          disabled={
            this.state.disabledFields //para habilitar o deshabilitar los campos
          }
        >
          <div className="row">
            <div className="col-lg-12">
              <h3 className="box-title">Identificación</h3>
              <hr className="mt-0 mb-4"></hr>
            </div>
            <div className="col-lg-3 form-group">
              <label htmlFor="tipoDocumento">Tipo de documento: (*)</label>
              <SimpleSelect
                isDisabled={
                  this.state.disabledFields //para deshabilitar el campo, esto porque como no es un campo de HTML normal al poner disable el fieldset no le afecta
                }
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
                }}
              />
              {this.validatorMessage("Tipo de documento", "tipoDocumento")}
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
              {this.validatorMessage("Número de documento", "numeroDocumento")}
              {this.state.documentExists === true ? (
                <span className="label label-light-danger">
                  Este numero de documento ya existe
                </span>
              ) : null}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <h3 className="box-title">Datos personales</h3>
              <hr className="mt-0 mb-4"></hr>
            </div>
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
              {this.validatorMessage("nombre", "nombre")}
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
              {this.validatorMessage("apellido", "apellido")}
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
              {this.validatorMessage("telefono", "telefono")}
              {this.state.phoneExists === true ? (
                <span className="label label-light-danger">
                  Este teléfono ya existe
                </span>
              ) : null}
            </div>
            <div className="col-lg-3 form-group">
              <label htmlFor="sexo">Sexo: (*)</label>
              <SimpleSelect
                isDisabled={
                  this.state.disabledFields //para deshabilitar el campo, esto porque como no es un campo de HTML normal al poner disable el fieldset no le afecta
                }
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
                }}
              />
              {this.validatorMessage("sexo", "sexo")}
            </div>
            <div className="col-lg-3 form-group">
              <label htmlFor="nacionalidad">Nacionalidad: (*)</label>
              <AsyncSelect
                isDisabled={
                  this.state.disabledFields //para deshabilitar el campo, esto porque como no es un campo de HTML normal al poner disable el fieldset no le afecta
                }
                id="nacionalidad"
                name="nacionalidad"
                placeholder="Seleccione una opción"
                value={this.state.nacionalidad}
                defaultOptions={this.state.nacionalidades}
                loadOptions={this.getNacionalidadesForSelect}
                onChange={(e) => {
                  // this.handleFocusSelect(true)
                  this.setState({ nacionalidad: e });
                }}
                noOptionsMessage={() => {
                  return "No existen datos";
                }}
              />
              {this.validatorMessage("nacionalidad", "nacionalidad")}
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
              {this.validatorMessage("fecha de nacimiento", "fechaNacimiento")}
            </div>
            <div className="col-lg-3 form-group">
              <label htmlFor="estadoCivil">Estado civil: (*)</label>
              <SimpleSelect
                isDisabled={
                  this.state.disabledFields //para deshabilitar el campo, esto porque como no es un campo de HTML normal al poner disable el fieldset no le afecta
                }
                id="estadoCivil"
                name="estadoCivil"
                placeholder="Seleccione una opción"
                value={this.state.estadoCivil}
                options={this.state.estadosCiviles}
                onChange={(e) => {
                  // this.handleFocusSelect(true)
                  this.setState({
                    estadoCivil: e,
                  });
                }}
                noOptionsMessage={() => {
                  return "No existen datos";
                }}
              />
              {this.validatorMessage("Estado civil", "estadoCivil")}
            </div>
            <div className="col-lg-3 form-group">
              <label htmlFor="profesion">Profesión: (*)</label>
              <AsyncSelect
                isDisabled={
                  this.state.disabledFields //para deshabilitar el campo, esto porque como no es un campo de HTML normal al poner disable el fieldset no le afecta
                }
                id="profesion"
                name="profesion"
                placeholder="Seleccione una opción"
                value={this.state.profesion}
                defaultOptions={this.state.profesiones}
                loadOptions={this.getProfesionesForSelect}
                onChange={(e) => {
                  // this.handleFocusSelect(true)
                  this.setState({
                    profesion: e,
                  });
                }}
                noOptionsMessage={() => {
                  return "No existen datos";
                }}
              />
              {this.validatorMessage("Profesión", "profesion")}
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
              {this.validatorMessage("dirección", "direccion")}
            </div>
            <div
              className="col-lg-3 form-group"
              hidden={this.state.forUpdate} //para ocultar el campo de fotografia cuando sea usado para actualizar, ya que se usa un boton espefico para eso mas abajo cuando es para actualizar
            >
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
            <div className="col-lg-12">
              <h3 className="box-title">Datos de ubicación</h3>
              <hr className="mt-0 mb-4"></hr>
            </div>
            <div className="col-lg-4 form-group">
              <label htmlFor="departamentoNacimiento">
                Departamento de nacimiento: (*)
              </label>
              <SimpleSelect
                isDisabled={
                  this.state.disabledFields //para deshabilitar el campo, esto porque como no es un campo de HTML normal al poner disable el fieldset no le afecta
                }
                id="departamentoNacimiento"
                name="departamentoNacimiento"
                placeholder="Seleccione una opción"
                value={this.state.departamentoNacimiento}
                options={this.state.departamentos}
                onChange={(e) => {
                  // this.handleFocusSelect(true)
                  this.setState({
                    departamentoNacimiento: e,
                    municipiosNacimiento: this.getMunicipios(e.value),
                  });
                }}
                noOptionsMessage={() => {
                  return "No existen datos";
                }}
              />
              {this.validatorMessage(
                "Departamento de nacimiento",
                "departamentoNacimiento"
              )}
            </div>
            <div className="col-lg-4 form-group">
              <label htmlFor="municipioNacimiento">
                Municipio de nacimiento: (*)
              </label>
              <SimpleSelect
                isDisabled={this.state.municipiosNacimiento == null}
                id="municipioNacimiento"
                name="municipioNacimiento"
                placeholder="Seleccione una opción"
                value={this.state.municipioNacimiento}
                options={this.state.municipiosNacimiento}
                onChange={(e) => {
                  // this.handleFocusSelect(true)
                  this.setState({
                    municipioNacimiento: e,
                    cantonesNacimiento: this.getCantones(e.value),
                  });
                }}
                noOptionsMessage={() => {
                  return "No existen datos";
                }}
              />
              {this.validatorMessage(
                "Municipio de nacimiento",
                "municipioNacimiento"
              )}
            </div>
            <div className="col-lg-4 form-group">
              <label htmlFor="cantonNacimiento">
                Cantón de nacimiento: (*)
              </label>
              <SimpleSelect
                isDisabled={this.state.cantonesNacimiento == null}
                id="cantonNacimiento"
                name="cantonNacimiento"
                placeholder="Seleccione una opción"
                value={this.state.cantonNacimiento}
                options={this.state.cantonesNacimiento}
                on
                onChange={(e) => {
                  // this.handleFocusSelect(true)
                  this.setState({
                    cantonNacimiento: e,
                  });
                }}
                noOptionsMessage={() => {
                  return "No existen datos";
                }}
              />
              {this.validatorMessage(
                "Cantón de nacimiento",
                "cantonNacimiento"
              )}
            </div>

            <div className="col-lg-4 form-group">
              <label htmlFor="departamentoResidencia">
                Departamento de residencia: (*)
              </label>
              <SimpleSelect
                isDisabled={this.state.disabledFields}
                id="departamentoResidencia"
                name="departamentoResidencia"
                placeholder="Seleccione una opción"
                value={this.state.departamentoResidencia}
                options={this.state.departamentos}
                onChange={(e) => {
                  // this.handleFocusSelect(true)
                  this.setState({
                    departamentoResidencia: e,
                    municipiosResidencia: this.getMunicipios(e.value),
                  });
                }}
                noOptionsMessage={() => {
                  return "No existen datos";
                }}
              />
              {this.validatorMessage(
                "Departamento de residencia",
                "departamentoResidencia"
              )}
            </div>
            <div className="col-lg-4 form-group">
              <label htmlFor="municipioResidencia">
                Municipio de residencia: (*)
              </label>
              <SimpleSelect
                isDisabled={this.state.municipiosResidencia == null}
                id="municipioResidencia"
                name="municipioResidencia"
                placeholder="Seleccione una opción"
                value={this.state.municipioResidencia}
                options={this.state.municipiosResidencia}
                onChange={(e) => {
                  // this.handleFocusSelect(true)
                  this.setState({
                    municipioResidencia: e,
                    cantonesResidencia: this.getCantones(e.value),
                  });
                }}
                noOptionsMessage={() => {
                  return "No existen datos";
                }}
              />
              {this.validatorMessage(
                "Municipio de residencia",
                "municipioResidencia"
              )}
            </div>
            <div className="col-lg-4 form-group">
              <label htmlFor="cantonResidencia">
                Cantón de residencia: (*)
              </label>
              <SimpleSelect
                isDisabled={this.state.cantonesResidencia == null}
                id="cantonResidencia"
                name="cantonResidencia"
                placeholder="Seleccione una opción"
                value={this.state.cantonResidencia}
                options={this.state.cantonesResidencia}
                onChange={(e) => {
                  // this.handleFocusSelect(true)
                  this.setState({
                    cantonResidencia: e,
                  });
                }}
                noOptionsMessage={() => {
                  return "No existen datos";
                }}
              />
              {this.validatorMessage(
                "Cantón de residencia",
                "cantonResidencia"
              )}
            </div>
          </div>
        </fieldset>

        <div className="row">
          <div className="col-lg-6 form-group" hidden={!this.state.forUpdate}>
            <div className="alert alert-info  " role="alert">
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
              </button>
            </div>
          </div>
        </div>

        {this.UIChangeFotoModal()}
      </Fragment>
    );
  }

  UIChangeFotoModal() {
    return (
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
            <div className="form-group">
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
            onClick={this.changeFoto}
            disabled={this.state.changingFoto}
          >
            <i className="fa fa-edit mr-2"></i>
            {this.state.changingFoto ? "GUARDANDO" : "GUARDAR"}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}
