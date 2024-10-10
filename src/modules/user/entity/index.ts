import { BaseEntity } from "src/shared";

export class UserEntity extends BaseEntity {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}
