var fun = require('./functions');


var workspace_id = process.env.WORKSPACE_ID;

//começando a conversação com uma mensagem vazia
//chatbot.message({workspace_id}, trataResposta);

let fimDeConversar = false;

var entitySex = new Object();
entitySex.entityTag = 'sexo';
entitySex.entities = ['homem','mulher']
entitySex.homem = ['home', 'homem', 'homen', 'macho', 'cara', 'men', 'man'];
entitySex.mulher = ['mulher', 'muié', 'muie', 'fêmea', 'women', 'mulier'];
entitySex.description = 'Entidade Sexo';

var entityResp = new Object();
entityResp.entityTag = 'resposta';
entityResp.entities = ['sim','nao'];
entityResp.sim = ['sim', 'claro', 'posso', 'pode fazer', 'aceito', 'yes', 'go', 'partiu', 'vamos', 'bora'];
entityResp.nao = ['não', 'agora não', 'não posso', 'depois', 'no', 'nope', 'nem'];
entityResp.description = 'Entidade Resposta';

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
    entitySex.entityTag,
    fun.generateEntity(entitySex),
    entitySex.description)

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

fun.createNewDialog(
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
    undefined)

fun.createNewDialog(
    workspace_id,
    "dialog_nome",
    "#responder", 
    {
        text: 'Qual seu nome?',
    },
    "Dialog Nome",
    "Dialogo para obter o nome do entrevistado.",
    undefined,
    {
        behavior: "jump_to",
        selector: "user_input",
        dialog_node: "dialog_idade"
    },
    "dialog_welcome",
    {
        name: "<?input.text?>"
    }
)

fun.createNewDialog(
    workspace_id,
    "dialog_idade",
    "true", 
    {
        text: 'Qual sua idade?',
    },
    "Dialog Idade",
    "Dialogo para obter idade do entrevistado.",
    undefined,
    undefined,
    "dialog_nome",
     {
        idade: "<?input.text?>"
    },
    'frame',
    'does_not_return',
    'allow_all')


fun.createNewDialog(
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
    "Dialogo Final",
    undefined,
    undefined
    )


// fun.createNewDialog(
//     workspace_id,
//     "dialog_end",
//     "#Intencao", {
//         text: 'Teste Outpu1',
//     },
//     "Titulo Teste4",
//     "Descrição Teste4",
//     undefined,
//     undefined,
//     "Bem-vindo")

