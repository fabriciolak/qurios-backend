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
async function create(request, reply) {
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
      request.body
    );
    const userProfile2 = await prisma.user.findUnique({
      where: {
        id: request.user.sub
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
      user_id: request.user.sub,
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
async function update2(request, reply) {
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
      request.body
    );
    const { questionId } = updateQuestionParamsSchema.parse(request.params);
    const userHavePermission = await prisma.question.findFirst({
      where: {
        id: questionId,
        AND: {
          user_id: request.user.sub
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
      user_id: request.user.sub
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
async function deleteQuestion(request, reply) {
  const deleteQuestionBodySchema = import_zod7.z.object({
    question_id: import_zod7.z.string().uuid()
  });
  try {
    const { question_id } = deleteQuestionBodySchema.parse(request.body);
    const userHavePermission = await prisma.question.findFirst({
      where: {
        id: question_id,
        user_id: request.user.sub
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
async function questionList(request, reply) {
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
app.get("/", (request, reply) => {
  console.log(request.method, request.url);
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

// src/server.ts
app.listen({
  host: "0.0.0.0",
  port: 3333
}).then(() => {
  console.log(`Server running \u{1F47B}

http: http://localhost:3333`);
});
