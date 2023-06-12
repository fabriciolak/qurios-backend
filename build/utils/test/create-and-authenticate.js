"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/test/create-and-authenticate.ts
var create_and_authenticate_exports = {};
__export(create_and_authenticate_exports, {
  createAndAuthenticateTest: () => createAndAuthenticateTest
});
module.exports = __toCommonJS(create_and_authenticate_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var import_process = require("process");
var prisma = new import_client.PrismaClient({
  log: import_process.env.NODE_ENV === "development" ? ["query"] : []
});

// src/utils/test/create-and-authenticate.ts
var import_bcryptjs = require("bcryptjs");
var import_supertest = __toESM(require("supertest"));
async function createAndAuthenticateTest(app, { email, username }) {
  const user = await prisma.user.create({
    data: {
      email: email || "testuser@test.com",
      username: username || "testuser",
      name: "Test User",
      password_hash: await (0, import_bcryptjs.hash)("123456", 6)
    }
  });
  const authResponse = await (0, import_supertest.default)(app.server).post("/sessions").send({
    email: email || "testuser@test.com",
    password: "123456"
  });
  const { token } = authResponse.body;
  return {
    token,
    user
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createAndAuthenticateTest
});
