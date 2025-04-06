a partir del codigo base en la carpeta 'backend' , actuando como un desarrollador experto y teniendo en cuenta el Diseño Guiado por el Dominio (DDD), los principios SOLID/DRY
ayudame a crear los siguientes endpoints que nos permitirán manipular la lista de candidatos de una aplicación en una interfaz tipo kanban.

# 1
tipo: 'GET'
ruta: '/positions/:id/candidates'
Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:
    Nombre completo del candidato (de la tabla candidate).
    current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
    La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score

# 2
tipo: 'PUT'
ruta: '/candidates/:id/stage'
Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.