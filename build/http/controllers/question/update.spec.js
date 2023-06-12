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

// src/http/controllers/question/update.spec.ts
var import_vitest = require("vitest");
var import_supertest2 = __toESM(require("supertest"));

// src/app.ts
var import_fastify = __toESM(require("fastify"));
var import_jwt = __toESM(require("@fastify/jwt"));

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

// src/use-cases/errors/username-already-exists.ts
var UsernameAlreadyExistsError = class extends Error {
  constructor() {
    super("Username with same username already exists");
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
      throw new UsernameAlreadyExistsError();
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

// src/http/controllers/user/register.ts
async function register(request3, reply) {
  const userBodySchema = import_zod.z.object({
    email: import_zod.z.string().email(),
    name: import_zod.z.string().max(24, { message: "Name can't be greater than 24" }),
    username: import_zod.z.string().min(1, { message: "Username can't be less than 1" }).max(16, { message: "Username can't be greater than 24" }),
    password: import_zod.z.string().min(6, { message: "Password must be at least 6 characters" })
  });
  const { name, username, email, password } = userBodySchema.parse(request3.body);
  try {
    const createUserUseCase = await makeRegisterUserUseCase();
    const { user } = await createUserUseCase.execute({
      name,
      username,
      email,
      password
    });
    const { password_hash, ...userWithoutPassword } = user;
    return reply.status(200).send(userWithoutPassword);
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
async function authenticate(request3, reply) {
  const authenticateBodySchema = import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(6, { message: "Password must be at least 6 characters" })
  });
  const { email, password } = authenticateBodySchema.parse(request3.body);
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
async function update(request3, reply) {
  const updateBodySchema = import_zod3.z.object({
    email: import_zod3.z.string().email().optional(),
    name: import_zod3.z.string().optional(),
    username: import_zod3.z.string().optional()
  });
  const { email, name, username } = updateBodySchema.parse(request3.body);
  try {
    const updateUseCase = await fetchUpdateUserUseCase();
    await updateUseCase.execute(request3.user.sub, {
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
async function userProfile(request3, reply) {
  try {
    const userProfileParamsSchema = import_zod4.z.object({
      userId: import_zod4.z.string().uuid()
    });
    const { userId } = userProfileParamsSchema.parse(request3.params);
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
async function verifyJwt(request3, reply) {
  try {
    await request3.jwtVerify();
  } catch (error) {
    return reply.status(400).send({
      message: "Unauthorized"
    });
  }
}

// src/http/controllers/user/routes.ts
async function userRoutes(app2) {
  app2.get("/users/profile/:userId", { onRequest: [verifyJwt] }, userProfile);
  app2.post("/users", register);
  app2.put("/users", { onRequest: [verifyJwt] }, update);
  app2.post("/sessions", authenticate);
}

// src/use-cases/errors/title-slug-already-exisits.ts
var TitleSlugAlreadyExistsError = class extends Error {
  constructor() {
    super(`A publication with that title already exists. try another title`);
  }
};

// src/utils/generate-slug.ts
var import_slugify = __toESM(require("slugify"));
function generateSlug(title) {
  import_slugify.default.extend({ \u3164: "-" });
  const slug = (0, import_slugify.default)(title, {
    replacement: "-",
    remove: /[*+~.()'"!?:@ㅤ]/g,
    lower: true,
    trim: true,
    locale: "pt"
  });
  return slug;
}

// src/use-cases/errors/not-found-error.ts
var NotFoundError = class extends Error {
  constructor() {
    super(`Resource not found`);
  }
};

// src/repositories/prisma/prisma-question-repository.ts
var PrismaQuestionRepository = class {
  async create(data) {
    const question = await prisma.question.create({
      data
    });
    return question;
  }
  async update(questionId, data) {
    try {
      const question = await prisma.$transaction(async (transaction) => {
        const questionToUpdate = await transaction.question.findFirst({
          where: {
            id: questionId
          }
        });
        if (!questionToUpdate) {
          throw new NotFoundError();
        }
        const { user_id } = questionToUpdate;
        const user = await transaction.user.findFirst({
          where: {
            id: user_id
          }
        });
        const slugAlreadyExists = await transaction.question.findFirst({
          where: {
            user_id: {
              equals: user_id
            },
            AND: {
              slug: generateSlug(`${user?.username}/${data.title}`)
            }
          }
        });
        if (slugAlreadyExists) {
          throw new TitleSlugAlreadyExistsError();
        }
        const question2 = await transaction.question.update({
          data: {
            ...data,
            slug: generateSlug(`${user?.username}/${data.title}`)
          },
          where: {
            id: questionId
          }
        });
        return question2;
      });
      return question;
    } catch (error) {
      if (error instanceof TitleSlugAlreadyExistsError) {
        throw new TitleSlugAlreadyExistsError();
      }
      if (error instanceof NotFoundError) {
        throw new NotFoundError();
      }
    }
  }
  async delete(questionId) {
    await prisma.question.delete({
      where: {
        id: questionId
      }
    });
    return {};
  }
  async findBySlug(slug) {
    const question = await prisma.question.findFirst({
      where: {
        slug
      }
    });
    return question;
  }
};

// src/use-cases/question/create.ts
var CreateQuestionUseCase = class {
  constructor(questionRepository) {
    this.questionRepository = questionRepository;
  }
  async execute({
    title,
    content,
    slug = "",
    anonymous = false,
    votes = 0,
    user_id
  }) {
    if (!title) {
      throw new Error("title are required");
    }
    if (!content) {
      throw new Error("content are required");
    }
    const question = await this.questionRepository.create({
      title,
      content,
      slug,
      anonymous,
      votes,
      user_id
    });
    return {
      question
    };
  }
};

// src/use-cases/factories/make-create-question-use-case.ts
async function makeCreateQuestionUseCase() {
  const questionRepository = new PrismaQuestionRepository();
  const sut = new CreateQuestionUseCase(questionRepository);
  return sut;
}

// src/http/controllers/question/create.ts
var import_zod5 = require("zod");
async function create(request3, reply) {
  const createQuestionBodySchema = import_zod5.z.object({
    title: import_zod5.z.string().min(1, {
      message: "The title should be a minimum of 1 characters."
    }),
    content: import_zod5.z.string().min(1, {
      message: "The content should be a minimum of 1 characters."
    }),
    anonymous: import_zod5.z.boolean().default(false)
  });
  const questionRepository = await makeCreateQuestionUseCase();
  try {
    const { title, content, anonymous } = createQuestionBodySchema.parse(
      request3.body
    );
    const userProfile2 = await prisma.user.findUnique({
      where: {
        id: request3.user.sub
      },
      select: {
        username: true,
        questions: true
      }
    });
    const generatedSlugUrl = `${userProfile2?.username}/${generateSlug(title)}`;
    const slugAlreadyExists = userProfile2?.questions.find((question2) => {
      return question2.slug === generatedSlugUrl;
    });
    if (slugAlreadyExists) {
      throw new TitleSlugAlreadyExistsError();
    }
    const { question } = await questionRepository.execute({
      title,
      content,
      anonymous,
      slug: generatedSlugUrl,
      user_id: request3.user.sub,
      votes: 0
    });
    return reply.status(201).send(question);
  } catch (error) {
    if (error instanceof TitleSlugAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message
      });
    }
    if (error instanceof import_zod5.ZodError) {
      return reply.status(400).send({
        message: `Validation error`
      });
    }
    if (error instanceof TitleSlugAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message
      });
    }
    throw error;
  }
}

// src/use-cases/question/update.ts
var UpdateQuestionUseCase = class {
  constructor(questionsRepository) {
    this.questionsRepository = questionsRepository;
  }
  async execute(questionId, data) {
    if (!questionId) {
      throw new Error("question id are required");
    }
    const question = await this.questionsRepository.update(questionId, data);
    return {
      question
    };
  }
};

// src/use-cases/factories/make-update-question-use-case.ts
async function makeUpdateQuestionUseCase() {
  const questionRepository = new PrismaQuestionRepository();
  const sut = new UpdateQuestionUseCase(questionRepository);
  return sut;
}

// src/http/controllers/question/update.ts
var import_zod6 = require("zod");
async function update2(request3, reply) {
  const updateQuestionParamsSchema = import_zod6.z.object({
    questionId: import_zod6.z.string().uuid({
      message: "Invalid question id. must be UUID"
    })
  });
  const updateQuestionBodySchema = import_zod6.z.object({
    title: import_zod6.z.string().min(1, {
      message: "The title should be a minimum of 1 characters."
    }).optional(),
    content: import_zod6.z.string().min(1, {
      message: "The content should be a minimum of 1 characters."
    }).optional(),
    anonymous: import_zod6.z.boolean().default(false)
  });
  try {
    const questionRepository = await makeUpdateQuestionUseCase();
    const { title, content, anonymous } = updateQuestionBodySchema.parse(
      request3.body
    );
    const { questionId } = updateQuestionParamsSchema.parse(request3.params);
    const userHavePermission = await prisma.question.findFirst({
      where: {
        id: questionId,
        AND: {
          user_id: request3.user.sub
        }
      }
    });
    if (!userHavePermission) {
      throw new InvalidCredentialsError();
    }
    const { question } = await questionRepository.execute(questionId, {
      title,
      content,
      anonymous,
      slug: "",
      updated_at: /* @__PURE__ */ new Date(),
      user_id: request3.user.sub
    });
    return reply.status(200).send(question);
  } catch (error) {
    if (error instanceof TitleSlugAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message
      });
    }
    if (error instanceof import_zod6.ZodError) {
      return reply.status(409).send({
        message: error.format()
      });
    }
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({
        message: error.message
      });
    }
    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        message: error.message
      });
    }
    return reply.status(500).send({
      message: "Internal Server Error"
    });
  }
}

