import supertest from "supertest";
import { ServerFactory } from "@src/factories";
import Connections from "@src/services/Connections";
import LoggerFactory from "@src/factories/LoggerFactory";

beforeAll(async () => {
  await Connections.startDatabaseConnections();
  const server = ServerFactory.create();
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