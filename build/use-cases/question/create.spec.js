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

// src/use-cases/question/create.spec.ts
var import_vitest = require("vitest");

// src/use-cases/question/create.ts
var CreateQuestionUseCase = class {
  constructor(questionRepository2) {
    this.questionRepository = questionRepository2;
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

// src/use-cases/question/create.spec.ts
var sutCreateQuestion;
var questionRepository;
var sutCreateUser;
var usersRepository;
(0, import_vitest.describe)("Question use case", () => {
  (0, import_vitest.beforeEach)(() => {
    questionRepository = new InMemoryQuestionRepository();
    sutCreateQuestion = new CreateQuestionUseCase(questionRepository);
    usersRepository = new InMemoryUsersRepository();
    sutCreateUser = new RegisterUserUseCase(usersRepository);
  });
  (0, import_vitest.it)("Should be crate a question", async () => {
    const { user } = await sutCreateUser.execute({
      username: "fabricio",
      name: "Fabricio",
      email: "fabricio@email.com",
      password: "123456"
    });
    const { question } = await sutCreateQuestion.execute({
      title: "title",
      content: "content",
      anonymous: false,
      slug: "title",
      votes: 0,
      user_id: user.id
    });
    (0, import_vitest.expect)(question.user_id).toEqual(user.id);
  });
  (0, import_vitest.it)("Should be crate a anonymous question", async () => {
    const { user } = await sutCreateUser.execute({
      username: "fabricio",
      name: "Fabricio",
      email: "fabricio@email.com",
      password: "123456"
    });
    const { question } = await sutCreateQuestion.execute({
      title: "title",
      content: "content",
      anonymous: true,
      slug: "title",
      votes: 0,
      user_id: user.id
    });
    (0, import_vitest.expect)(question.user_id).toEqual("");
  });
  (0, import_vitest.it)("Should not be crate a question without content and title", async () => {
    const { user } = await sutCreateUser.execute({
      username: "fabricio",
      name: "Fabricio",
      email: "fabricio@email.com",
      password: "123456"
    });
    await (0, import_vitest.expect)(
      sutCreateQuestion.execute({
        title: "",
        content: "content",
        anonymous: true,
        slug: "title",
        votes: 0,
        user_id: user.id
      })
    ).rejects.toThrowError("title are required");
    await (0, import_vitest.expect)(
      sutCreateQuestion.execute({
        title: "title",
        content: "",
        anonymous: true,
        slug: "title",
        votes: 0,
        user_id: user.id
      })
    ).rejects.toThrowError("content are required");
  });
});
