# Temari del mòdul «Tècniques de magatzem» (CFGM Activitats Comercials), organitzat en 8 blocs.
MODUL = 'tecnicas-de-almacen'
BLOCS = {
 'es': {'1': 'Organización del almacén', '2': 'Recepción de mercancías', '3': 'Almacenaje y conservación', '4': 'Gestión de stocks e inventarios',
        '5': 'Preparación de pedidos y expedición', '6': 'Equipos de manipulación', '7': 'Prevención de riesgos laborales en el almacén', '8': 'Gestión informatizada, trazabilidad e indicadores'},
 'ca': {'1': 'Organització del magatzem', '2': 'Recepció de mercaderies', '3': 'Emmagatzematge i conservació', '4': 'Gestió d\'estocs i inventaris',
        '5': 'Preparació de comandes i expedició', '6': 'Equips de manipulació', '7': 'Prevenció de riscos laborals al magatzem', '8': 'Gestió informatitzada, traçabilitat i indicadors'}}
TEMARI = {
 'es': [['1.1', 'El almacén: funciones y tipos'], ['1.2', 'Zonas del almacén y distribución en planta'], ['1.3', 'Sistemas de almacenaje: convencional, compacto, dinámico y móvil'],
        ['1.4', 'Ubicación fija y ubicación caótica'], ['1.5', 'Codificación de ubicaciones'], ['1.6', 'Criterios de colocación: rotación ABC, peso, volumen y compatibilidad'],
        ['2.1', 'Documentación de la recepción: pedido, albarán y factura'], ['2.2', 'Control cuantitativo y cualitativo de la mercancía'], ['2.3', 'Incidencias en la recepción: faltas, sobrantes y daños'],
        ['2.4', 'Codificación y etiquetado: EAN, GS1-128 y RFID'], ['2.5', 'Registro de entradas'],
        ['3.1', 'Condiciones de conservación: temperatura, humedad y luz'], ['3.2', 'Productos perecederos y cadena de frío'], ['3.3', 'Productos frágiles'],
        ['3.4', 'Mercancías peligrosas: clasificación, etiquetado y compatibilidades'], ['3.5', 'Unidades de carga: palés, cajas y contenedores'],
        ['4.1', 'Tipos de stock: mínimo, de seguridad, máximo y punto de pedido'], ['4.2', 'Rotación de stocks y sistemas FIFO, FEFO y LIFO'], ['4.3', 'Valoración de existencias'],
        ['4.4', 'Inventarios: tipos y realización'], ['4.5', 'Mermas, roturas y diferencias de inventario'], ['4.6', 'Análisis ABC de las existencias'],
        ['5.1', 'La orden de pedido y la lista de picking'], ['5.2', 'Sistemas de picking: por pedido, por zonas y por oleadas'], ['5.3', 'Rutas de preparación'],
        ['5.4', 'Embalaje, paletización y etiquetado de expedición'], ['5.5', 'Documentación de la expedición: albarán y carta de porte (CMR)'], ['5.6', 'Carga del vehículo y orden de carga'],
        ['6.1', 'Transpalé manual y eléctrico'], ['6.2', 'Apiladores y carretillas elevadoras'], ['6.3', 'Capacidad de carga y diagrama de carga'], ['6.4', 'Formación y normas de uso de los equipos'],
        ['7.1', 'Riesgos en el almacén: caídas, golpes, atropellos y atrapamientos'], ['7.2', 'Manipulación manual de cargas'], ['7.3', 'Equipos de protección individual (EPI) y señalización'], ['7.4', 'Plan de emergencia e incendios'],
        ['8.1', 'Sistemas de gestión de almacén (SGA)'], ['8.2', 'Lectores de códigos y trazabilidad'], ['8.3', 'Logística inversa: devoluciones'], ['8.4', 'Indicadores de gestión del almacén']],
 'ca': [['1.1', 'El magatzem: funcions i tipus'], ['1.2', 'Zones del magatzem i distribució en planta'], ['1.3', 'Sistemes d\'emmagatzematge: convencional, compacte, dinàmic i mòbil'],
        ['1.4', 'Ubicació fixa i ubicació caòtica'], ['1.5', 'Codificació d\'ubicacions'], ['1.6', 'Criteris de col·locació: rotació ABC, pes, volum i compatibilitat'],
        ['2.1', 'Documentació de la recepció: comanda, albarà i factura'], ['2.2', 'Control quantitatiu i qualitatiu de la mercaderia'], ['2.3', 'Incidències en la recepció: faltes, sobrants i danys'],
        ['2.4', 'Codificació i etiquetatge: EAN, GS1-128 i RFID'], ['2.5', 'Registre d\'entrades'],
        ['3.1', 'Condicions de conservació: temperatura, humitat i llum'], ['3.2', 'Productes peribles i cadena de fred'], ['3.3', 'Productes fràgils'],
        ['3.4', 'Mercaderies perilloses: classificació, etiquetatge i compatibilitats'], ['3.5', 'Unitats de càrrega: palets, caixes i contenidors'],
        ['4.1', 'Tipus d\'estoc: mínim, de seguretat, màxim i punt de comanda'], ['4.2', 'Rotació d\'estocs i sistemes FIFO, FEFO i LIFO'], ['4.3', 'Valoració d\'existències'],
        ['4.4', 'Inventaris: tipus i realització'], ['4.5', 'Mermes, trencaments i diferències d\'inventari'], ['4.6', 'Anàlisi ABC de les existències'],
        ['5.1', 'L\'ordre de comanda i la llista de picking'], ['5.2', 'Sistemes de picking: per comanda, per zones i per onades'], ['5.3', 'Rutes de preparació'],
        ['5.4', 'Embalatge, paletització i etiquetatge d\'expedició'], ['5.5', 'Documentació de l\'expedició: albarà i carta de port (CMR)'], ['5.6', 'Càrrega del vehicle i ordre de càrrega'],
        ['6.1', 'Transpalet manual i elèctric'], ['6.2', 'Apiladors i carretons elevadors'], ['6.3', 'Capacitat de càrrega i diagrama de càrrega'], ['6.4', 'Formació i normes d\'ús dels equips'],
        ['7.1', 'Riscos al magatzem: caigudes, cops, atropellaments i atrapaments'], ['7.2', 'Manipulació manual de càrregues'], ['7.3', 'Equips de protecció individual (EPI) i senyalització'], ['7.4', 'Pla d\'emergència i incendis'],
        ['8.1', 'Sistemes de gestió de magatzem (SGM)'], ['8.2', 'Lectors de codis i traçabilitat'], ['8.3', 'Logística inversa: devolucions'], ['8.4', 'Indicadors de gestió del magatzem']]}
