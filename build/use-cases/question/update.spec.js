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

// src/use-cases/question/update.spec.ts
var import_vitest = require("vitest");

// src/use-cases/question/update.ts
var UpdateQuestionUseCase = class {
  constructor(questionsRepository2) {
    this.questionsRepository = questionsRepository2;
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

// src/repositories/in-memory/in-memory-question-repository.ts
var import_crypto = require("crypto");

// src/use-cases/errors/title-slug-already-exisits.ts
var TitleSlugAlreadyExistsError = class extends Error {
  constructor() {
    super(`A publication with that title already exists. try another title`);
  }
};

// src/repositories/in-memory/in-memory-question-repository.ts
var InMemoryQuestionRepository = class {
  constructor() {
    this.questions = [];
  }
  async create(data) {
    const question = {
      id: (0, import_crypto.randomUUID)(),
      title: data.title,
      content: data.content,
      anonymous: data.anonymous ?? false,
      created_at: /* @__PURE__ */ new Date(),
      slug: data.slug ?? "",
      updated_at: null,
      votes: 0,
      user_id: data.anonymous ? "" : data.user_id
    };
    this.questions.push(question);
    return question;
  }
  async update(questionId, data) {
    const questionIndex = this.questions.findIndex(
      (question) => question.id === questionId
    );
    if (questionIndex === -1) {
      return null;
    }
    const updatedQuestion = {
      ...this.questions[questionIndex],
      title: data.title !== void 0 ? String(data.title) : this.questions[questionIndex].title,
      updated_at: data.updated_at !== void 0 ? data.updated_at : this.questions[questionIndex].updated_at
    };
    this.questions[questionIndex] = updatedQuestion;
    return updatedQuestion;
  }
  async delete(questionId) {
    const questionToDeleteIndex = this.questions.findIndex(
      (question) => question.id === questionId
    );
    if (questionToDeleteIndex !== -1) {
      this.questions.splice(questionToDeleteIndex, 1);
    }
    return {};
  }
  async findBySlug(slug) {
    const questionIndex = this.questions.findIndex(
      (question) => question.slug === slug
    );
    if (questionIndex !== -1) {
      throw new TitleSlugAlreadyExistsError();
    }
    return this.questions[questionIndex];
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

// src/use-cases/question/update.spec.ts
var import_bcryptjs2 = require("bcryptjs");
var questionsRepository;
var sut;
var createQuestion;
var usersRepository;
var userCreate;
(0, import_vitest.describe)("Update question use case", () => {
  (0, import_vitest.beforeEach)(async () => {
    questionsRepository = new InMemoryQuestionRepository();
    sut = new UpdateQuestionUseCase(questionsRepository);
    createQuestion = new CreateQuestionUseCase(questionsRepository);
    usersRepository = new InMemoryUsersRepository();
    userCreate = new RegisterUserUseCase(usersRepository);
  });
  (0, import_vitest.it)("Should be update a question", async () => {
    const { user } = await userCreate.execute({
      name: "John Doe",
      email: "johndoe@does.com",
      username: "johndoe",
      password: await (0, import_bcryptjs2.hash)("123456", 6)
    });
    const { question } = await createQuestion.execute({
      title: "John Doe's question",
      content: "John Doe's question content",
      anonymous: false,
      user_id: user.id,
      slug: "john-does-question",
      votes: 0
    });
    const response = await sut.execute(question.id, {
      title: "Updated",
      updated_at: /* @__PURE__ */ new Date("2023-05-19T19:59:01.250Z"),
      user_id: user.id
    });
    (0, import_vitest.expect)(response.question).toEqual(
      import_vitest.expect.objectContaining({
        title: "Updated",
        content: "John Doe's question content",
        updated_at: /* @__PURE__ */ new Date("2023-05-19T19:59:01.250Z")
      })
    );
  });
});
