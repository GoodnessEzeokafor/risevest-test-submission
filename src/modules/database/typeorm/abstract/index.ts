import { CommentEntity, PostEntity } from "src/modules/post";
import { UserEntity } from "src/modules/user/entity";
import { EntityManager } from "typeorm";

export abstract class IGenericRepository<T> {


    abstract findAllWithPagination(
        query: any,
        options?: {
            useDefault?: boolean;
            selectFields?: string[] | string;
            relationFields?: Record<string, any>;
            relationIds?: boolean;
        },
    ): Promise<{
        data: any;
        pagination: {
            hasPrevious: boolean;
            prevPage: number;
            hasNext: boolean;
            next: number;
            currentPage: number;
            pageSize: number;
            lastPage: number;
            total: any;
        };
    }>;

    abstract findOne(
        key: Partial<T> | Partial<T>[],
        options?: {
            useDefault?: boolean;
            selectFields?: string[] | string;
            relationFields?: string[] | string;
            relationIds?: boolean;
        }
    ): Promise<T>;

    abstract create(
        payload: Partial<T>,
        options?: { transaction?: EntityManager; useQueryBuilder?: boolean }
    ): Promise<T>;

    abstract runQuery(query: string): Promise<any>;
    abstract length(filter: Partial<T>): Promise<any>;
}



export abstract class IDatabaseServices {
    abstract users: IGenericRepository<UserEntity>;
    abstract posts: IGenericRepository<PostEntity>;
    abstract comments: IGenericRepository<CommentEntity>;
}


