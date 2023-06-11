export interface IDatabase<T, R> {
  create(instance: T): Promise<R>;
  updateOne(instance: T): Promise<R>;
  findOne(instanceId: string): Promise<R | null>;
  find(param: object): Promise<R[]>;
  deleteOne(instanceId: string): Promise<void>;
}
