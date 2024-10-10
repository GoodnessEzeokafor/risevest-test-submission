import {
    Entity,
    Index,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { BaseModel } from '../base';
import { CommentEntity } from 'src/modules/post';
import { User } from '../user';
import { Post } from '../post';


@Entity('comments')
@Index(['comment'])
export class Comment extends BaseModel implements CommentEntity {

    @Column({ type: 'text', nullable: true })
    comment: string;

    // The foreign key to store the related User's ID
    @Column({ nullable: true, type: 'uuid' })
    userId: string;

    // The relationship to the User entity
    @ManyToOne(() => User, (user) => user.comments, { eager: true })
    @JoinColumn({ name: "userId" }) // This ensures that userId is used as the foreign key
    user: User;

    // The foreign key to store the related Post's ID
    @Column({ nullable: true, type: 'uuid' })
    postId: string;

    // The relationship to the Post entity
    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn({ name: "postId" }) // This ensures that postId is used as the foreign key
    post: Post;
}
