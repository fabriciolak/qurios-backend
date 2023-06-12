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

// src/http/controllers/question/routes.ts
var routes_exports = {};
__export(routes_exports, {
  questionRoutes: () => questionRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var import_process = require("process");
var prisma = new import_client.PrismaClient({
  log: import_process.env.NODE_ENV === "development" ? ["query"] : []
});

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
var import_zod = require("zod");
async function create(request, reply) {
  const createQuestionBodySchema = import_zod.z.object({
    title: import_zod.z.string().min(1, {
      message: "The title should be a minimum of 1 characters."
    }),
    content: import_zod.z.string().min(1, {
      message: "The content should be a minimum of 1 characters."
    }),
    anonymous: import_zod.z.boolean().default(false)
  });
  const questionRepository = await makeCreateQuestionUseCase();
  try {
    const { title, content, anonymous } = createQuestionBodySchema.parse(
      request.body
    );
    const userProfile = await prisma.user.findUnique({
      where: {
        id: request.user.sub
      },
      select: {
        username: true,
        questions: true
      }
    });
    const generatedSlugUrl = `${userProfile?.username}/${generateSlug(title)}`;
    const slugAlreadyExists = userProfile?.questions.find((question2) => {
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
    if (error instanceof import_zod.ZodError) {
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

// src/use-cases/errors/invalid-credentials.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super(`Invalid Credentials Error`);
  }
};

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
var import_zod2 = require("zod");
async function update(request, reply) {
  const updateQuestionParamsSchema = import_zod2.z.object({
    questionId: import_zod2.z.string().uuid({
      message: "Invalid question id. must be UUID"
    })
  });
  const updateQuestionBodySchema = import_zod2.z.object({
    title: import_zod2.z.string().min(1, {
      message: "The title should be a minimum of 1 characters."
    }).optional(),
    content: import_zod2.z.string().min(1, {
      message: "The content should be a minimum of 1 characters."
    }).optional(),
    anonymous: import_zod2.z.boolean().default(false)
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
    if (error instanceof import_zod2.ZodError) {
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
var import_zod3 = require("zod");
async function deleteQuestion(request, reply) {
  const deleteQuestionBodySchema = import_zod3.z.object({
    question_id: import_zod3.z.string().uuid()
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
    if (error instanceof import_zod3.ZodError) {
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
async function questionRoutes(app) {
  app.addHook("onRequest", verifyJwt);
  app.get("/question", questionList);
  app.post("/question", create);
  app.put("/question/:questionId", update);
  app.delete("/question", deleteQuestion);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  questionRoutes
});