// src/use-cases/question/delete.ts
var DeleteQuestionUseCase = class {
  constructor(questionsRepository) {
    this.questionsRepository = questionsRepository;
  }
  async execute({ question_id }) {
    await this.questionsRepository.delete(question_id);
    return {};
  }
};

// src/use-cases/factories/delete-question-use-case.ts
async function deleteQuestionUseCase() {
  const questionRepository = new PrismaQuestionRepository();
  const sut = new DeleteQuestionUseCase(questionRepository);
  return sut;
}

// src/http/controllers/question/delete.ts
var import_zod7 = require("zod");
async function deleteQuestion(request3, reply) {
  const deleteQuestionBodySchema = import_zod7.z.object({
    question_id: import_zod7.z.string().uuid()
  });
  try {
    const { question_id } = deleteQuestionBodySchema.parse(request3.body);
    const userHavePermission = await prisma.question.findFirst({
      where: {
        id: question_id,
        user_id: request3.user.sub
      }
    });
    if (!userHavePermission) {
      throw new InvalidCredentialsError();
    }
    const questionRepository = await deleteQuestionUseCase();
    await questionRepository.execute({ question_id });
    return reply.status(200).send();
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({
        message: error.message
      });
    }
    if (error instanceof import_zod7.ZodError) {
      return reply.status(400).send({
        message: error.format()
      });
    }
  }
}

