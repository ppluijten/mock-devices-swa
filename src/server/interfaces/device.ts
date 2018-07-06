export interface DeviceType {
    mock: boolean;
    direction: 'd2c' | 'c2d';
}

export interface RunLoop {
    include: boolean;
    unit: 'secs' | 'mins';
    value: number;
}

export interface MockSensor {
    _id: string;
    _hasState: boolean;
    _type: 'fan' | 'hotplate' | 'battery' | 'function';
    _value: number;
    init: number;
    running?: number;
    variance?: number;
    timeToRunning?: number;
    function?: string;
}

export interface Property {
    _id: string;
    _type: "property";
    name: string;
    string: boolean;
    value: string;
    sdk: string;
    type: DeviceType;
    version: number;
    propertyObject: PropertyObjectDefault | PropertyObjectTemplated
    runloop?: RunLoop;
    mock?: MockSensor;
}

export interface Method {
    _id: string;
    _type: "method";
    name: string;
    status: 200 | 404 | 500;
    receivedParams: string;
    asProperty: boolean;    
    payload: any;
}

export interface PropertyObjectDefault {
    type: "default";
}

export interface PropertyObjectTemplated {
    type: "templated"
    template: any;
}

export class Device {
    public _id: string;
    public name: string;
    public connectionString: string;
    public hubConnectionString: string;
    public template: boolean;
    public comms: Array<any>;
    public running: boolean;
    public cloneId?: string;

    constructor() {
        this.comms = new Array<any>();
    }

}