AHORA = {
 'es': {'1.3': 'Hoy también: almacenes automatizados con robots y estanterías móviles (por ejemplo, los grandes centros de comercio electrónico).', '8.1': 'Hoy: SGA en la nube, terminales de radiofrecuencia y picking por voz o por luz (pick-to-light).',
        '5.2': 'Hoy también: preparación de pedidos de comercio electrónico con muchas líneas pequeñas y entregas en 24 horas.'},
 'ca': {'1.3': 'Avui també: magatzems automatitzats amb robots i prestatgeries mòbils (per exemple, els grans centres de comerç electrònic).', '8.1': 'Avui: SGM al núvol, terminals de radiofreqüència i picking per veu o per llum (pick-to-light).',
        '5.2': 'Avui també: preparació de comandes de comerç electrònic amb moltes línies petites i lliuraments en 24 hores.'}}
# Categories del treballador al simulador Palet (la cap t'hi ascendeix)
FASES = {'es': {1: 'Mozo de almacén', 2: 'Preparador de pedidos', 3: 'Carretillero', 4: 'Jefe de equipo', 5: 'Jefe de almacén'},
         'ca': {1: 'Mosso de magatzem', 2: 'Preparador de comandes', 3: 'Carretoner', 4: 'Cap d\'equip', 5: 'Cap de magatzem'}}
