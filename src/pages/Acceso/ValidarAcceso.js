import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import HTTP from "../../helpers/HTTP";
import SimpleReactValidator from "simple-react-validator";
import es from './../../helpers/ValidatorTranslate_es';
import Request from "../../services/Request";
import Alerts from "../../services/Alerts";


export default class ValidarAcceso extends Component {

  constructor(props){
    super(props);
    this.state = {
      passwordEquals:null,
      type: 0,
      estado: null,
      token: this.props.match.params.codigo,
      redirect: false,
      code: "",
      password1: "",
      password2:""
    }
    this.init_validator();
    this.onPasswordsEntered = this.onPasswordsEntered.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
   
  }
  init_validator() {
    SimpleReactValidator.addLocale("esp", es);
    this.validator = new SimpleReactValidator({ locale: "esp" });
  }

  detectTokenValidation(){

    HTTP.postRequest({
      token: this.state.token
    },"verify_token")
    .then(
      (result)=>{
        if(result !== false){
          console.log(result);
          this.setState({
            type: result.tipo,
            estado: result.estado
          })
        }
        else{
          console.log(":(");
        }
      }
    );
  }

  componentWillMount() {
   this.detectTokenValidation();
  }

  submitHandler(event){
    event.preventDefault();
    if(this.validator.allValid()){
      const data = {
        securityCode:this.state.code,
        newPassword:this.state.password1,
        token:this.state.token,
        type:this.state.type
      }

      Request.PUT("usuarios/change_password",data)
      .then(
        result => {
          console.log(result);
          if(result.data.estado == true){
            Alerts.alertEmpty(
              "Contraseña cambiada",
              "La contraseña ha sido cambiada correctamente",
              "success");
            this.setState({redirect: true})
          }
          else if(result.data.estado == false){
            Alerts.alertEmpty(
              "Codigo incorrecto",
              "El codigo de seguridad esta equivocado",
              "error");
          }
          else{
            Alerts.alertEmpty(
              "Error al procesar",
              "Ocurrió un error",
              "error");
          }
        }
      );
    }
    else{
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  inputChangeHandler(event){
    this.setState({
      [event.target.name]:event.target.value
    });
  }

  onPasswordsEntered(){
    if(this.state.password1 == this.state.password2){
      this.setState({
        passwordEquals: true
      });
    }
    else{
      this.setState({
        passwordEquals: false
      });
    }
  }

// UI funciones
  validatorMessage(name,state){
    
  return this.validator.message(
    name,
    this.state[state],
    "required"
   ) && (
    <span className="label label-light-danger">
      {this.validator.message(
      name,
      this.state[state],
      "required"
    )}
    </span>
  )
  
}
  formForNewPassword(){
    return (
      <React.Fragment>
                  <div className="login-box card">
            <div className="card-body">
              <form
                className="form-horizontal"
                onSubmit={this.submitHandler}
              >
                <h3 className="box-title m-b-20">Verificación de acceso</h3>
                {
                (this.state.type==2 || this.state.type==3) &&
                <div className="form-group ">
                  <div className="col-xs-12">
                    <label htmlFor="">Código de seguridad:</label>
                    {this.validatorMessage("code","code")}
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.code}
                      name="code"
                      placeholder="Ingrese código seguridad"
                      onChange ={this.inputChangeHandler}
                    />
                  </div>
                </div>
                
                }
                <div className="form-group">
                  <div className="col-xs-12">
                    <label htmlFor="">Nueva Contraseña:</label>
                   
                    <input
                      className="form-control"
                      type="password"
                      name="password1"
                      value={this.state.password1}
                      placeholder="Ingrese nueva contraseña"
                      onChange ={(event)=>{
                        this.inputChangeHandler(event);
                        this.onPasswordsEntered()

                      }}
                    />
                     {this.validatorMessage("Nueva Contraseña","password1")}
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-xs-12">
                    <label htmlFor="">Confirmar Contraseña:</label>
                    
                    <input
                      className="form-control"
                      type="password"
                      name="password2"
                      placeholder="Repita nueva contraseña"
                      value={this.state.password2}
                      onChange ={(event)=>{
                        this.inputChangeHandler(event);
                        this.onPasswordsEntered()

                      }}
                    />
                   {this.validator.message('Confirmar Contraseña', this.state.password2, `required|in:${this.state.password1}|min:6`, {messages: {in: 'Las contraseñas no coinciden',min:'Debe tener al menos 6 caracteres'}}) &&
                     <span className="label label-light-danger">
                     {this.validator.message('Confirmar Contraseña', this.state.password2, `required|in:${this.state.password1}|min:6`, {messages: {in: 'Las contraseñas no coinciden',min:'Debe tener al menos 6 caracteres'}})}
                   </span>
                   }
                  </div>
                </div>
                
                <div className="form-group text-center m-t-20">
                  <div className="col-xs-12">
                    <button
                      className="btn btn-inverse btn-lg btn-block text-uppercase waves-effect waves-light"
                      type="submit"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
      </React.Fragment>
    );
  }
  expiredMessage(){
    return(
      <React.Fragment>
        <div className="login-box card">
          <div className="card-body">
            <div className="text-center" ><h3>Solicitud expirada</h3></div>
            <button
              className="btn btn-inverse btn-lg btn-block text-uppercase waves-effect waves-light"
              type="button"
              onClick={()=>{ this.setState({redirect:true})}}
              >
                Aceptar
              </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
  renderCorrectUI(){
    if(this.state.estado == 1){
      return this.formForNewPassword();
    }
    else if(this.state.estado == 0){
      return this.expiredMessage();
    }
    else if(this.state.estado == -1){
      this.setState({
        redirect: true
      });
    }
  }
 
  render() {
    if(this.state.redirect){
      return (
        <React.Fragment>
          <Redirect to="/"></Redirect>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
      <section id="wrapper">
        <div
          className="login-register"
          style={{
            backgroundImage:
              "url(../assets/images/background/login-register.jpg)",
          }}
        >
          {this.renderCorrectUI()}
        </div>
      </section>
    </React.Fragment>
    );
  }
}
