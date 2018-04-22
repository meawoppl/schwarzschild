import { BaseEntity } from './../../shared';

export class Stone implements BaseEntity {
    constructor(
        public id?: number,
        public creationTime?: any,
        public shortName?: string,
        public longName?: string,
        public completionTime?: any,
    ) {
    }
}
