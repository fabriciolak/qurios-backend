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

// src/repositories/in-memory/in-memory-users-repository.ts
var in_memory_users_repository_exports = {};
__export(in_memory_users_repository_exports, {
  InMemoryUsersRepository: () => InMemoryUsersRepository
});
module.exports = __toCommonJS(in_memory_users_repository_exports);
var import_node_crypto = __toESM(require("crypto"));

// src/use-cases/errors/email-already-exists.ts
var EmailAlreadyExistsError = class extends Error {
  constructor() {
    super("Email already exists.");
  }
};

// src/use-cases/errors/username-already-exists.ts
var UsernameAlreadyExistsError = class extends Error {
  constructor() {
    super("Username with same username already exists");
  }
};

// src/repositories/in-memory/in-memory-users-repository.ts
var InMemoryUsersRepository = class {
  constructor() {
    this.users = [];
  }
  async create({
    name,
    username,
    email,
    password_hash
  }) {
    const user = {
      id: import_node_crypto.default.randomUUID(),
      name,
      email,
      password_hash,
      username,
      created_at: /* @__PURE__ */ new Date()
    };
    this.users.push(user);
    return user;
  }
  async update(userId, data) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return null;
    }
    const emailAlreadyExists = await this.findByEmail(data.email);
    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }
    const usernameAlreadyExists = await this.findByUsername(
      data.username
    );
    if (usernameAlreadyExists) {
      throw new UsernameAlreadyExistsError();
    }
    const updatedUser = {
      ...this.users[userIndex],
      email: data.email !== void 0 ? String(data.email) : this.users[userIndex].email,
      name: data.name !== void 0 ? String(data.name) : this.users[userIndex].name,
      username: data.username !== void 0 ? String(data.username) : this.users[userIndex].username
    };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }
  async findByEmail(email) {
    const user = this.users.find((data) => data.email === email);
    if (!user) {
      return null;
    }
    return user;
  }
  async findByUsername(username) {
    const user = this.users.find((data) => data.username === username);
    if (!user) {
      return null;
    }
    return user;
  }
  async findById(id) {
    const user = this.users.find((data) => data.id === id);
    if (!user) {
      return null;
    }
    return user;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryUsersRepository
});
