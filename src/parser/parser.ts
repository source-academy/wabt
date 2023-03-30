import { type IntermediateRepresentation } from './ir';
import { type Token, TokenType } from '../common/token';
import { type TokenTree } from './tree_types';

export function getIntermediateRepresentation(tokenTree: TokenTree): IntermediateRepresentation {
  const treeTypeToken = tokenTree[0];

  throw new Error(`Unexpected token type to parse: ${JSON.stringify(treeTypeToken)}`);
}


function isFunctionDeclaration(token: Token): boolean {
  return isReservedType(token, 'func');
}

function isModuleDeclaration(token: Token): boolean {
  return isReservedType(token, 'module');
}

function isReservedType(token: Token, lexeme: string) {
  return (
    token.type === TokenType.Reserved
      && token.lexeme === lexeme
  );
}


/*
  unfold(): Token[] {
    const unfoldedBody = this.getBody()
      .flatMap((tok) => {
        if (tok instanceof ProgramTree) {
          return tok.unfold();
        }
        return [tok];
      });


    if (this.getTypeToken()
      .isOpcodeToken() && this.getTypeToken()
      .getOpcodeParamLength() > 0) {
      assert(this.getBody().length === this.getTypeToken()
        .getOpcodeParamLength());
      return [...unfoldedBody, this.getTypeToken()];
    }

    return [this.getTypeToken(), ...unfoldedBody];
  }



  treeMap<T>(func: (t: Token) => T): Tree<T> {
    return this.contents.map(
      (t) => ((t instanceof ProgramTree) ? t.treeMap(func) : func(t)),
    );
  }
*/

// import { type ProgramTree } from './tree_types';

// export function getIntermediateRepresentation() {

// }
// class Parser {
//   private readonly tokenTree: ProgramTree;

//   constructor(tokenTree: ProgramTree) {
//     this.tokenTree = tokenTree;
//   }
// }
