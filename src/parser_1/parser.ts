// import { Token, TokenType } from '../token';
// import assert from 'assert';
// import {
//   FunctionBody, FunctionExpression,
//   FunctionSignature,
//   ModuleExpression,
//   UnfoldedTokenSequence,
//   type IntermediateRepresentation,
// } from '../ir';

// import { type ValueType } from '../common/type';
// import { type ProgramTree } from '../parser/tree_types';

// export class Parser {
//   parseProgramTree(
//     tree: ProgramTree | Token,
//   ): IntermediateRepresentation {
//     if (tree instanceof Token) {
//       return tree;
//     }

//     if (tree.isModuleDeclaration()) {
//       return this.parseModuleExpression(tree);
//     }

//     if (tree.isFunctionDeclaration()) {
//       return this.parseFunctionExpression(tree);
//     }

//     return new UnfoldedTokenSequence(tree.unfold());
//   }

//   private parseModuleExpression(tree: ProgramTree): ModuleExpression {
//     return new ModuleExpression(tree.getBody()
//       .map((t) => this.parseProgramTree(t))); // If I just do map(this.parseProgramTree), 'this' becomes undefined
//   }

//   private parseFunctionExpression(tree: ProgramTree): FunctionExpression {
//     let paramTypes: ValueType[] = [];
//     let paramNames: string[] = [];
//     let resultTypes: ValueType[] = [];
//     let body: IntermediateRepresentation[] = [];

//     assert(tree.isFunctionDeclaration());

//     // cleaner this way
//     // eslint-disable-next-line newline-per-chained-call
//     for (const t of tree.getBody()) {
//       if (t instanceof Token) {
//         body.push(t);
//       } else if (t.isReservedType('param')) {
//         // eslint-disable-next-line newline-per-chained-call
//         t.getBody().forEach((param) => {
//           assert(param instanceof Token);
//           if (param.type === TokenType.Var) {
//             paramNames.push(param.lexeme);
//           } else if (param.type === TokenType.ValueType) {
//             assert(param.valueType !== null);
//             paramTypes.push(param.valueType);
//           }
//         });
//       } else if (t.isReservedType('result')) {
//         // eslint-disable-next-line newline-per-chained-call
//         t.getBody().forEach((result) => {
//           assert(result instanceof Token);
//           assert(result.valueType !== null);
//           resultTypes.push(result.valueType);
//         });
//       } else {
//         body.push(this.parseProgramTree(t));
//       }
//     }

//     return new FunctionExpression(new FunctionSignature(paramTypes, paramNames, resultTypes), new FunctionBody(body));
//   }

//   parse() {
//     this.cursor = 0;
//     this.tree = this.getGrouping();
//     return this.tree;
//   }
// }
