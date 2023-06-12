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

// src/repositories/in-memory/in-memory-question-repository.ts
var in_memory_question_repository_exports = {};
__export(in_memory_question_repository_exports, {
  InMemoryQuestionRepository: () => InMemoryQuestionRepository
});
module.exports = __toCommonJS(in_memory_question_repository_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryQuestionRepository
});
