"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-cases/user/update-user.ts
var update_user_exports = {};
__export(update_user_exports, {
  UpdateUserUseCase: () => UpdateUserUseCase
});
module.exports = __toCommonJS(update_user_exports);

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
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateUserUseCase
});
