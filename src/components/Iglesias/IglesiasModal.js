import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import TablaFilter from "../../components/tablas/TablaFilter";

export default class IglesiasModal extends Component {
  constructor(props) {
    super(props);

    this.ActionModal = this.ActionModal.bind(this);
    this.state = {
      modal: false,
    };
  }
  columns = [
    {
      dataField: "id",
      text: "id",
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "distrito",
      text: "distrito",
      hidden: true,
    },
    {
      dataField: "codigo",
      text: "Código",
      hidden: false,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent}</p>;
      },
      headerStyle: () => {
        return { width: "10%", textAlign: "center" };
      },
    },
    {
      dataField: "nombre",
      text: "Nombre Iglesia",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="ml-4">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "departamento",
      text: "Departamento - Municipio",
      sort: true,
      formatter: (cellContent, row) => {
        return (
          <p className="text-center">{`${row.departamento.toUpperCase()} - ${row.municipio.toUpperCase()}`}</p>
        );
      },
      headerStyle: () => {
        return { width: "15%", textAlign: "center" };
      },
    },
    {
      dataField: "municipio",
      text: "Municipio",
      sort: true,
      hidden: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "10%", textAlign: "center" };
      },
    },
    {
      dataField: "tipo_iglesia",
      text: "Tipo",
      sort: true,
      formatter: (cellContent, row) => {
        return <p className="text-center">{cellContent.toUpperCase()}</p>;
      },
      headerStyle: () => {
        return { width: "10%", textAlign: "center" };
      },
    },
    {
      dataField: "zona",
      text: "Zona - Distrito",
      sort: true,
      formatter: (cellContent, row) => {
        return (
          <p className="text-center">{`${row.zona.toUpperCase()} - ${row.distrito.toUpperCase()}`}</p>
        );
      },
      headerStyle: () => {
        return { width: "18%", textAlign: "center" };
      },
    },
  ];
  ActionModal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }
  rowEvents = {
    onClick: (e, row, rowIndex) => {
      e.preventDefault();
      this.props.getData({
        id: row.id,
        codigo: row.codigo,
      });

      this.ActionModal();
    },
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          size="lg"
          style={{ maxWidth: "1600px", width: "65%" }}
          isOpen={this.state.modal}
        >
          <ModalHeader toggle={this.ActionModal}>Visor De Iglesias</ModalHeader>
          <ModalBody>
            <TablaFilter
              ref="tabla"
              ruta={"iglesias/visor/all"}
              rowEvents={this.rowEvents}
              identificador={"id"}
              columns={this.columns}
              titulo_tabla="Escriba el dato que desea buscar"
            />
          </ModalBody>
          <ModalFooter className="text-right"></ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}
