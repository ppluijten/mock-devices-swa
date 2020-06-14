import { dialog, app, Menu, BrowserWindow } from 'electron';
import * as http from 'http';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import root from './api/root';
import device from './api/device';
import devices from './api/devices';
import state from './api/state';
import server from './api/server';
import sensors from './api/sensors';
import semanctics from './api/simulation';
import template from './api/template';

import { Config } from './config';
import { DeviceStore } from './store/deviceStore';
import { SensorStore } from './store/sensorStore';
import { SimulationStore } from './store/simulationStore';
import { WebSocketMessageService } from './core/webSocketMessageService';

class Server {

    private expressServer: any = null;

    private deviceStore: DeviceStore;
    private sensorStore: SensorStore;
    private simulationStore: SimulationStore;

    private mainWindow: any = null;

    public start = () => {

        const ms = new WebSocketMessageService();
        this.deviceStore = new DeviceStore(ms);
        this.sensorStore = new SensorStore();
        this.simulationStore = new SimulationStore();

        this.expressServer = express();
        this.expressServer.server = http.createServer(this.expressServer);
        this.expressServer.use(cors({ exposedHeaders: ["Link"] }));
        if (Config.WEBAPI_LOGGING) { this.expressServer.use(morgan('tiny')); }
        this.expressServer.use(bodyParser.urlencoded({ extended: false }));
        this.expressServer.use(bodyParser.json({ limit: "9000kb" }));

        this.expressServer.use(express.static(__dirname + '/../../static'));
        this.expressServer.use('/_dist', express.static(__dirname + '/..'));
        this.expressServer.use('/node_modules', express.static(__dirname + '/../../node_modules'));

        this.expressServer.use('/api/simulation', semanctics(this.deviceStore, this.simulationStore));
        this.expressServer.use('/api/device', device(this.deviceStore));
        this.expressServer.use('/api/devices', devices(this.deviceStore));
        this.expressServer.use('/api/state', state(this.deviceStore, this.simulationStore));
        this.expressServer.use('/api/server', server(this.deviceStore));
        this.expressServer.use('/api/sensors', sensors(this.sensorStore));
        this.expressServer.use('/api/template', template(this.deviceStore));
        this.expressServer.use('/api', root(dialog, app));

        if (Config.NODE_MODE) {
            this.startService();
        }
        else {
            app.on('quit', function (err) {
                console.log("exiting expressServer");
            });

            app.on('ready', this.startService.bind(this));

            app.on('window-all-closed', (() => {
                app.quit();
            }));

            app.on('activate', (() => {
                if (this.mainWindow === null) {
                    this.startService();
                }
            }));

            app.on('will-quit', (() => {
                ms.end();
            }));
        }
    }


    public startService = () => {
        this.expressServer.server.listen(Config.APP_PORT);

        if (!Config.NODE_MODE) {
            this.mainWindow = new BrowserWindow({
                "width": Config.APP_WIDTH,
                "height": Config.APP_HEIGHT,
                "minWidth": Config.APP_WIDTH,
                "minHeight": Config.APP_HEIGHT,
                webPreferences: {
                    devTools: true
                }
            });

            const template: any = [{
                label: 'File',
                submenu: [
                    process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' }
                ]
            },
            {
                label: 'Tool',
                submenu: [
                    { role: 'forcereload' },
                    { role: 'toggledevtools' },
                    { type: 'separator' },
                    process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' }
                ]
            }]

            const menu = Menu.buildFromTemplate(template)
            if (Config.DEV_TOOLS) { Menu.setApplicationMenu(menu); }
            else { Menu.setApplicationMenu(null); }

            this.mainWindow.loadURL(Config.LOCALHOST + ':' + Config.APP_PORT);

            this.mainWindow.on('closed', (() => {
                this.mainWindow = null;
            }));
            console.log("Launching mock-devices. Keep window active to keep app running");
        } else {
            console.log("mock-devices for NodeJS started on: : " + this.expressServer.server.address().port);
        }
    }
}

// handle all uncaught client errors
process.on('uncaughtException', ((err) => {
    console.log(err);
}));

// start the expressServerlication
new Server().start();