var fun = require('./functions');


var workspace_id = process.env.WORKSPACE_ID;

//começando a conversação com uma mensagem vazia
//chatbot.message({workspace_id}, trataResposta);

let fimDeConversar = false;

var intentTexts = ['teste','teste2','teste3','teste4'];
var values = ['water', 'orange juice', 'soda'];
var synonyms = ['akjdka', 'lsfnakjf', 'ajdkaskjd', 'ksndkj', 'knzkjdn'];
var out = [], outIntent = [];
for (var i in values)
    out.push({ value: values[i], synonyms });

for (var i in intentTexts)
    outIntent.push({ text: intentTexts[i] });

// fun.createNewEntity(workspace_id, "EntidadeTeste3", out,"descrição teste");
// fun.createNewIntent(workspace_id, "Intencao", outIntent);

fun.createNewDialog(
    workspace_id, 
    "dialog_teste4", 
    "#Intencao",
    { text: 'Teste Outpu1', text: 'Teste Outpu4', text: 'Teste Outpu4'},
    "Titulo Teste4",
    "Descrição Teste4",
    undefined,
    undefined,
    "Bem-vindo")

