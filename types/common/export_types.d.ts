export declare enum ExportType {
    Func = 0,
    Table = 1,
    Mem = 2,
    Global = 3
}
export declare namespace ExportType {
    function getEncoding(e: ExportType): number;
}
