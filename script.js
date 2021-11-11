const usuario = {}
let controler = false;

function enviarUsuario(){
    const entrada = document.querySelector(".paginaInicial input");
    const botaoEntrar = document.querySelector(".submeterUsuario");
    const carregando = document.querySelector(".carregando");
    const span = document.querySelector(".paginaInicial span");
    const nome = entrada.value;
    usuario.name = nome;
    
    entrada.classList.add("escondida");
    botaoEntrar.classList.add("escondida");
    carregando.classList.remove("escondida"); 
    span.classList.remove("escondida");

    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",usuario);
    promessa.then(pegarMensagem);
    promessa.catch(tratarErro);
}

function pegarMensagem(retorno = ""){
    if(controler == false){
        controler = true;
        setInterval(() => { verificarLogin();}, 5000);
    }
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(carregarMensagem);
    promessa.catch(tratarErro);
}

function verificarLogin(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/status",usuario);
    promessa.then(verificar);
    promessa.catch(tratarErro);
}

function verificar(resposta){
    //verificar se chegou mesadem nova
}

function tratarErro(erro){
    console.log(erro);
}


function carregarMensagem(resposta){
    const entrada = document.querySelector(".paginaInicial");
    let listamensagens = resposta.data;
    let cont =0;
    const paginaMensagem = document.querySelector(".paginaMensagem")
    const mensagens = document.querySelector(".mensagens")
    mensagens.innerHTML="";
    for(let i=0; i< Object.keys(listamensagens).length; i++){
        if((listamensagens[i].from).length > 15)
        {
            listamensagens[i].from = (listamensagens[i].from).substring(0,15);
        }
        if((listamensagens[i].from).length > 15)
        {
            listamensagens[i].to = (listamensagens[i].to).substring(0,15);
        }
        if(listamensagens[i].type == 'status'){
            mensagens.innerHTML += `
            <div class ="mensagem entrarSala">
                <div class="horario">${listamensagens[i].time}</div>
                <div class="nomeUsuario">${listamensagens[i].from}</div>
                <div class="texto">${listamensagens[i].text}</div>
            </div> `          
        }else if(listamensagens[i].type == "message"){
            mensagens.innerHTML += `
            <div class ="mensagem mensagemComum">
                <div class="horario">${listamensagens[i].time}</div>
                <div class="nomeUsuario">${listamensagens[i].from}</div>
                <span class="texto2">para</span>
                <div class="nomeUsuario">${listamensagens[i].to}:</div>
                <div class="texto">${listamensagens[i].text}</div>
            </div> `    
        }
    }
    entrada.classList.add("escondida");
    paginaMensagem.classList.remove("escondida");
}

const inputmsg = document.querySelector(".mensagemDigitada");
inputmsg.addEventListener('keyup', function(e){
  var key = e.which || e.keyCode;
  if (key == 13) {
      enviarMensagem();
  }
});

const inputnome = document.querySelector(".nome");
inputnome.addEventListener('keyup', function(e){
  var key = e.which || e.keyCode;
  if (key == 13) {
      enviarUsuario();
  }
});

function enviarMensagem(){
    const inputmsg = document.querySelector(".mensagemDigitada");
    const mensagem ={
            from: usuario.name,
            to: "Todos",
            text: inputmsg.value,
            type: "message" // ou "private_message" para o bônus
        }
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensagem);
    promessa.then(pegarMensagem);
    inputmsg.value = "";
    promessa.catch(tratarErro);

}

function usuariosAtivos(){
    const paginaMensagem = document.querySelector(".classificarMsg")
    paginaMensagem.classList.remove("escondida");

}