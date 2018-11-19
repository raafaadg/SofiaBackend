var fun = require('./functions');

var workspace_id = process.env.WORKSPACE_ID;

function esperar() {
    return new Promise(
        (resolve, reject) => {
            setTimeout(resolve, 2000);
        }
    )
}

async function executarCreatDialog() {
    fun.createNewDialog(dialog_welcome);
    await esperar();
    fun.createNewDialog(dialog_name);
    await esperar();
    fun.createNewDialog(dialog_get_name);
    await esperar();
    fun.createNewDialog(dialog_age);
    await esperar();
    fun.createNewDialog(dialog_car);
    await esperar();
    fun.createNewDialog(dialog_car_answ);
    await esperar();
    fun.createNewDialog(dialog_car_brand);
    await esperar();
    fun.createNewDialog(dialog_end);
    await esperar();
    fun.createNewDialog(dialog_number_age);
    await esperar();
    fun.createNewDialog(dialog_handler_age);
    await esperar();
    fun.createNewDialog(dialog_handler_sysnumber);
    await esperar();
    fun.createNewDialog(dialog_get_number_age);
    await esperar();
}

async function executarUpdateDialog() {
    fun.updateDialog(dialog_welcome);
    await esperar();
    fun.updateDialog(dialog_name);
    await esperar();
    fun.updateDialog(dialog_get_name);
    await esperar();
    fun.updateDialog(dialog_age);
    await esperar();
    fun.updateDialog(dialog_car);
    await esperar();
    fun.updateDialog(dialog_car_answ);
    await esperar();
    fun.updateDialog(dialog_car_brand);
    await esperar();
    fun.updateDialog(dialog_end);
    await esperar();
    fun.updateDialog(dialog_number_age);
    await esperar();
    fun.updateDialog(dialog_handler_age);
    await esperar();
    fun.updateDialog(dialog_handler_sysnumber);
    await esperar();
    fun.updateDialog(dialog_get_number_age);
    await esperar();
}

//começando a conversação com uma mensagem vazia
//chatbot.message({workspace_id}, trataResposta);

let fimDeConversar = false;

var entityGender = new Object();
entityGender.entityTag = 'gerder';
entityGender.entities = ['homem','mulher']
entityGender.homem = ['home', 'homem', 'homen', 'macho', 'cara', 'men', 'man'];
entityGender.mulher = ['mulher', 'muié', 'muie', 'fêmea', 'women', 'mulier'];
entityGender.description = 'Entidade Genero';

var entityResp = new Object();
entityResp.entityTag = 'resposta';
entityResp.entities = ['sim', 'nao'];
entityResp.sim = ['sim', 'claro', 'posso', 'pode fazer', 'aceito', 'yes', 'go', 'partiu', 'vamos', 'bora'];
entityResp.nao = ['não', 'agora não', 'não posso', 'depois', 'no', 'nope', 'nem'];
entityResp.description = 'Entidade Resposta';

var entityCarBrand = new Object();
entityCarBrand.entityTag = 'carBrand';
entityCarBrand.entities = ['carBrand'];
entityCarBrand.carBrand = ['ford','nissan','honda','hyundai','chevrolet','kia','renault','mercedes-benz',
                            'peugeot','bmw','audi','maruti','mazda','fiat','jeep','changan','geely','buick'];
entityCarBrand.description = 'Entidade Marcas de carros';

var intentResp = new Object();
intentResp.intentTag = 'responder';
intentResp.description = 'Intenção de responder a pesquisa';
intentResp.examples = [
    'Aceito participar',
    'Posso participar sim',
    'Estou disponével agora',
    'Estou tranquilo agora',
    'Posso responder sim',
    'Agora eu estou livre para responder',
    'Sim',
    'Claro'];

var intentRecusar = new Object();
intentRecusar.intentTag = 'recusar';
intentRecusar.description = 'Intenção de recusar responder a pesquisa';
intentRecusar.examples = [
    'Agora não',
    'Não posso',
    'Não quero',
    'Estou ocupado',
    'No momento não posso',
    'Mais tarde',
    'Não',
    "Quem sabe mais tarde",
    "Não me incomode mais"
];

fun.createNewEntity(
    workspace_id,
    entityCarBrand.entityTag,
    fun.generateEntity(entityCarBrand),
    entityCarBrand.description)

fun.createNewEntity(
    workspace_id,
    entityGender.entityTag,
    fun.generateEntity(entityGender),
    entityGender.description)

fun.createNewEntity(
    workspace_id,
    entityResp.entityTag,
    fun.generateEntity(entityResp),
    entityResp.description)

fun.createNewIntent(
    workspace_id,
    intentResp.intentTag,
    fun.generateIntent(intentResp),
    intentResp.description)

