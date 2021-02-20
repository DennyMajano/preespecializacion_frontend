import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import HTTP from '../../helpers/HTTP';
import SimpleReactValidator from "simple-react-validator";
import es from './../../helpers/ValidatorTranslate_es';


export default class SolicitarCorreoEnlace extends Component {

    constructor(props){
        super(props);
        this.state={
            email: "",
            redirect: false
        }
        this.init_validator();
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    init_validator() {
      SimpleReactValidator.addLocale("esp", es);
      this.validator = new SimpleReactValidator({ locale: "esp" });
    }

    onSubmitHandler(event){
      event.preventDefault();
      if(this.validator.allValid()){
        const data = {
          email: this.state.email,
          changeRequestType: 1
        }
        HTTP.putRequest(
          data,
          "Un correo se ha enviado a la dirección proporcionada",
          "No se ha podido enviar un correo electronico",
          "usuarios/request_new_password")
        .then( 
            (result) => {
                console.log(result);
                console.log("FIN");
            if(result){
                this.setState({
                    redirect: true
                })
            }
          })
          .catch(err=>console.log(err))
      } 
      else{
        this.validator.showMessages();
        this.forceUpdate();
      }
        
    }

    render() {
        if(this.state.redirect){
            return <Redirect to="/" />
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
                <div className="login-box card">
                  <div className="card-body">
                    <form
                      className="form-horizontal"
                      onSubmit={this.onSubmitHandler}
                    >
                      <h3 className="box-title m-b-20">Solicitar enlace de restauración de contraseña</h3>
                      <div className="form-group ">
                      {
                      this.validator.message(
                        "Correo electrónico",
                        this.state.email,
                        "required|email"
                       ) && (
                        <span className="label label-light-danger">
                          {this.validator.message(
                          "Correo electrónico",
                          this.state.email,
                          "required|email"
                        )}
                        </span>
                      )
                      }
                        <div className="col-xs-12">
                          <label htmlFor="">Correo electrónico:</label>
                          <input
                            className="form-control"
                            type="text"
                            name ="email"
                                                
                            placeholder="usuario@mail.com"
                            onChange={(e)=>{
                                this.setState({
                                    email: e.target.value
                                });
                            }}
                          />
                        </div>
                      </div>
                      <span></span>
                      <div className="form-group text-center m-t-20">
                        <div className="col-xs-12">
                          <button
                            className="btn btn-inverse btn-lg btn-block text-uppercase waves-effect waves-light"
                            type="submit"
                           
                          >
                            Enviar enlace
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </React.Fragment>
        )
    }
}