// src/http/controllers/question/questions.ts
async function questionList(request3, reply) {
  const questions = await prisma.question.findMany({
    take: 20,
    // skip: (1 - 1) * 20,
    orderBy: [
      {
        created_at: "asc"
      }
    ]
  });
  return reply.status(200).send(questions);
}

// src/http/controllers/question/routes.ts
async function questionRoutes(app2) {
  app2.addHook("onRequest", verifyJwt);
  app2.get("/question", questionList);
  app2.post("/question", create);
  app2.put("/question/:questionId", update2);
  app2.delete("/question", deleteQuestion);
}

// src/app.ts
var import_zod8 = require("zod");
var app = (0, import_fastify.default)();
app.register(import_jwt.default, {
  secret: process.env.JWT_SECRET
});
app.register(userRoutes);
app.register(questionRoutes);
app.get("/", (request3, reply) => {
  console.log(request3.method, request3.url);
  reply.status(200).send("Request successful \u{1F92A}");
});
app.setErrorHandler((error, _, reply) => {
  if (error instanceof import_zod8.ZodError) {
    console.log(error);
    return reply.status(400).send({
      statusCode: error.statusCode,
      message: "Validation error",
      issues: error.issues
    });
  }
  if (process.env.NODE_ENV !== "production") {
    console.log(error);
  }
  return reply.status(500).send({ message: "Internal server error" });
});

// src/utils/test/create-and-authenticate.ts
var import_bcryptjs3 = require("bcryptjs");
var import_supertest = __toESM(require("supertest"));
async function createAndAuthenticateTest(app2, { email, username }) {
  const user = await prisma.user.create({
    data: {
      email: email || "testuser@test.com",
      username: username || "testuser",
      name: "Test User",
      password_hash: await (0, import_bcryptjs3.hash)("123456", 6)
    }
  });
  const authResponse = await (0, import_supertest.default)(app2.server).post("/sessions").send({
    email: email || "testuser@test.com",
    password: "123456"
  });
  const { token } = authResponse.body;
  return {
    token,
    user
  };
}

