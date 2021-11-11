const usuario = {}

function enviarUsuario(){
    const entrada = document.querySelector(".paginaInicial input");
    const botaoEntrar = document.querySelector(".submeterUsuario");
    const carregando = document.querySelector(".carregando");
    const span = document.querySelector(".paginaInicial span");
 
    usuario.name = entrada.value;
    
    entrada.classList.add("escondida");
    botaoEntrar.classList.add("escondida");
    carregando.classList.remove("escondida"); 
    span.classList.remove("escondida");

    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",usuario);
    promessa.then(pegarMensagem);
    promessa.catch(erro);


}
function erro(retorno){
    console.log("deu xabu");
}

function pegarMensagem(retorno){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(carregarMensagem);
}

function verificarLogin(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/status",usuario);
    promessa.then(verificar);
    promessa.catch(erro);
}

function verificar(resposta){
    //verificar se chegou mesadem nova
}


function carregarMensagem(resposta){
    
    setInterval(() => { verificarLogin();}, 5000);

    const entrada = document.querySelector(".paginaInicial");
    let listamensagens = resposta.data;
    let cont =0;
    const paginaMensagem = document.querySelector(".paginaMensagem")
    const mensagens = document.querySelector(".mensagens")
    for(let i=0; i< Object.keys(listamensagens).length; i++){
        if(listamensagens[i].type == 'status'){
            mensagens.innerHTML += `
            <div class ="mensagem entrarSala">
                <span class="horario">${listamensagens[i].time}</span>
                <span class="usuario">${listamensagens[i].from}</span>
                <span class="texto">${listamensagens[i].text}</span>
            </div> `          
        }else if(listamensagens[i].type == "message"){
            mensagens.innerHTML += `
            <div class ="mensagem mensagemComum">
                <span class="horario">${listamensagens[i].time}</span>
                <span class="usuario">${listamensagens[i].from}</span>
                <span class="texto">para</span>
                <span class="usuario">${listamensagens[i].to}:</span>
                <span class="texto">${listamensagens[i].text}</span>
            </div> `    
        }
    }
    entrada.classList.add("escondida");
    paginaMensagem.classList.remove("escondida");
}