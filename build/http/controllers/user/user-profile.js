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

// src/http/controllers/user/user-profile.ts
var user_profile_exports = {};
__export(user_profile_exports, {
  userProfile: () => userProfile
});
module.exports = __toCommonJS(user_profile_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var import_process = require("process");
var prisma = new import_client.PrismaClient({
  log: import_process.env.NODE_ENV === "development" ? ["query"] : []
});

// src/repositories/prisma/prisma-users-repository.ts
var PrismaUsersRepository = class {
  async create(data) {
    const user = await prisma.user.create({
      data
    });
    return user;
  }
  async update(userId, data) {
    const user = await prisma.user.update({
      data,
      where: {
        id: userId
      }
    });
    return user;
  }
  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    return user;
  }
  async findById(id) {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });
    return user;
  }
  async findByUsername(username) {
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    });
    return user;
  }
};

// src/http/controllers/user/user-profile.ts
var import_zod = require("zod");
async function userProfile(request, reply) {
  try {
    const userProfileParamsSchema = import_zod.z.object({
      userId: import_zod.z.string().uuid()
    });
    const { userId } = userProfileParamsSchema.parse(request.params);
    const usersRepository = new PrismaUsersRepository();
    const user = await usersRepository.findById(userId);
    if (user && "password_hash" in user) {
      const { password_hash, ...userWithoutPassword } = user;
      return reply.status(200).send(userWithoutPassword);
    }
  } catch (error) {
    console.log(error);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userProfile
});
