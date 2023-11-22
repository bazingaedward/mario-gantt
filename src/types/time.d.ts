import { format } from "date-fns";
export declare function getDiffer(unit: string): {
    (start: Date, end: Date): number;
};
export declare function getAdder(unit: string): {
    (start: number | Date, step: number): Date;
};
export declare function getUnitStart(unit: string, start: Date): Date;
export { format };
