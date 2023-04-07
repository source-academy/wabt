import { ValueType } from './type';
import { type OpcodeType } from './opcode';
export declare namespace Opcode {
    function getReturnType(o: OpcodeType): ValueType;
    function getParamTypes(o: OpcodeType): ValueType[];
    function getParamLength(o: OpcodeType): number;
    function getMemSize(o: OpcodeType): ValueType;
    function getPrefix(o: OpcodeType): number;
    function getCode(o: OpcodeType): number;
    function getText(o: OpcodeType): string;
    function getDecompText(o: OpcodeType): string;
}
