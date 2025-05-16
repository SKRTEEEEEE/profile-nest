export abstract class ReadOneRepository<TB, TDB> implements
ReadOneI<TB, TDB>{
    abstract readOne(filter: ReadOneProps<TB, TDB>): ReadOneRes<TB,TDB>
}