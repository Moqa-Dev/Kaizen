export class ResultSet<T> {
    "@odata.context": string;
    "@odata.count": number;
    "value": T[];
    "pageIndex": number = 0;
}
