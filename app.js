const watson = require('watson-developer-cloud/assistant/v1');
const prompt = require('prompt-sync')();
require('dotenv').config()

const chatbot = new watson({
    username: process.env.USERNAME_WATSON,
    password: process.env.PASSWORD,
    version: process.env.VERSION,
});

const workspace_id = process.env.WORKSPACE_ID;

//começando a conversação com uma mensagem vazia
chatbot.message({workspace_id}, trataResposta);

let fimDeConversar = false;

var params = {
    workspace_id: process.env.WORKSPACE_ID,
    intent: 'hello',
    examples: [
        {
            text: 'Good morning'
        },
        {
            text: 'Hi there'
        }
    ]
};

chatbot.createIntent(params, function (err, response) {
    if (err) {
        console.error(err);
    } else {
        console.log(JSON.stringify(response, null, 2));
    }
});

var params2 = {
    workspace_id: process.env.WORKSPACE_ID,
    entity: 'beverage',
    values: [
        {
            value: 'water'
        },
        {
            value: 'orange juice'
        },
        {
            value: 'soda'
        }
    ]
};

chatbot.createEntity(params2, function (err, response) {
    if (err) {
        console.error(err);
    } else {
        console.log(JSON.stringify(response, null, 2));
    }
});

var params3 = {
    workspace_id: process.env.WORKSPACE_ID,
    dialog_node: 'greeting4',
    conditions: '#hello',
    output: {
        text: 'Hi! How can I help you?'
    },
    title: 'Greeting2'
};

chatbot.createDialogNode(params3, function (err, response) {
    if (err) {
        console.error(err);
    } else {
        console.log(JSON.stringify(response, null, 2));
    }
});

function trataResposta(err, resposta){
    if (err) {
        console.log(err);
        return;        
    }

    if (resposta.intents.length) {
        console.log('Eu detectei a inteção: ' + resposta.intents[0].intent);
        if (resposta.intents[0].intent == 'General_Ending'){
            fimDeConversar = true;
        }
    }
    //exibe toda a json 
    console.log(resposta)

    if (resposta.output.text.length > 0) {
        console.log(resposta.output.text[0])
    }

    if(!fimDeConversar){
        const mensagemUsuario = prompt('>>');
        chatbot.message({
            workspace_id,
            input: {text: mensagemUsuario},
            context: resposta.context
        }, trataResposta);
    }
}