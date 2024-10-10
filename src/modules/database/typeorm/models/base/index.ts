import { BaseEntity, DatabaseVersion } from 'src/shared';
import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    DeleteDateColumn,
} from 'typeorm';

export class BaseModel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({
        default: DatabaseVersion.V1,
    })
    version: DatabaseVersion;
}
