import { BaseEntity } from './../../shared';

export class Stone implements BaseEntity {
    constructor(
        public id?: number,
        public completionTime?: any,
        public name?: string,
        public description?: string,
    ) {
    }
}
