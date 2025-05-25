export interface PersistedEntity<TId = any, TDate = any> {
  id: TId;
  createdAt: TDate;
  updatedAt: TDate;
}