// src/http/controllers/question/update.spec.ts
(0, import_vitest.beforeAll)(() => {
  app.ready();
});
(0, import_vitest.afterAll)(() => {
  app.close();
});
(0, import_vitest.describe)("Update question (E2E)", () => {
  (0, import_vitest.it)("Should be update a question", async () => {
    const { token } = await createAndAuthenticateTest(app, {});
    await (0, import_supertest2.default)(app.server).post("/question").set("Authorization", `Bearer ${token}`).send({
      title: "User Test Question",
      content: "Consectetur adipiscing elit",
      anonymous: false
    }).expect(201);
  });
  (0, import_vitest.it)("User cannot create a question without a token session", async () => {
    const response = await (0, import_supertest2.default)(app.server).post("/question").set("Authorization", `Bearer token`).send({
      title: "User Test Question",
      content: "Consectetur adipiscing elit",
      anonymous: false
    });
    (0, import_vitest.expect)(response.statusCode).toEqual(400);
    (0, import_vitest.expect)(response.body).toEqual(
      import_vitest.expect.objectContaining({
        message: "Unauthorized"
      })
    );
  });
  (0, import_vitest.it)("User cannot edit question from another users", async () => {
    const { token: userToken3 } = await createAndAuthenticateTest(app, {
      email: "testuser3@email.com",
      username: "testuser3"
    });
    const { token: userToken4 } = await createAndAuthenticateTest(app, {
      email: "testuser4@email.com",
      username: "testuser4"
    });
    const response = await (0, import_supertest2.default)(app.server).post("/question").set("Authorization", `Bearer ${userToken3}`).send({
      title: "User Test 3 Question",
      content: "Consectetur adipiscing elit",
      anonymous: false
    });
    const updated = await (0, import_supertest2.default)(app.server).put(`/question/${response.body.id}`).set("Authorization", `Bearer ${userToken4}`).send({
      title: "User Test 4 Question"
    });
    (0, import_vitest.expect)(updated.statusCode).toEqual(401);
    (0, import_vitest.expect)(updated.body).toEqual(
      import_vitest.expect.objectContaining({ message: "Invalid Credentials Error" })
    );
  });
  (0, import_vitest.it)("User cannot be create a question with same title", async () => {
    const { token } = await createAndAuthenticateTest(app, {
      email: "testuser5@email.com",
      username: "testuser5"
    });
    await (0, import_supertest2.default)(app.server).post("/question").set("Authorization", `Bearer ${token}`).send({
      title: "User Test 5 Question",
      content: "Consectetur adipiscing elit",
      anonymous: false
    });
    const response = await (0, import_supertest2.default)(app.server).post("/question").set("Authorization", `Bearer ${token}`).send({
      title: "User Test 5 Question",
      content: "Consectetur adipiscing elit",
      anonymous: false
    });
    (0, import_vitest.expect)(response.statusCode).toEqual(409);
    (0, import_vitest.expect)(response.body).toEqual(
      import_vitest.expect.objectContaining({
        message: "A publication with that title already exists. try another title"
      })
    );
  });
  (0, import_vitest.it)("User cannot be update a question with id (uuid) invalid", async () => {
    const { token } = await createAndAuthenticateTest(app, {
      email: "testuser6@email.com",
      username: "testuser6"
    });
    const invalidUuid = "83051d74-034f-4fe4-be39-179b4c62b02dC";
    const response = await (0, import_supertest2.default)(app.server).put(`/question/${invalidUuid}`).set("Authorization", `Bearer ${token}`).send({
      title: "User Test 6 Question",
      content: "Consectetur adipiscing elit",
      anonymous: false
    });
    (0, import_vitest.expect)(response.statusCode).toEqual(409);
    (0, import_vitest.expect)(response.body).toEqual({
      message: {
        _errors: import_vitest.expect.any(Array),
        questionId: import_vitest.expect.objectContaining({
          _errors: import_vitest.expect.arrayContaining([
            "Invalid question id. must be UUID"
          ])
        })
      }
    });
  });
});
