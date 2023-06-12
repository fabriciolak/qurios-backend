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

// src/http/controllers/user/routes.ts
var routes_exports = {};
__export(routes_exports, {
  userRoutes: () => userRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/http/controllers/user/register.ts
var import_zod = require("zod");

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

// src/use-cases/user/register.ts
var import_bcryptjs = require("bcryptjs");

// src/use-cases/errors/email-already-exists.ts
var EmailAlreadyExistsError = class extends Error {
  constructor() {
    super("Email already exists.");
  }
};

// src/use-cases/user/register.ts
var RegisterUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
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

// src/use-cases/factories/make-create-user-use-case.ts
async function makeRegisterUserUseCase() {
  const userRepository = new PrismaUsersRepository();
  const userUseCase = new RegisterUserUseCase(userRepository);
  return userUseCase;
}

// src/use-cases/errors/username-already-exists.ts
var UsernameAlreadyExistsError = class extends Error {
  constructor() {
    super("Username with same username already exists");
  }
};

// src/http/controllers/user/register.ts
async function register(request, reply) {
  const userBodySchema = import_zod.z.object({
    email: import_zod.z.string().email(),
    name: import_zod.z.string().max(24, { message: "Name can't be greater than 24" }),
    username: import_zod.z.string().min(1, { message: "Username can't be less than 1" }).max(16, { message: "Username can't be greater than 24" }),
    password: import_zod.z.string().min(6, { message: "Password must be at least 6 characters" })
  });
  const { name, username, email, password } = userBodySchema.parse(request.body);
  try {
    const createUserUseCase = await makeRegisterUserUseCase();
    await createUserUseCase.execute({
      name,
      username,
      email,
      password
    });
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message
      });
    }
    if (error instanceof UsernameAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message
      });
    }
    throw error;
  }
  return reply.status(201).send();
}

// src/use-cases/errors/invalid-credentials.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super(`Invalid Credentials Error`);
  }
};

// src/use-cases/user/authenticate.ts
var import_bcryptjs2 = require("bcryptjs");
var AuthenticateUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    password
  }) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatches = await (0, import_bcryptjs2.compare)(password, user.password_hash);
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }
    return {
      user
    };
  }
};

// src/use-cases/factories/make-authenticate-use-case.ts
function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const sut = new AuthenticateUseCase(usersRepository);
  return sut;
}

// src/http/controllers/user/authenticate.ts
var import_zod2 = require("zod");
async function authenticate(request, reply) {
  const authenticateBodySchema = import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(6, { message: "Password must be at least 6 characters" })
  });
  const { email, password } = authenticateBodySchema.parse(request.body);
  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const { user } = await authenticateUseCase.execute({
      email,
      password
    });
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id
        }
      }
    );
    return reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(409).send({
        message: error.message
      });
    }
    throw error;
  }
}

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

// src/use-cases/factories/fetch-update-user.ts
async function fetchUpdateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const updateUseCase = new UpdateUserUseCase(usersRepository);
  return updateUseCase;
}

// src/http/controllers/user/update.ts
var import_zod3 = require("zod");
async function update(request, reply) {
  const updateBodySchema = import_zod3.z.object({
    email: import_zod3.z.string().email().optional(),
    name: import_zod3.z.string().optional(),
    username: import_zod3.z.string().optional()
  });
  const { email, name, username } = updateBodySchema.parse(request.body);
  try {
    const updateUseCase = await fetchUpdateUserUseCase();
    await updateUseCase.execute(request.user.sub, {
      email,
      name,
      username
    });
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message
      });
    }
    if (error instanceof UsernameAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message
      });
    }
    throw error;
  }
  return reply.status(200).send();
}

// src/http/controllers/user/user-profile.ts
var import_zod4 = require("zod");
async function userProfile(request, reply) {
  try {
    const userProfileParamsSchema = import_zod4.z.object({
      userId: import_zod4.z.string().uuid()
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

// src/http/middlewares/verify-jwt.ts
async function verifyJwt(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(400).send({
      message: "Unauthorized"
    });
  }
}

// src/http/controllers/user/routes.ts
async function userRoutes(app) {
  app.get("/users/profile/:userId", { onRequest: [verifyJwt] }, userProfile);
  app.post("/users", register);
  app.put("/users", { onRequest: [verifyJwt] }, update);
  app.post("/sessions", authenticate);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userRoutes
});
