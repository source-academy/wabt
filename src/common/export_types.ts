export enum ExportType {
  Func,
  Table,
  Mem,
  Global,
}

export namespace ExportType {
  export function getEncoding(e: ExportType): number {
    switch (e) {
      case ExportType.Func:
        return 0;
      case ExportType.Table:
        return 1;
      case ExportType.Mem:
        return 2;
      case ExportType.Global:
        return 3;

      default:
        throw new Error(`ExportType ${e} not recognized`);
    }
  }
}
