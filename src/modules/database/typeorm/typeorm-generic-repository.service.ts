import { DataSource, EntityManager, EntityTarget, UpdateResult } from 'typeorm';
import { IGenericRepository } from './abstract';

export class TypeOrmGenericRepository<T> implements IGenericRepository<T> {
  private _entity: any;
  private _txEntity: any;

  constructor(
    private connection: DataSource,
    entity: EntityTarget<T>,
    // _options?: {
    //   select?: string[];
    //   relation?: string[];
    //   fullText?: string[];
    // },
  ) {
    this._entity = this.connection.getRepository(entity);
    this._txEntity = entity;
  }

  async findAllWithPagination(
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
  }> {
    const perPage = Number(query.perPage) || 10;
    const page = Number(query.page) || 1;
    const sort = query.sort || 'DESC';

    const excludedFields = [
      'page',
      'perPage',
      'dateFrom',
      'dateTo',
      'sort',
      'search',
      'sortBy',
      'orderBy',
      'startPage',
      'endPage',
    ];
    excludedFields.forEach((el) => delete query[el]);

    const skip = page * perPage - perPage;
    const take = perPage;

    const baseFindOptions = {
      where: { ...query },
      ...(options?.relationFields
        ? { relations: options.relationFields }
        : null),
      ...(options?.selectFields ? { select: options.selectFields } : []),
      ...(options?.relationIds ? { loadRelationIds: true } : false),
      order: {
        createdAt: sort,
      },
      take,
      skip,
    };

    // const  = await this._entity.find({
    //   ...baseFindOptions,

    // });

    const [data, total] = await this._entity.findAndCount(baseFindOptions);
    const pagination = {
      hasPrevious: page > 1,
      prevPage: page - 1,
      hasNext: page < Math.ceil(total / perPage),
      next: page + 1,
      currentPage: Number(page),
      pageSize: perPage,
      lastPage: Math.ceil(total / perPage),
      total,
    };

    return { data, pagination };
  }

  async find(
    query: any,
    options?: {
      useDefault?: boolean;
      selectFields?: string[] | string;
      relationFields?: string[] | string;
    },
  ): Promise<{
    data: any;
  }> {
    const startPage = Number(query.startPage);
    const endPage = Number(query.endPage);
    const perPage = Number(query.perPage) || 10;
    const page = Number(query.page) || 1;

    console.log('===== start page  =====');
    console.log(startPage);
    console.log('===== start page  =====');

    console.log('===== end page  =====');
    console.log(endPage);
    console.log('===== end page  =====');

    const skip = startPage
      ? (startPage - 1) * perPage
      : page * perPage - perPage;
    const take = endPage ? (endPage - startPage + 1) * perPage : perPage;

    const excludedFields = [
      'page',
      'perPage',
      'dateFrom',
      'dateTo',
      'sort',
      'search',
      'sortBy',
      'orderBy',
      'startPage',
      'endPage',
    ];
    excludedFields.forEach((el) => delete query[el]);
    if (startPage && endPage) {
      const data = await this._entity.find({
        where: { ...query },
        order: {
          createdAt: 'DESC',
        },
        ...(options?.relationFields
          ? { relations: options.relationFields }
          : null),
        ...(options?.selectFields ? { select: options.selectFields } : []),
        take,
        skip,
      });
      return data;
    }
    const data = await this._entity.find({
      where: { ...query },
      order: {
        createdAt: 'DESC',
      },
      ...(options?.relationFields
        ? { relations: options.relationFields }
        : null),
      ...(options?.selectFields ? { select: options.selectFields } : []),
    });

    return data;
  }
  async findOne(
    key: Partial<T> | Partial<T>[],
    options?: {
      useDefault?: boolean;
      selectFields?: string[] | string;
      relationFields?: string[] | string;
      relationIds?: boolean;
    },
  ): Promise<T> {
    const selectFieldsCondition = options?.selectFields
      ? { select: options.selectFields }
      : undefined;
    const relationFieldsCondition = options?.relationFields
      ? { relations: options.relationFields }
      : undefined;
    const loadRelationIdsCondition = options?.relationIds
      ? { loadRelationIds: true }
      : undefined;

    // Combine conditions
    const queryOptions: any = {
      where: key,
      ...selectFieldsCondition,
      ...relationFieldsCondition,
      ...loadRelationIdsCondition,
    };

    const data = await this._entity.findOne(queryOptions);
    return data;
  }

  async create(
    payload: T,
    options?: { useQueryBuilder?: boolean; transaction?: EntityManager },
  ): Promise<T> {
    if (options?.transaction)
      return await options.transaction
        .getRepository(this._txEntity)
        .save(payload);
    if (!options?.useQueryBuilder) return await this._entity.save(payload);

    const { raw } = await this._entity
      .createQueryBuilder()
      .insert()
      .values(payload)
      .execute();
    if (raw.affectedRows !== 1) throw new Error('Query failed');

    return payload;
  }

  /**
   *
   * @param query
   * @returns custom query runner
   */
  async runQuery(query: string) {
    const data = await this._entity.query(query);

    return data;
  }

  async length(filter: Partial<T>) {
    const data = await this._entity.count({ where: { ...filter } });
    return Promise.resolve(data);
  }

  async update(
    key: Partial<T>,
    payload: Partial<T>,
    options?: { transaction?: EntityManager },
  ): Promise<UpdateResult> {
    if (options?.transaction) {
      const data = await options.transaction
        .getRepository(this._txEntity)
        .update({ ...key }, { ...payload });
      return data.raw[0];
    }

    const data = await this._entity.update({ ...key }, { ...payload });
    return data;
  }

  async delete(key: Partial<T>, options?: { transaction: EntityManager }) {
    if (options?.transaction) {
      const data = await options.transaction
        .getRepository(this._txEntity)
        .delete({ ...key });
      return data;
    }
    const data = await this._entity.delete({ ...key });
    return data;
  }

  async increment(
    filter: Partial<T>,
    key: string,
    inc: number,
    options?: { transaction: EntityManager },
  ): Promise<UpdateResult> {
    if (options?.transaction) {
      const data = await options.transaction
        .getRepository(this._txEntity)
        .increment({ ...filter }, key, inc);
      return data;
    }
    const data = await this._entity.increment({ ...filter }, key, inc);
    return data;
  }
  async decrement(
    filter: Partial<T>,
    key: string,
    dec: number,
    options?: { transaction: EntityManager },
  ) {
    if (options?.transaction) {
      const data = await options.transaction
        .getRepository(this._txEntity)
        .decrement({ ...filter }, key, dec);
      return data;
    }
    const data = await this._entity.decrement({ ...filter }, key, dec, {
      transaction: true,
    });
    return data;
  }

  async bulkCreate(
    payload: T[],
    options?: { transaction?: EntityManager },
  ): Promise<any> {
    // If a transaction is provided, use it directly to save the payload.
    if (options?.transaction) {
      return options.transaction.getRepository(this._txEntity).save(payload);
    }
    // Otherwise, create a query builder, insert the values, and execute.
    return this._entity
      .createQueryBuilder()
      .insert()
      .into(this._txEntity)
      .values(payload)
      .execute();
  }

}
