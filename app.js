var fun = require('./functions');

var workspace_id = process.env.WORKSPACE_ID;

function esperar() {
    return new Promise(
        (resolve, reject) => {
            setTimeout(resolve, 2500);
        }
    )
}

async function executarCreatDialog() {
    for(let i in arrayDialog){
        fun.createNewDialog(arrayDialog[i]);
        await esperar();
    }
}

async function executarUpdateDialog() {
    for(let i in arrayDialog){
        fun.updateDialog(arrayDialog[i]);
        await esperar();
    }
}

//começando a conversação com uma mensagem vazia
//chatbot.message({workspace_id}, trataResposta);

let fimDeConversar = false;

const qsts = [
    'Qual sua idade',
    'Qua a marca do seu carro?'
];

function createIntentsAndEntities(){
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
}


let arrayDialog = [];
//Dialogo inicial
const dialog_welcome = fun.skillObject(
    workspace_id,
    "Welcome",
    "welcome", 
    {
        "text": {
          "values": [
            "Olá. Você estaria disposto a responder um rápido questionário?",
            "Bom dia, como vai? Você teria um minuto para responder algumas perguntas?",
            "Olá, eu sou a Sofia, posso lhe fazer algumas poucas perguntas?"
          ],
          "selection_policy": "random"
        }
    },
    "Bem-vindo",
    "Dialogo inical"
)

arrayDialog.push(dialog_welcome);

const folder_default = fun.skillObject(
    workspace_id,
    'folder_default',
    '#responder && @resposta:sim',
    undefined,
    'Default Folder',
    undefined,
    undefined,
    undefined,
    'Welcome',
    undefined,
    'folder'
)
arrayDialog.push(folder_default);


const folder_qsts = fun.skillObject(
    workspace_id,
    'folder_qsts',
    'true',
    undefined,
    'Questions Folder',
    undefined,
    undefined,
    undefined,
    'folder_default',
    undefined,
    'folder'
)
arrayDialog.push(folder_qsts);


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
    'folder_default'
)
arrayDialog.push(dialog_name);


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
                        text: "Prazer $name!."
                    }
                ],
                response_type: "text",
                selection_policy: "sequential"
            }
        ]
    },
    "Wait for name",
    "Etapa para armazenar o nome do entrevistado",
    'folder_default',
    undefined,
    "dialog_name",
    {
        name: "<?input.text?>"
    }
)
arrayDialog.push(dialog_get_name);


//Dialogo idade
const dialog_age = fun.skillObject(
    workspace_id,
    'dialog_age',
    'true',
    {
        generic: [
            {
                values: [
                    {
                        text: "Poderia me informar sua idade?"
                    }
                ],
                response_type: "text",
                selection_policy: "sequential"
            }
        ]
    },
    "Age Question",
    'Etapa para armazenar a idade do entrevista',
    'folder_default',
    undefined,
    'dialog_get_name',
    {
        age_count: 0
    }
)
arrayDialog.push(dialog_age);

const dialog_get_age = fun.skillObject(
    workspace_id,
    'dialog_get_age',
    '@sys-number >0',
    {
        "text": {
          "values": [
            "Obrigado por informar sua idade! -> $age. Qual seu gênero?"
          ],
          "selection_policy": "sequential"
        }
    },
    'If Get Age',
    'Dialogo para armazenar a idade caso ela sejá válida',
    'dialog_age',
    {
        "behavior": "jump_to",
        "selector": "condition",
        "dialog_node": "folder_qsts"
    },
    undefined,
    {
        age: "@sys_number"
    }
)
arrayDialog.push(dialog_get_age);

const dialogo_not_get_age = fun.skillObject(
    workspace_id,
    'dialog_not_get_age',
    'anything_else && $age_count<2',
    {
        "text": {
          "values": [
            "Não entendi sua resposta, favor reformular."
          ],
          "selection_policy": "sequential"
        }
    },
    'If Not Get Age',
    'Dialogo que ocorre quando a idade informada não é reconhecida',
    'dialog_age',
    {
        "behavior": "jump_to",
        "selector": "body",
        "dialog_node": "dialog_age"
      },
    'dialog_get_age',
    {
        "age_count": "<? $age_count+1 ?>"
    }
)
arrayDialog.push(dialogo_not_get_age);

const dialog_any_age = fun.skillObject(
    workspace_id,
    'dialog_any_age',
    'anything_else',
    {
        "text": {
          "values": [
            "Sua idade informada foi armazenada! Poderia informar seu gênero?"
          ],
          "selection_policy": "sequential"
        }
    },
    'Get Any Age',
    'Dialogo que armazena qualquer informação enviada pelo entrevistado',
    'dialog_age',
    {
        "behavior": "jump_to",
        "selector": "condition",
        "dialog_node": "dialog_gender"
    },
    'dialog_not_get_age',
    {
        "age": "<? input.text ?>"
    }
)
arrayDialog.push(dialog_any_age);

//Dialogo gênero
const dialog_gender = fun.skillObject(
    workspace_id,
    "dialog_gender",
    "true",
    {
        generic: [
            {
                values: [
                    {
                        text: "Legal, vamos começar com as perguntas!"
                    }
                ],
                response_type: "text",
                selection_policy: "sequential"
            }
        ]
    },
    "Dialog Gender",
    "Etapa para armazenar o gênero do entrevistado",
    'folder_default',
    {
        behavior: "jump_to",
        selector: "condition",
        dialog_node: "folder_qsts"
    },
    'dialog_age',
    {
        gender: "<?entity.literal?>"
    }
)
arrayDialog.push(dialog_gender);


// let dialog = ''
// for(let i in qsts){
//     let obj = {}
//     obj = fun.skillObject(
//         workspace_id,

//     )
// }


//Dialog End
const dialog_end = fun.skillObject(
    workspace_id,
    "dialog_end",
    "anything_else || #recusar",
    {
        "text": {
          "values": [
            "Agradeço pelo seu tempo. Tenha um ótimo dia!",
            "Muito obrigado por sua atenção, até a próxima!",
            "Obriagdo por seu tempo, até mais!"
          ],
          "response_type": "text",
          "selection_policy": "random"
        }
    },
    "Em outros casos",
    "Dialogo Final",
    undefined,
    undefined,
    'folder_qsts'
)
arrayDialog.push(dialog_end);

// createIntentsAndEntities();
executarCreatDialog().then(
executarUpdateDialog);

