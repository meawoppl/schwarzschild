import { BaseEntity } from './../../shared';

export class Linkage implements BaseEntity {
    constructor(
        public id?: number,
        public creationTime?: any,
        public dependee?: BaseEntity,
        public dependant?: BaseEntity,
    ) {
    }
}
