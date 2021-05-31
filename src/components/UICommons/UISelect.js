import React, { Component } from "react";
import SimpleSelect from "react-select";
import HTTP from "../../helpers/HTTP";
export default class UISelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.options? this.props.options:null,
    };
  }
  getInitData() {
    let data = [];

    HTTP.findAll(this.props.apiPath).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });
    });

    return data;
  }
  setDataByFilter(filter) {
    let data = [];
    console.log(filter);
    HTTP.findById(filter, this.props.apiPath).then((result) => {
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });
    });

    this.setState({items: data});
  }
  componentDidMount() {
      if(this.props.loadDataAtMount){
        this.setState({ items: this.getInitData() });
      }
    
  }

  render() {
    return (
      <div className={this.props.divClass}>
        <label>{this.props.label}</label>
        
        <SimpleSelect
          isDisabled={this.state.items === null || this.props.isDisabled}
          id={this.props.id}
          name={this.props.id}
          placeholder= "Selecciona una opción"
          value={this.props.value}
          onChange={this.props.onChange}
          options={this.state.items}
          noOptionsMessage={() => {
            return "No existen datos";
          }}
        />
        {this.props.afterSelect}
      </div>
    );
  }

  static defaultProps = {
    options:null,
    loadDataAtMount: true,
    id: "id",
    value: "valor",
    placeholder: "Selecciona una opción",
    isDisabled: false,
    onChange: () => {
      console.log("input sin handler");
    },
    label: "Select Label",
    divClass: "col-lg-3 form-group",
    inputProps: {
      className: "form-control",
    },
  };
}
