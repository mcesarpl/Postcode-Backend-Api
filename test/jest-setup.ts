import supertest from "supertest";
import { Server } from "@src/factories";
import Connections from "@src/services/Connections";
import LoggerFactory from "@src/factories/LoggerFactory";

beforeAll(async () => {
  await Connections.startDatabaseConnections();
  const server = Server.create();
  server.start();
  Object.defineProperty(global, 'testRequest', {
    value: supertest(server.get()),
    writable: true,
  });
});

afterAll(async () => {
  await Connections.closeConnections();
  LoggerFactory.close();
});