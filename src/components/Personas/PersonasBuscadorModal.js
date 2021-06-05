import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import TablaFilter from "../../components/tablas/TablaFilter";

//LEER LEER LEER LEER LEER
//Al darle click a un registro de persona devuelve el cuerpo de la persona en un props llamado getPersona
/** 
 * 
 * 
 *  setPersona(data){
      this.setState({persona:data})
    }
 *  <PersonasBuscadorModal ref="per" getPersona={this.setPersona}>
    </PersonasBuscadorModal>
 */
export default class PersonasBuscadorModal extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }
  columns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "codigo",
      text: "CÓDIGO",
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "nombres",
      text: "Nombre",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "apellidos",
      text: "Apellidos",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "telefono",
      text: "Teléfono",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "condicion",
      text: "CONDICIÓN",
      sort: true,
      formatter: (cellContent, row) => {
        if (cellContent === 1) {
          return (
            <p className="text-center">
              <span className="label label-light-info"> ACTIVO</span>
            </p>
          );
        } else {
          return (
            <p className="text-center">
              <span className="label label-light-danger">INACTIVO</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "estado",
      text: "Estado",
      sort: true,
      formatter: (cellContent, row) => {
        return (
          <p className="ml-4">{cellContent === 1 ? "VIVO" : "FALLECIDO"}</p>
        );
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
    {
      dataField: "userId",
      text: "ACCESO",
      sort: true,
      formatter: (cellContent, row) => {
        if (parseInt(cellContent) > 0) {
          return (
            <p className="text-center">
              <span className="label label-light-info"> Habilitado</span>
            </p>
          );
        } else {
          return (
            <p className="text-center">
              <span className="label label-light-danger">Inhabilitado</span>
            </p>
          );
        }
      },
      headerStyle: () => {
        return { width: "20%", textAlign: "center" };
      },
    },
  ];
  toggle() {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  }
  rowEvents = {
    onClick: (e, row, rowIndex) => {
      e.preventDefault();
      this.props.getPersona({
        id: row.id,
        codigo: row.codigo,
        nombres: row.nombres,
        apellidos: row.apellidos,
      });

      this.toggle();
    },
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          size="lg"
          style={{ maxWidth: "1600px", width: "65%" }}
          isOpen={this.state.isOpen}
          centered={true}
        >
          <ModalHeader toggle={this.toggle}>Buscador de personas</ModalHeader>
          <ModalBody>
            <TablaFilter
              ref="tabla"
              ruta={
                this.props.rutaAConsultar
                  ? this.props.rutaAConsultar
                  : "personas/actives"
              }
              rowEvents={this.rowEvents}
              identificador={"modulo_id"}
              columns={this.columns}
              titulo_tabla="Escriba la persona que desea buscar"
            />
          </ModalBody>
          <ModalFooter className="text-right"></ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}
