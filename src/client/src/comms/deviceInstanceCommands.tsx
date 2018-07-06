var classNames = require("classnames");
import * as React from "react";

export class DeviceInstanceCommands extends React.Component<any, any> {
    render() {
        return <div className={classNames("device-header", this.props.device.running ? "device-header-active" : "")}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="btn-bar btn-bar-base-margin">
                    <button title={this.props.resx.BTN_LBL_ADD_D2C} className="btn btn-info" onClick={this.props.addD2CHandler}><span className="fa fa-cloud-upload"></span> {this.props.resx.BTN_ADDD2C}</button>
                    <button title={this.props.resx.BTN_LBL_ADD_C2D} className="btn btn-info" onClick={this.props.addC2DHandler}><span className="fa fa-cloud-download"></span> {this.props.resx.BTN_ADDC2D}</button>
                    <button title={this.props.resx.BTN_LBL_ADD_METHOD} className="btn btn-info" onClick={this.props.addMethodHandler}><span className="fa fa-code"></span> {this.props.resx.BTN_ADD_METHOD}</button>
                </div>
                <div className="btn-bar btn-bar-base-margin">
                    <button title={this.props.resx.BTN_LBL_DEVICE_START} className="btn btn-success" onClick={this.props.startHandler}><span className="fa fa-play"></span></button>
                    <button title={this.props.resx.BTN_LBL_DEVICE_STOP} className="btn btn-secondary" onClick={this.props.stopHandler}><span className="fa fa-stop"></span></button>
                    <button title={this.props.resx.BTN_LBL_DEVICE_DELETE} className="btn btn-danger" onClick={this.props.deleteHandler}><span className={classNames("fa fa-lg fa-trash-o")}></span></button>
                    {this.props.hasHubString ?
                        <button title={this.props.resx.BTN_LBL_DEVICE_INSPECT} className="btn btn-info" onClick={this.props.toggleIotHubHandler}><span className={classNames("fa fa-lg fa-bug")}></span></button>
                        : null}
                </div>
            </div>
        </div>
    }
}