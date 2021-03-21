import React, { Component } from "react";
import { Fragment } from "react";
import LayoutPanelFormulario from "../../components/layouts/panels/LayoutPanelFormulario";
import PersonaFormComponent from "../../components/Personas/PersonaFormComponent";
import PersonasBuscadorModal from "../../components/Personas/PersonasBuscadorModal";

export default class PastoresForm extends Component {
  constructor(props) {
    super(props);
    this.setPersona = this.setPersona.bind(this);
    this.state = {
      persona: null,
    };
  }
  setPersona(data) {
    this.refs.personaForm.findPerson(data.codigo);
  }
  render() {
    return (
      <Fragment>
        <LayoutPanelFormulario
          titulo="Registro de pastores"
         
          tools={
            
            <div >
              <button
                type="button"
                className="btn btn-info"
                onClick={this.switchEditForms}
              >
                <i className="fa fa-edit mr-2"></i>EDITAR CAMPOS
              </button>
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
          }
        >
          {/* Componente del formulario persona */}
          <PersonaFormComponent ref="personaForm">

          </PersonaFormComponent>

        </LayoutPanelFormulario>



        <PersonasBuscadorModal
          ref="per"
          getPersona={this.setPersona}
        ></PersonasBuscadorModal>
      </Fragment>
    );
  }
}
