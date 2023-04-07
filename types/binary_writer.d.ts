import { ModuleExpression, type IntermediateRepresentation } from './parser/ir';
export declare function encode(ir: IntermediateRepresentation): Uint8Array;
/**
 * Get
 * @param ir
 * @returns
 */
declare function encodeModule(ir: ModuleExpression): Uint8Array;
declare function encodeModuleTypeSection(ir: ModuleExpression): Uint8Array;
declare function encodeModuleFunctionSection(ir: ModuleExpression): Uint8Array;
declare function encodeModuleExportSection(ir: ModuleExpression): Uint8Array;
declare function encodeModuleCodeSection(ir: ModuleExpression): Uint8Array;
export declare namespace NumberEncoder {
    /**
     * Get the little-endian binary encoding of a double-precision floating-point number,
     * in the IEEE-754 specification.
     * @param n number to encode
     * @returns a unsigned-8 bit integer array
     */
    function encodeF64Const(n: number): Uint8Array;
}
export declare const TEST_EXPORTS: {
    encodeModule: typeof encodeModule;
    encodeModuleTypeSection: typeof encodeModuleTypeSection;
    encodeModuleFunctionSection: typeof encodeModuleFunctionSection;
    encodeModuleExportSection: typeof encodeModuleExportSection;
    encodeModuleCodeSection: typeof encodeModuleCodeSection;
};
export {};
