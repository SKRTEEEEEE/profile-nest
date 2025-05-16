export abstract class RPRepository<TB, TDB> implements 
ReadI<TB, TDB>, 
PopulateI<TB, TDB>  
{
    abstract read(filter: ReadProps<TB, TDB>): ReadRes<TB, TDB>;
    abstract populate(docs: PopulateProps<TB>):  PopulateRes<TB, TDB>;   
}
