# App

## USECASES

Toda la lógica ha de ir aquí, por mucho que se usen otros domains, COMO MUCHO PODEMOS TENER VARIOS 'USECASES' ->

-> Para lo mas pequeño -> Como usecases granulares (solo utilizan un domain) 
                        o en el caso de agrupar por uso de domains y luego aplicar los 'servicios' (email, storage, auth, etc..) 
                        -> Le LLAMAREMOS 'service' 
                        -> app/usecases/entities/<entitie>.service.ts - <Entitie>Service
-> Para los usecases consumidos por los controllers -> Le LLAMAREMOS 'usecases' 
                                                    -> app/usecases/adapters/<entitie>.usecases.ts

## INTERFACES
### ENTITIES 
### SHARED(S)
### PATTERN(S) - optional/future
### IMPLEMENTATION
## Nomenclatura 
### Métodos application
No nos hemos de preocupar del nombre de la app/interface ya que en app/usecases le daremos el nombre que queramos.
❓También en la app/usecases podríamos tener métodos que no esten incluidos en la app/interface
### SHARED(--old->services) VS ENTITIES
Todo lo que sea /shareds/ , nos referiremos a los 'layers' (o folders) que utilizaremos para cosas que no sean Entities. Por ejemplo, email, auth, storage, etc...
