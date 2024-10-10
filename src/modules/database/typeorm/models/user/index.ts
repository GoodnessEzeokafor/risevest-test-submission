import {
    Entity,
    Index,
    Column,
    OneToMany,
} from 'typeorm';
import { BaseModel } from '../base';
import { Post } from '../post';
import { Comment } from '../comment';
import { UserEntity } from 'src/modules/user/entity';


@Entity('users')
@Index(['firstName', 'lastName', 'username', 'email', 'fullName'])
export class User extends BaseModel implements UserEntity {

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: true })
    password: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
}
