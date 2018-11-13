function createNewIntent() {
    chatbot.createIntent(params, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
};

function createNewEntity() {
    chatbot.createEntity(params2, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
}

function createNewDialog() {
    chatbot.createDialogNode(params3, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(response, null, 2));
        }
    });
}

function trataResposta(err, resposta) {
    if (err) {
        console.log(err);
        return;
    }

    if (resposta.intents.length) {
        console.log('Eu detectei a inteção: ' + resposta.intents[0].intent);
        if (resposta.intents[0].intent == 'General_Ending') {
            fimDeConversar = true;
        }
    }
    //exibe toda a json 
    console.log(resposta);

    if (resposta.output.text.length > 0) {
        console.log(resposta.output.text[0])
    }

    if (!fimDeConversar) {
        var mensagemUsuario = prompt('>>');
        chatbot.message({
            workspace_id,
            input: {
                text: mensagemUsuario
            },
            context: resposta.context
        }, trataResposta);
    }
}