fun.createNewIntent(
    workspace_id,
    intentRecusar.intentTag,
    fun.generateIntent(intentRecusar),
    intentRecusar.description)

//Dialogo inicial
const dialog_welcome = fun.skillObject(
    workspace_id,
    "dialog_welcome",
    "welcome", 
    {
        values: [{
                text: "Olá. Você estaria disposto a responder um rápido questionário?"
            },
            {
                text: "Bom dia, como vai? Você teria um minuto para responder algumas perguntas?"
            },
            {
                text: "Olá, eu sou a Sofia, posso lhe fazer algumas poucas perguntas?"
            }
        ],
        "response_type": "text",
        "selection_policy": "random"
    },
    "Bem-vindo",
    "Dialogo inical",
    undefined,
    {
        behavior: "jump_to",
        selector: "user_input",
        dialog_node: "dialog_name"
    }
)

//Dialogo Nome
const dialog_name = fun.skillObject(
    workspace_id,
    "dialog_name",
    "#responder",
    {
        generic: [
            {
                values: [
                    {
                        text: "Para começarmos, qual o seu nome?"
                    }
                ],
                response_type: "text",
                selection_policy: "sequential"
            }
        ]
    },
    "Dialog name",
    "Dialogo para obter o nome do entrevistado.",
    undefined,
    undefined,
    "dialog_welcome",
    undefined,
    undefined,
    "does_not_return",
    'allow_all',
    {
        fallback: "leave"
    }
)

//Dialogo recebe nome
const dialog_get_name = fun.skillObject(
    workspace_id,
    "dialog_get_name",
    "true",
    {
        generic: [
            {
                values: [
                    {
                        text: "Prazer $name, para continuarmos, favor informar sua idade."
                    }
                ],
                response_type: "text",
                selection_policy: "sequential"
            }
        ]
    },
    "Wait for name",
    "Etapa para armazenar o nome do entrevistado",
    'dialog_name',
    undefined,
    undefined,
    {
        name: "<?input.text?>"
    }
)

//Dialogo idade
const dialog_age = fun.skillObject(
    workspace_id,
    "dialog_age",
    "true",
    {
        generic: [
            {
                values: [
                    {
                        text: "Legal, estamos quase chegando ao fim!"
                    }
                ],
                response_type: "text",
                selection_policy: "sequential"
            }
        ]
    },
    "Dialog Age",
    "Etapa para armazenar a idade do entrevistado",
    undefined,
    {
        behavior: "jump_to",
        selector: "condition",
        dialog_node: "dialog_car"
    },
    'dialog_name',
    {
        name: "<?input.text?>"
    },
    'frame',
    "does_not_return",
    "allow_all",
    {
        fallback: "leave"
    },
    "not_allowed"
)

//Dialogo carro
const dialog_car = fun.skillObject(
    workspace_id,
    "dialog_car",
    "true",
    {
        generic: [
            {
                values: [
                    {
                        text: "Você possui carro?"
                    }
                ],
                response_type: "text",
                selection_policy: "sequential"
            }
        ]
    },
    "Dialog Car",
    "Etapa para perguntar se o entrevistado possui carro",
    undefined,
    undefined,
    'dialog_age'
)

//Dialogo possui carro
const dialog_car_answ = fun.skillObject(
    workspace_id,
    "dialog_car_answ",
    "@resposta:sim",
    {
        generic: [
            {
                values: [
                    {
                        text: "Qual a marca do seu carro?"
                    }
                ],
                response_type: "text",
                selection_policy: "sequential"
            }
        ]
    },
    "Wait for Car Answ",
    "Etapa para perguntar a marca do carro do entrevista.",
    'dialog_car'
)

//Dialogo marca do carro
const dialog_car_brand = fun.skillObject(
    workspace_id,
    "dialog_car_brand",
    "@carBrand",
    {
        generic: [
            {
                values: [
                    {
                        text: "Show, você possui um $carBrand"
                    }
                ],
                response_type: "text",
                selection_policy: "sequential"
            }
        ]
    },
    "Wait for Car Brand",
    "Etapa para armazenar a marcar do carro do entrevistado",
    "dialog_car",
    undefined,
    'dialog_car_answ',
    {
        "marcaaCarro": "<?input.text?>"
    }
)


//Dialog End
const dialog_end = fun.skillObject(
    workspace_id,
    "dialog_end",
    "anything_else || #recusar",
    {
        values: [{
                text: "Agradeço pelo seu tempo. Tenha um ótimo dia!"
            },
            {
                text: "Muito obrigado por sua atenção, até a próxima!"
            },
            {
                text: "Obriagdo por seu tempo, até mais!"
            }
        ],
        "response_type": "text",
        "selection_policy": "random"
    },
    "Em outros casos",
    "Dialogo Final"
    )


executarCreatDialog().then(
executarUpdateDialog);

