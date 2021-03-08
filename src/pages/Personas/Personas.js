import React, { Component } from 'react'
import LayoutPanelTable from '../../components/layouts/panels/LayoutPanelTable'
import TablaFilter from '../../components/tablas/TablaFilter'
import { Menu, Item, Separator, contextMenu, IconFont } from "react-contexify";
import HTTP from "../../helpers/HTTP";
import Request from '../../services/Request';
import PersonasBuscadorModal from '../../components/Personas/PersonasBuscadorModal';
export default class Personas extends Component {
    constructor(props){
      super(props);
      this.setState({
        persona: "q"
      });
      this.setPersona = this.setPersona.bind(this);
    }  

    setPersona(data){
      this.setState({persona:data})
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
          }
        },
        {
          dataField: "codigo",
          text: "CÓDIGO",
          formatter: (cellContent, row) => {
            return <p className="text-center">{cellContent}</p>;
          },
          headerStyle: () => {
            return { width: "15%", textAlign: "center" };
          }
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
          }
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
          }
        },
        {
          dataField: "telefono",
          text: "Teléfono",
          sort: true,
          formatter: (cellContent, row) => {
            return <p className="ml-4">{cellContent.toUpperCase()}</p>;
          },
          headerStyle: () => {
            return { width: "20%", textAlign: "center" };
          }
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
            return <p className="ml-4">{
              cellContent==1?"VIVO": "FALLECIDO"
              
              }</p>;
          },
          headerStyle: () => {
            return { width: "20%", textAlign: "center" };
          }
        }, {
          dataField: "userId",
          text: "ACCESO",
          sort: true,
          formatter: (cellContent, row) => {
            if (parseInt(cellContent) >0) {
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
      desactivar = async ({ event, props }) => {
        const data = {
          code: props.id,
          status: 0
        };
        HTTP.putRequest(data,"Persona modificada","Error al modificar la persona","personas/enable")
        .then(
          result=>{
            this.refs.tabla.getData("personas/find");
          }
        );
      };
      activar = async ({ event, props }) => {
        const data = {
          code: props.id,
          status: 1
        };
        HTTP.putRequest(data,"Persona modificada","Error al modificar la persona","personas/enable")
        .then(
          result=>{
            this.refs.tabla.getData("personas/find");
          }
        );
      };
      quitaracceso = async ({ event, props }) => {
        const data = {
          code: props.userId
        }
        HTTP.disable(data,"usuario","Usuarios","usuarios").then(
        result => {
          this.refs.tabla.getData("personas/find");
        }
      );
      };
      update = ({ event, props }) => {
        this.props.history.push("/administracion/personas/update/" + props.id);
      };
      rowEvents = {
        onContextMenu: (e, row, rowIndex) => {
          e.preventDefault();
          console.log(row);
          if (row.condicion === 1 && row.userId !==null) {
            contextMenu.show({
              id: "menu_personas_usuarios",
              event: e,
              props: {
                id: row.id,
                userId: row.userId
              }
            });
          } 
          else if (row.condicion === 1 ) {
            contextMenu.show({
              id: "menu_modulos",
              event: e,
              props: {
                id: row.id
              }
            });
          }else {
            contextMenu.show({
              id: "menu_modulos_disable",
              event: e,
              props: {
                id: row.id
              }
            });
          }
        }
      };
      componentDidMount() {
        document.getElementById("buscar").focus();
      }
    render() {
        return (
            <React.Fragment>
                <LayoutPanelTable
          titulo="Administración de personas"
          rutacreate="/administracion/personas/new"
        >
          <div className="form-body">
            <button type="button" onClick = {()=>{
              this.refs.per.toggle()
              console.log("clcik")
            }}>TEST PERSONAS MODAL</button>
            <div className="row p-t-20">
              <div className="col-12 form-group">
                <TablaFilter
                  ref="tabla"
                  ruta={"personas/find"}
                  rowEvents={this.rowEvents}
                  identificador={"modulo_id"}
                  columns={this.columns}
                  titulo_tabla="Escriba el registro que desea buscar"
                />
                <Menu id={"menu_modulos"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Separator />
                  <Item onClick={this.desactivar}>
                    <IconFont className="fa fa-close" />
                    DESACTIVAR
                  </Item>
                </Menu>
                <Menu id={"menu_personas_usuarios"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Separator />
                  <Item onClick={this.desactivar}>
                    <IconFont className="fa fa-close" />
                    DESACTIVAR
                  </Item>
                  <Separator />
                  <Item onClick={this.quitaracceso}>
                    <IconFont className="fa fa-close" />
                    QUITAR ACCESO
                  </Item>
                </Menu>

                <Menu id={"menu_modulos_disable"}>
                  <Item onClick={this.update}>
                    <IconFont className="fa fa-pencil" /> ACTUALIZAR
                  </Item>
                  <Separator />
                  <Item onClick={this.activar}>
                    <IconFont className="fa fa-check" />
                    ACTIVAR
                  </Item>
                </Menu>
              </div>
            </div>
          </div>
        </LayoutPanelTable>
        <PersonasBuscadorModal ref="per" getPersona={this.setPersona}>
        </PersonasBuscadorModal>
      </React.Fragment>
        )
    }
}
