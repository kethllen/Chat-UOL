const usuario = {}
let entrandoPrimeiraVez = true;
let PaginaInicialParaMensagem = false;
let modoVisibilidade = "Público";
let tipoUsuario = "Todos";
let mensagensRetorno = null;

function trocarPagina(paginaAtual, proximaPagina){
    const pagina1 = document.querySelector(paginaAtual);
    const pagina2 = document.querySelector(proximaPagina);

    pagina1.classList.toggle("escondida");
    pagina2.classList.toggle("escondida");
}

function enviarUsuario(paginaAtual, proximaPagina){
    console.log("oi");
    const entrada = document.querySelector(".nome");
    console.log(entrada)
    const nome = entrada.value;
    usuario.name = nome;
    console.log("vou trocar pagina");
    trocarPagina(paginaAtual, proximaPagina);
    console.log("troquei");
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",usuario);
    promessa.then(pegarMensagem);
    promessa.catch(tratarErro);
    console.log("fizPromessa");
}

function pegarMensagem(retorno = ""){
    if(entrandoPrimeiraVez == true){
        entrandoPrimeiraVez = false;
        setInterval(() => { verificarLogin();}, 5000);
        setInterval(() => { recarregarMensagem();}, 3000);
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

function textoPlaceHolder(visibilidade, pessoa){
    const frase = document.querySelector(".frasePlaceholder");
    frase.innerHTML = `Enviando para ${pessoa} (${visibilidade})`
}

function verificar(retorno){

}


function checkVisibilidade(opcao){
    const visibilidade = document.querySelector(".checkVisi");

    visibilidade.classList.remove("checkVisi");
    visibilidade.querySelector(".checkVisibilidade").classList.add("escondida");

    opcao.classList.add("checkVisi");
    opcao.querySelector(".checkVisibilidade").classList.remove("escondida");
    modoVisibilidade = opcao.querySelector(".modomsg").innerHTML;

}

function checkUsuario(opcao){
    const usuarioAtivo = document.querySelector(".checkUser");

    if(usuarioAtivo !== null) {
        usuarioAtivo.classList.remove("checkUser");
        usuarioAtivo.querySelector("ion-icon").classList.add("escondida");
    }
    opcao.classList.add("checkUser");
    opcao.querySelector("ion-icon").classList.remove("escondida");
    tipoUsuario = opcao.querySelector(".tipoUsuario").innerHTML;
    
}

function tratarErro(erro){
    if(erro.response.status == 400){

        trocarPagina(".paginaCarregando", ".paginaPedirDados");
        const nomeUsuario = document.querySelector(".nome");
        nomeUsuario.value = "";
        nomeUsuario.classList.add("nomeIncorreto");
        nomeUsuario.placeholder ="nome de usuario invalido";
    }else{
        console.log(erro.response);
        window.location.reload();
    }
    
}


function carregarMensagem(resposta){

    let listamensagens = resposta.data;
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
        if(i!=(Object.keys(listamensagens).length)-1){
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
            }else if(listamensagens[i].type =='private_message'){
                if(listamensagens[i].from == usuario.name || listamensagens[i].to == usuario.name){
                    mensagens.innerHTML += `
                    <div class ="mensagem .mensagemReservada">
                        <div class="horario">${listamensagens[i].time}</div>
                        <div class="nomeUsuario">${listamensagens[i].from}</div>
                        <span class="texto2">para</span>
                        <div class="nomeUsuario">${listamensagens[i].to}:</div>
                        <div class="texto">${listamensagens[i].text}</div>
                    </div> `    
                }
        }else{
            if(listamensagens[i].type == 'status'){
                mensagens.innerHTML += `
                <div class ="mensagem entrarSala ultimo">
                    <div class="horario">${listamensagens[i].time}</div>
                    <div class="nomeUsuario">${listamensagens[i].from}</div>
                    <div class="texto">${listamensagens[i].text}</div>
                </div> `          
            }else if(listamensagens[i].type == "message"){
                mensagens.innerHTML += `
                <div class ="mensagem mensagemComum ultimo">
                    <div class="horario">${listamensagens[i].time}</div>
                    <div class="nomeUsuario">${listamensagens[i].from}</div>
                    <span class="texto2">para</span>
                    <div class="nomeUsuario">${listamensagens[i].to}:</div>
                    <div class="texto">${listamensagens[i].text}</div>
                </div> `    
            }else if(listamensagens[i].type =='private_message'){
                if(listamensagens[i].from == usuario.name || listamensagens[i].to == usuario.name){
                    mensagens.innerHTML += `
                    <div class ="mensagem .mensagemReservada ultimo">
                        <div class="horario">${listamensagens[i].time}</div>
                        <div class="nomeUsuario">${listamensagens[i].from}</div>
                        <span class="texto2">para</span>
                        <div class="nomeUsuario">${listamensagens[i].to}:</div>
                        <div class="texto">${listamensagens[i].text}</div>
                    </div> `    
                }
            }
            if(mensagensRetorno !== null && mensagensAtuais[(Object.keys(mensagensAtuais).length)-1] !== mensagensRetorno[(Object.keys(mensagensRetorno).length)-1]){
                const elementoQueQueroQueApareca = document.querySelector('.ultimo');
                elementoQueQueroQueApareca.scrollIntoView();
            }
        }      
    }
    if(PaginaInicialParaMensagem == false){
        PaginaInicialParaMensagem = true;
        trocarPagina(".paginaInicial",".paginaMensagem");
    }
    mensagensRetorno = listamensagens;
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
      enviarUsuario('.paginaPedirDados','.paginaCarregando');
  }
});

function enviarMensagem(){
    const inputmsg = document.querySelector(".mensagemDigitada");
    const mensagem ={
            from: usuario.name,
            to: "Todos",
            text: inputmsg.value,
            type: "message"
        }
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensagem);
    promessa.then(pegarMensagem);
    inputmsg.value = "";
    promessa.catch(tratarErro);
}

function recarregarMensagem(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(carregarMensagem);
    promessa.catch(tratarErro);
}

function usuariosAtivos(){
    const paginaMensagem = document.querySelector(".classificarMsg")
    paginaMensagem.classList.remove("escondida");

}

function voltarPaginaMsg(){
    const paginaMensagem = document.querySelector(".classificarMsg");
    paginaMensagem.classList.add("escondida");
    textoPlaceHolder(modoVisibilidade, tipoUsuario);
}