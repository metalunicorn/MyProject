import "reflect-metadata";
import './env'
import {createConnection} from "typeorm";
import { Messages } from "./entity/Message";
import appExpress from './app';
import {createServer} from 'http'; 
import socket from './socket'
import { Server,Socket } from "socket.io";

const httpServer = createServer(appExpress)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const PORT = process.env.PORT || 5050;


const start = async function startServer() {
    try {
      console.log("2")
        const connection = await createConnection()
        httpServer.listen(PORT, () =>
      console.log(`Server has been started on port ${PORT}...`)
    );
    } catch (e) {
    process.exit(1);
  }
}
start();
socket(io)
