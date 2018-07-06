import * as uuidV4 from 'uuid/v4';

export class SensorStore {

    constructor() {
    }

    public getListOfItems = () => {

        let fanId = uuidV4();
        let batteryId = uuidV4();
        let hotplateId = uuidV4();
        let functionId = uuidV4();

        return [{
            _id: batteryId,
            _hasState: false,
            _type: "battery",
            _value: 0,
            init: 100,
            running: 0,
            variance: 0.1,
            timeToRunning: 10800
        },
        {
            _id: hotplateId,
            _hasState: false,
            _type: "hotplate",
            _value: 0,
            init: 0,
            running: 275,
            variance: 0.1,
            timeToRunning: 520
        },
        {
            _id: fanId,
            _hasState: false,
            _type: "fan",
            _value: 0,
            init: 0,
            variance: 2.5,
            running: 2000,
            timeToRunning: 1
        },
        {
            _id: functionId,
            _hasState: false,
            _type: "function",
            _value: 0,
            init: 0,
            function: "http://url"
        }]
    }

}