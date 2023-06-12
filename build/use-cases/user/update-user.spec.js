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

// src/use-cases/user/update-user.spec.ts
var import_vitest = require("vitest");

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

// src/use-cases/user/update-user.ts
var UpdateUserUseCase = class {
  constructor(usersRepository2) {
    this.usersRepository = usersRepository2;
  }
  async execute(userId, data) {
    const emailExists = await this.usersRepository.findByEmail(data.email ?? "");
    const usernameExists = await this.usersRepository.findByUsername(
      data.username ?? ""
    );
    if (emailExists) {
      throw new EmailAlreadyExistsError();
    }
    if (usernameExists) {
      throw new UsernameAlreadyExistsError();
    }
    const user = await this.usersRepository.update(userId, data);
    if (!user) {
      throw new Error("Resource not found");
    }
    return {
      user
    };
  }
};

// src/repositories/in-memory/in-memory-users-repository.ts
var import_node_crypto = __toESM(require("crypto"));
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

// src/use-cases/user/register.ts
var import_bcryptjs = require("bcryptjs");
var RegisterUserUseCase = class {
  constructor(usersRepository2) {
    this.usersRepository = usersRepository2;
  }
  async execute({
    email,
    name,
    password,
    username
  }) {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email);
    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }
    const usernameAlreadyExists = await this.usersRepository.findByUsername(
      username
    );
    if (usernameAlreadyExists) {
      throw new Error("Username with same username already exists");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    const password_hash = await (0, import_bcryptjs.hash)(password, 6);
    const user = await this.usersRepository.create({
      name,
      username,
      email,
      password_hash
    });
    return {
      user
    };
  }
};

// src/use-cases/user/update-user.spec.ts
var import_bcryptjs2 = require("bcryptjs");
var usersRepository;
var sutUserUpdate;
var sutUserCreate;
var sutUser;
(0, import_vitest.describe)("Update user use case", () => {
  (0, import_vitest.beforeEach)(async () => {
    usersRepository = new InMemoryUsersRepository();
    sutUserUpdate = new UpdateUserUseCase(usersRepository);
    sutUserCreate = new RegisterUserUseCase(usersRepository);
    const { user } = await sutUserCreate.execute({
      name: "John Doe",
      username: "johndoe",
      email: "johndoe@does.com",
      password: "123456"
    });
    sutUser = user;
    const isPasswordHashed = await (0, import_bcryptjs2.compare)("123456", user.password_hash);
    (0, import_vitest.expect)(isPasswordHashed).toBe(true);
    (0, import_vitest.expect)(user).toEqual(
      import_vitest.expect.objectContaining({
        id: import_vitest.expect.any(String),
        email: "johndoe@does.com"
      })
    );
  });
  (0, import_vitest.it)("Should be possible for any user to change their email", async () => {
    const updatedUser = await sutUserUpdate.execute(sutUser.id, {
      email: "changed-email@does.com"
    });
    (0, import_vitest.expect)(updatedUser?.user).toEqual(
      import_vitest.expect.objectContaining({
        email: "changed-email@does.com"
      })
    );
    await (0, import_vitest.expect)(
      sutUserUpdate.execute(sutUser.id, {
        email: "changed-email@does.com"
      })
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });
  (0, import_vitest.it)("should be possible for any user to change their username", async () => {
    const updatedUser = await sutUserUpdate.execute(sutUser.id, {
      username: "janedoe"
    });
    (0, import_vitest.expect)(updatedUser?.user).toEqual(
      import_vitest.expect.objectContaining({
        username: "janedoe"
      })
    );
    await (0, import_vitest.expect)(
      sutUserUpdate.execute(sutUser.id, {
        username: "janedoe"
      })
    ).rejects.toBeInstanceOf(UsernameAlreadyExistsError);
  });
});
