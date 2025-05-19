type ReadOneRes<TB, TDB> = EntitieRes<TB, TDB>
type ReadOneProps<TB, TDB> = ReadProps<TB, TDB>
type ReadOneI<TB, TDB> = {
    readOne(filter: ReadOneProps<TB, TDB>):
        ReadOneRes<TB,TDB>
}