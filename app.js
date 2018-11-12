const watson = require('watson-developer-cloud/assistant/v1');
const prompt = require('prompt-sync')();
require('dotenv').config;

const chatbot = new watson({
    username: 'a434b24b-056b-4676-9e6c-5362ac72fedb',
    password: 'zHP7iLqeWquI',
    version: '2018-02-16',
});

const workspace_id = 'a11b3d53-367c-4b4a-b69d-5b49ccf865b8';

//começando a conversação com uma mensagem vazia
chatbot.message({workspace_id}, trataResposta);

let fimDeConversar = false;

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
    // console.log(resposta)

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