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

// src/http/controllers/question/questions.ts
var questions_exports = {};
__export(questions_exports, {
  questionList: () => questionList
});
module.exports = __toCommonJS(questions_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var import_process = require("process");
var prisma = new import_client.PrismaClient({
  log: import_process.env.NODE_ENV === "development" ? ["query"] : []
});

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  questionList
});
