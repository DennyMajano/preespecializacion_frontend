import React, { Component } from "react";
import { Fragment } from "react";
import RoutesPath from './../../config/RoutesPath';

class Modal extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Fragment>
                <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="exampleModalLabel1">{this.props.title}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            </div>
                            <div className="modal-body">
                               {this.props.children}
                            </div>
                            <div className="modal-footer">
                                {this.props.footerTools}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default Modal;