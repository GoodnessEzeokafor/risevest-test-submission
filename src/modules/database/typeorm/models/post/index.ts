import { PostEntity } from 'src/modules/post';
import {
    Entity,
    Index,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { BaseModel } from '../base';
import { Comment } from '../comment'
import { User } from '../user';

@Entity('posts')
@Index(['title', 'content'])
export class Post extends BaseModel implements PostEntity {

    @Column({ type: 'text', nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    // The foreign key to store the related User's ID
    @Column({ nullable: true, type: 'uuid' })
    userId: string;

    // The relationship to the User entity
    @ManyToOne(() => User, (user) => user.posts, { eager: true })
    @JoinColumn({ name: "userId" }) // This ensures that userId is used as the foreign key
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
}
