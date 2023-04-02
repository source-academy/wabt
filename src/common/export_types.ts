export enum ExportType {
  Func,
  Table,
  Mem,
  Global,
}

export namespace ExportType {
  export function getEncoding(e: ExportType): Uint8Array {
    switch (e) {
      case ExportType.Func:
        return new Uint8Array([0]);
      case ExportType.Table:
        return new Uint8Array([1]);
      case ExportType.Mem:
        return new Uint8Array([2]);
      case ExportType.Global:
        return new Uint8Array([3]);

      default:
        throw new Error(`ExportType ${e} not recognized`);
    }
  }
}
