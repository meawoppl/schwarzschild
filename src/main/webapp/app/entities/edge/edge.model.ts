import { BaseEntity } from './../../shared';

export class Edge implements BaseEntity {
    constructor(
        public id?: number,
        public description?: string,
        public from?: BaseEntity,
        public to?: BaseEntity,
    ) {
    }
}
