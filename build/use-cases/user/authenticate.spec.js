"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/repositories/in-memory/in-memory-users-repository.ts
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

// src/use-cases/user/authenticate.spec.ts
var import_vitest = require("vitest");
var import_bcryptjs2 = require("bcryptjs");

// src/use-cases/user/authenticate.ts
var import_bcryptjs = require("bcryptjs");

// src/use-cases/errors/invalid-credentials.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super(`Invalid Credentials Error`);
  }
};

// src/use-cases/user/authenticate.ts
var AuthenticateUseCase = class {
  constructor(usersRepository2) {
    this.usersRepository = usersRepository2;
  }
  async execute({
    email,
    password
  }) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatches = await (0, import_bcryptjs.compare)(password, user.password_hash);
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }
    return {
      user
    };
  }
};

// src/use-cases/user/authenticate.spec.ts
var usersRepository;
var sut;
(0, import_vitest.describe)("User authenticate", () => {
  (0, import_vitest.beforeEach)(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
    await usersRepository.create({
      email: "johndoe@does.com",
      name: "John Doe",
      username: "johndoe",
      password_hash: await (0, import_bcryptjs2.hash)("123456", 6)
    });
  });
  (0, import_vitest.it)("Should be able to authenticate", async () => {
    const { user } = await sut.execute({
      email: "johndoe@does.com",
      password: "123456"
    });
    (0, import_vitest.expect)(user.id).toEqual(import_vitest.expect.any(String));
  });
  (0, import_vitest.it)("Should not be able to authenticate with wrong email", async () => {
    await (0, import_vitest.expect)(
      sut.execute({
        email: "wrongemail@does.com",
        password: "123456"
      })
    ).rejects.toThrowError("Invalid Credentials Error");
  });
  (0, import_vitest.it)("Should not be able to authenticate with wrong password", async () => {
    await (0, import_vitest.expect)(
      sut.execute({
        email: "johndoe@does.com",
        password: "123456789101112"
      })
    ).rejects.toThrowError("Invalid Credentials Error");
  });
});
