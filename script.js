const usuario = {}
let entrandoPrimeiraVez = true;
let PaginaInicialParaMensagem = false;
let modoVisibilidade = "Público";
let tipoUsuario = "Todos";
let mensagensRetorno;
let participantesAtivos=[];

function trocarPagina(paginaAtual, proximaPagina){
    const pagina1 = document.querySelector(paginaAtual);
    const pagina2 = document.querySelector(proximaPagina);

    pagina1.classList.toggle("escondida");
    pagina2.classList.toggle("escondida");
}

function enviarUsuario(paginaAtual, proximaPagina){
    const entrada = document.querySelector(".paginaInicial input");
    const nome = entrada.value;
    usuario.name = nome;
    trocarPagina(paginaAtual, proximaPagina);

    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",usuario);
    promessa.then(pegarMensagem);
    promessa.catch(tratarErro);
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

function verificar(resposta){
    //verificar se chegou mesadem nova
}
function verificarParticipantesAtivos(){
    const online = document.querySelector(".usuarios");
    for(let i=0; i< Object.keys(mensagensRetorno).length; i++){
        if(mensagensRetorno[i].type == 'status'){
            if(i == 0){
                participantesAtivos.push({
                    from: mensagensRetorno[i].from,
                    cont: 1
                });
                console.log(participantesAtivos);
            }
            else{
                let controle=false;
                for(let j=0; j < Object.keys(participantesAtivos).length; j++){
                    if(mensagensRetorno[i].from == participantesAtivos[j].from){
                        participantesAtivos[j].cont = participantesAtivos[j].cont + 1;
                        controle = true;
                    }
                }
                if(controle == false){
                    participantesAtivos.push({
                        from: mensagensRetorno[i].from,
                        cont: 1
                    });
                }
            }
            
        }
    }
    for(let j=0; j < Object.keys(participantesAtivos).length; j++){
        if((participantesAtivos[j].cont) % 2 !== 0){
            online.innerHTML +=`
            <div class="usuario checkUser" onclick="checkUsuario(this)">
                <div class="nomeUsuario">
                    <ion-icon name="people"></ion-icon>
                    <span class="tipoUsuario">${participantesAtivos[j].from}</span>
                </div>
            <ion-icon class="checkUsuario escondida" name="checkmark-sharp"></ion-icon>
            </div>`
        }
    }
    //verificar se chegou mesadem nova
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

   
    usuarioAtivo.classList.remove("checkUser");
    usuarioAtivo.querySelector(".checkUsuario").classList.add("escondida");
    
    opcao.classList.add("checkUser");
    opcao.querySelector(".checkUsuario").classList.remove("escondida");
    tipoUsuario = opcao.querySelector(".tipoUsuario").innerHTML;
    
}

function tratarErro(erro){
    if(erro.response.status == 400){

        trocarPagina(".paginaCarregando", ".paginaPedirDados");
        const nomeUsuario = document.querySelector(".nome");
        nomeUsuario.value = "";
        nomeUsuario.classList.add("nomeIncorreto");
        nomeUsuario.placeholder ="nome de usuario invalido";
    }
    console.log(erro.response);
}


function carregarMensagem(resposta){

    const entrada = document.querySelector(".paginaInicial");
    let listamensagens = resposta.data;
    //let indice = null;
    const paginaMensagem = document.querySelector(".paginaMensagem")
    const mensagens = document.querySelector(".mensagens")
    mensagens.innerHTML="";
    //if(PaginaInicialParaMensagem == true){
        
      //  console("nao sou a primeira")
        // let cont = Object.keys(mensagensRetorno).length-1;
        // for(let i=0; i< Object.keys(listamensagens).length; i++){
        //     console.log("estou no for")
        //     if(listamensagens[i]==mensagensRetorno[cont]){
        //         console.log(listamensagens[i])
        //         indice=i;
        //     }
        // }
    //}
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
            if(i==Object.keys(listamensagens).length-1 ){
                mensagens.innerHTML += `
                <div class ="mensagem entrarSala">
                    <div class="horario">${listamensagens[i].time}</div>
                    <div class="nomeUsuario ultimo">${listamensagens[i].from}</div>
                    <div class="texto">${listamensagens[i].text}</div>
                </div> `    
            }else{
                mensagens.innerHTML += `
                <div class ="mensagem entrarSala">
                    <div class="horario">${listamensagens[i].time}</div>
                    <div class="nomeUsuario">${listamensagens[i].from}</div>
                    <div class="texto">${listamensagens[i].text}</div>
                </div> ` 
            }   
        }else if(listamensagens[i].type == "message"){
            if(i==Object.keys(listamensagens).length-1){
                mensagens.innerHTML += `
                <div class ="mensagem mensagemComum">
                    <div class="horario">${listamensagens[i].time}</div>
                    <div class="nomeUsuario  ultimo">${listamensagens[i].from}</div>
                    <span class="texto2">para</span>
                    <div class="nomeUsuario">${listamensagens[i].to}:</div>
                    <div class="texto">${listamensagens[i].text}</div>
                </div> `
            }else{
                mensagens.innerHTML += `
                <div class ="mensagem mensagemComum">
                    <div class="horario">${listamensagens[i].time}</div>
                    <div class="nomeUsuario">${listamensagens[i].from}</div>
                    <span class="texto2">para</span>
                    <div class="nomeUsuario">${listamensagens[i].to}:</div>
                    <div class="texto">${listamensagens[i].text}</div>
                </div> `

            }
        }else if(listamensagens[i].type =='private_message'){
            if(listamensagens[i].from == usuario.name || listamensagens[i].to == usuario.name){
                if(i==Object.keys(listamensagens).length-1){
                    mensagens.innerHTML += `
                    <div class ="mensagem mensagemReservada">
                        <div class="horario">${listamensagens[i].time}</div>
                        <div class="nomeUsuario ultimo">${listamensagens[i].from}</div>
                        <span class="texto2">para</span>
                        <div class="nomeUsuario">${listamensagens[i].to}:</div>
                        <div class="texto">${listamensagens[i].text}</div>
                    </div> `
                }else{
                    mensagens.innerHTML += `
                    <div class ="mensagem mensagemReservada">
                        <div class="horario">${listamensagens[i].time}</div>
                        <div class="nomeUsuario">${listamensagens[i].from}</div>
                        <span class="texto2">para</span>
                        <div class="nomeUsuario">${listamensagens[i].to}:</div>
                        <div class="texto">${listamensagens[i].text}</div>
                    </div> `
                }    
           }
        }        
    }
    if(PaginaInicialParaMensagem == false){
        PaginaInicialParaMensagem = true;
        trocarPagina(".paginaInicial",".paginaMensagem");
    }
    let mensagemAntiga = mensagensRetorno;
    let mensagemNova = listamensagens;

    if(JSON.stringify(mensagemAntiga) !== JSON.stringify(mensagemNova)){
        const elementoQueQueroQueApareca = document.querySelector('.ultimo');
        console.log(elementoQueQueroQueApareca)
        elementoQueQueroQueApareca.scrollIntoView();
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

function recarregarMensagem(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(carregarMensagem);
    promessa.catch(tratarErro);
}

function usuariosAtivos(){
    const paginaMensagem = document.querySelector(".classificarMsg")
    paginaMensagem.classList.remove("escondida");
    verificarParticipantesAtivos();
    console.log(participantesAtivos)
}

function voltarPaginaMsg(){
    const paginaMensagem = document.querySelector(".classificarMsg");
    paginaMensagem.classList.add("escondida");
    textoPlaceHolder(modoVisibilidade, tipoUsuario);
}