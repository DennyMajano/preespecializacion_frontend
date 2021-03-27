import React, { Component } from "react";
import HTTP from "../../helpers/HTTP";
import SimpleReactValidator from "simple-react-validator";
import es from "../../helpers/ValidatorTranslate_es";
import Request from "../../services/Request";
import Alerts from "../../services/Alerts";
import ExtFile from "../../services/ExtFile";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Fragment } from "react";
import UIAsynSelect from "../UICommons/UIAsynSelect";
import UISelect from "../UICommons/UISelect";
import UIInput from "../UICommons/UIInput";

/**
 * Para utilizar este componente basicamente se necesita
 * Metodos
 * -getPersonaFormData
 * -getPersonaData
 * -disableFields(status) //Para habilitar o deshabilitar campos DEPRECATED
 * -findPersona(codigo) //para buscar una persona y mostrar los datos
 *
 * Props para el componente
 * -codigoPersona  //que es para especificar cuando cargue que recupere los datos de iuna persona por ese codigo P-xxxxx
 * -onPersonaNotExists //metodo a ejecutar cuando no exista persona
 * -OnPersonaLoaded //metodo cuando la persona existe y se termina de cargar;
 */

export default class PersonaFormComponent extends Component {
  constructor(props) {
    super(props);
    //this.disableFields = this.disableFields.bind(this);
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

      documentExists: null,
      phoneExists: null,
      forUpdate: this.props.codigoPersona ? true : false,
      disabledFields: this.props.codigoPersona ? true : false,

      modalImageIsOpen: false,
      changingFoto: false,
      showFotoUpdate: false,
      fieldsEdited: false,
    };
  }

  componentDidMount() {
    if (this.props.codigoPersona) {
      this.fillFromPersona(this.props.codigoPersona)
    }
  }


  fillFromPersona(code, onSucces=()=>{}, onFail=()=>{}){
    HTTP.findById(code, "personas").then((result) => {
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
        onSucces();
      } else {
        if (this.props.onPersonaNotExists) {
          this.props.onPersonaNotExists();
        }
        onFail();
      }
    });
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

  setForUpdateForm(status){
    this.setState({ forUpdate: status  });
  }
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
    this.setState({ [idComponente]: valorComponente, fieldsEdited: true });
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
  /*  disableFields(status) {
    this.setState({ disabledFields: status });
  } */
  findPerson(
    codigo,
    onFinally = () => {},
    onSuccess = () => {},
    onFail = () => {}
  ) {
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

          //Como se recuperaron datos de una persona que existe entonces es para actualizar
          forUpdate: true,
        });
        onSuccess();
      } else {
        onFail();
      }
      onFinally();
    });
  }
  render() {
    return (
      <Fragment>
        <fieldset
          disabled={
            this.props.disableFields ? this.props.disableFields : false //para habilitar o deshabilitar los campos
          }
        >
          <div className="row">
            <div className="col-lg-12">
              <h3 className="box-title">Identificación</h3>
              <hr className="mt-0 mb-4"></hr>
            </div>
            <UISelect
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="Tipo de documento: (*)"
              apiPath="generales/tipo_documento"
              id="tipoDocumento"
              value={this.state.tipoDocumento}
              onChange={(e) => {
                this.setState({ tipoDocumento: e });
              }}
              afterSelect={this.validatorMessage(
                "Tipo de documento",
                "tipoDocumento"
              )}
            ></UISelect>

            <UIInput
              type="text"
              id="numeroDocumento"
              placeholder="numero de documento"
              value={this.state.numeroDocumento}
              onChange={this.handleInputChange}
              label="Número de documento:(*)"
              inputProps={(this.state.forUpdate) ||{
                onKeyUp: this.documentNumberExists,
              }}
              afterInput={[
                this.validatorMessage("Número de documento", "numeroDocumento"),
                this.state.documentExists === true ? (
                  <span className="label label-light-danger">
                    Este numero de documento ya existe
                  </span>
                ) : null,
              ]}
            ></UIInput>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <h3 className="box-title">Datos personales</h3>
              <hr className="mt-0 mb-4"></hr>
            </div>
            <UIInput
              type="text"
              id="nombre"
              placeholder="Nombre"
              value={this.state.nombre}
              onChange={this.handleInputChange}
              label="Nombre:(*)"
              afterInput={this.validatorMessage("nombre", "nombre")}
            ></UIInput>
            <UIInput
              type="text"
              id="apellido"
              placeholder="Apellido"
              value={this.state.apellido}
              onChange={this.handleInputChange}
              label="Apellido:(*)"
              afterInput={this.validatorMessage("apellido", "apellido")}
            ></UIInput>
            <UIInput
              type="tel"
              id="telefono"
              placeholder="Telefono"
              value={this.state.telefono}
              onChange={this.handleInputChange}
              label="Teléfono:(*)"
              afterInput={this.validatorMessage("teléfono", "telefono")}
            ></UIInput>
            <UISelect
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="sexo: (*)"
              apiPath="generales/comodin/sexo_persona"
              id="sexo"
              value={this.state.sexo}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ sexo: e });
              }}
              afterSelect={this.validatorMessage("sexo", "sexo")}
            ></UISelect>
            <UIAsynSelect
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="Nacionalidad: (*)"
              apiPath="generales/nacionalidad"
              id="nacionalidad"
              value={this.state.nacionalidad}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ nacionalidad: e });
              }}
              afterSelect={this.validatorMessage(
                "nacionalidad",
                "nacionalidad"
              )}
            ></UIAsynSelect>
            <UIInput
              type="date"
              id="fechaNacimiento"
              placeholder="dd-mm-yyyy"
              value={this.state.fechaNacimiento}
              onChange={this.handleInputChange}
              label="Fecha de nacimiento:(*)"
              afterInput={this.validatorMessage("Fecha de nacimiento", "fechaNacimiento")}
            ></UIInput>
            
            <UISelect
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="Estado civil: (*)"
              apiPath="generales/estado_civil"
              id="estadoCivil"
              value={this.state.estadoCivil}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ estadoCivil: e });
              }}
              afterSelect={this.validatorMessage("Estado cívil", "estadoCivil")}
            ></UISelect>
            <UIAsynSelect
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="Profesión: (*)"
              apiPath="generales/profesiones"
              id="profesion"
              value={this.state.profesion}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({
                  profesion: e,
                });
              }}
              afterSelect={this.validatorMessage("profesión", "profesion")}
            ></UIAsynSelect>
            <UIInput
              type="text"
              id="direccion"
              placeholder="Dirección"
              value={this.state.direccion}
              onChange={this.handleInputChange}
              label="Dirección:(*)"
              afterInput={this.validatorMessage("Dirección", "direccion")}
            ></UIInput>
            
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

            <UISelect
              divClass="col-lg-4 form-group"
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="Departamento de nacimiento: (*)"
              apiPath="generales/departamentos"
              id="departamentoNacimiento"
              value={this.state.departamentoNacimiento}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ departamentoNacimiento: e });
                this.refs.municipioNacimiento.setDataByFilter(e.value);
              }}
              afterSelect={this.validatorMessage(
                "Departamento de nacimiento",
                "departamentoNacimiento"
              )}
            ></UISelect>

            <UISelect
              divClass="col-lg-4 form-group"
              loadDataAtMount={false}
              ref="municipioNacimiento"
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="Municipio de nacimiento: (*)"
              apiPath="generales/municipios"
              id="municipioNacimiento"
              value={this.state.municipioNacimiento}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ municipioNacimiento: e });
                this.refs.cantonNacimiento.setDataByFilter(e.value);
              }}
              afterSelect={this.validatorMessage(
                "Municipio de nacimiento",
                "municipioNacimiento"
              )}
            ></UISelect>

            <UISelect
              divClass="col-lg-4 form-group"
              loadDataAtMount={false}
              ref="cantonNacimiento"

              label="Cantón de nacimiento: (*)"
              apiPath="generales/cantones"
              id="cantonNacimiento"
              value={this.state.cantonNacimiento}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ cantonNacimiento: e });
              }}
              afterSelect={this.validatorMessage(
                "Cantón de nacimiento",
                "cantonNacimiento"
              )}
            ></UISelect>
            <UISelect
              divClass="col-lg-4 form-group"
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="Departamento de residencia: (*)"
              apiPath="generales/departamentos"
              id="departamentoResidencia"
              value={this.state.departamentoResidencia}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ departamentoResidencia: e });
                this.refs.municipioResidencia.setDataByFilter(e.value);
              }}
              afterSelect={this.validatorMessage(
                "Departamento de residencia",
                "departamentoResidencia"
              )}
            ></UISelect>

            <UISelect
              divClass="col-lg-4 form-group"
              loadDataAtMount={false}
              ref="municipioResidencia"
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="Municipio de residencia: (*)"
              apiPath="generales/municipios"
              id="municipioResidencia"
              value={this.state.municipioResidencia}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ municipioResidencia: e });
                this.refs.cantonResidencia.setDataByFilter(e.value);
              }}
              afterSelect={this.validatorMessage(
                "Municipio de residencia",
                "municipioResidencia"
              )}
            ></UISelect>
            <UISelect
              divClass="col-lg-4 form-group"
              loadDataAtMount={false}
              ref="cantonResidencia"
              isDisabled={
                this.props.disableFields ? this.props.disableFields : false
              }
              label="Cantón de residencia: (*)"
              apiPath="generales/cantones"
              id="cantonResidencia"
              value={this.state.cantonResidencia}
              onChange={(e) => {
                // this.handleFocusSelect(true)
                this.setState({ cantonResidencia: e });
              }}
              afterSelect={this.validatorMessage(
                "Cantón de residencia",
                "cantonResidencia"
              )}
            ></UISelect>
          </div>
        </fieldset>

        <div className="row">
          <div
            className="col-lg-6 form-group"
            hidden={!this.state.forUpdate || this.state.showFotoUpdate}
          >
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
