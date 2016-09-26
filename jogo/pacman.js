var px = -1, py = -1;
var pxi = -1,  pyi = -1;
var ghosts = new Array(); //quantidade de fantasmas dentro do jogo
document.onkeydown = onKD; //Eventos de tecla para método onKD;


var setaCima = false;
var setaBaixo = false;
var setaEsquerda = false;
var setaDireita = false;
var relogio = null;//relógio do tempo de movimento do pacman
var relogioGhosts = null;//relógio do tempo de movimento dos fantasmas

//Recuperando referências dos objetos no documento
var canvas = document.getElementById("tela");
var placar = document.getElementById("placar");
var ctx = canvas.getContext("2d");
var btPausa=document.getElementById("btPausa");
var btNovo=document.getElementById("btNovo");
var btControles=document.getElementById("btControles");
//Sons
var audioPop = document.getElementById("pop");
var efeitoComerPoder = document.getElementById("comerPoder");
var musicaTema = document.getElementById("musicaTema");
musicaTema.loop = true;
var exterminate = document.getElementById("exterminate");
var somDevorarFantasma = document.getElementById("somDevorarFantasma");
var somPacmanMorreu = document.getElementById("somPacmanMorreu");
var somlevelUp = document.getElementById("levelUp");
var somVoceGanhou = document.getElementById("somVoceVenceu");
//Dados do placar
var pontosGanhos=document.getElementById("pontosGanhos");
var vidas=document.getElementById("vidas");
var takeOff = document.getElementById("takeOff");
//Imagens que serão desenhadas
var ponto = new Image();
ponto.onload = desenharTudo;
ponto.src = "icons/ponto.png";

var tards = new Image();
tards.onload = desenharTudo;
tards.src = "icons/tards.png";

var poder = new Image();
poder.onload = desenharTudo;
poder.src = "icons/poder.png";

var parede = new Image();
parede.onload = desenharTudo;
parede.src="icons/parede.png";

var paredeBranca = new Image();
paredeBranca.onload = desenharTudo;
paredeBranca.src="icons/paredeBranca.png";

var imgVoceVenceu = new Image();
imgVoceVenceu.src="icons/voceVenceu.png";

//variável para informar Nível ao Jogador:
var informarNivel = document.getElementById("levels");

//variável contador regresivo de pontos e poder devorados:
var qtdPontosDevorados = 0;


var nx = 0, ny = 0; //Número de colunas e linhas
//pega a referência da mapa original

var gameOverimg = new Image();
gameOverimg.src = "icons/gameOver.png";


function novoJogo(){
    musicaTema.currentTime = 0;
    somVoceGanhou.pause();
    btPausa.disabled = false;
    informarNivel.innerHTML = "Clique em Iniciar!";
    Nivel.vidas = 13;
    Nivel.level = 0;
    ponto.src="icons/ponto.png";
    poder.src="icons/poder.png";
    parede.src="icons/parede.png";
    Nivel.placar = 0;
    setarPlacar();
    ghosts.length = 0;
    var nGhosts = 0; //Define a cor do fantasma
    Cenario.mapa = new Array();
    for(i = 0; i < cenarioCriado.length; i++){
        Cenario.mapa.push(cenarioCriado[i].slice(0));
    }
    nx = Cenario.mapa[0].length; //pega o número de colunas da linha 0
    ny = Cenario.mapa.length; //pega o número de linhas do Array
    //definir o tamanho do canvas em relação ao tamanho do cenário
    canvas.width = nx * largura;
    canvas.height = ny * largura;
    
    //definir função dos botões de pausa em relação a terminar ou iniciar o jogo
    
    for(y = 0; y < ny; y++){//definir a posição inical do pac-man.
        for(x = 0; x < nx; x++){
            if(Cenario.mapa[y][x] == Cenario.pacman){
                px = x;
                py = y;
                pxi = px;
                pyi = py;
            }
            if(Cenario.mapa[y][x] == Cenario.ghost){
                    
                        ghosts.push(new Ghost(x, y, Ghost.imagens[nGhosts++]));

            }
        }
    }
    if(relogioGhosts != null){
        pausar();
        
    }
        btPausa.disable = false;
        btPausa.innerHTML = "Iniciar";
    
    desenharTudo();
    musicaTema.pause();
    
}

function desenharTudo(nivelAtual){
    qtdPontosDevorados = 0;
    //limpar a tela
    ctx.clearRect(0,0, canvas.width, canvas.height); //como queremos limpar totalmente o canvas, começamos a limpar pela altura e lagura 0 e proceguimos para toda a extenção do canvas atraves do tamanho de sua altura e largura.
    //Cenário
    //ctx.fillStyle = "#2727ea";
    for(y = 0; y < ny; y++){//para o y menor q o número de linhas, faça:
        for(x = 0; x < nx; x++){//para o x menor q o número de colunas, faça:
            if(Cenario.mapa[y][x] == Cenario.parede){ //se na posição do mapa do cenário for igual a uma parede:
                //ctx.fillRect(x * largura, y * largura, largura, largura) //construa uma parede (retangulo) que se encontra onde pela multiplicação da posição de x vezes a largura e y vezes a largura, com o tamanho da altura = a largura.
                ctx.drawImage(parede, x*largura, y*largura, largura, largura);
            }else if(Cenario.mapa[y][x] == Cenario.paredeBranca){
                ctx.drawImage(paredeBranca, x*largura, y*largura, largura, largura);
            
            } else if (Cenario.mapa[y][x] == Cenario.ponto){
                ctx.drawImage(ponto, x* largura, y* largura, largura, largura);//construa a imagem do ponto
                //contando quantos pontos o mapa tem.
                qtdPontosDevorados++;
            }else if(Cenario.mapa[y][x] == Cenario.poder){
                ctx.drawImage(poder, x* largura, y* largura, largura, largura);// construir o poder
                qtdPontosDevorados++;
                
        }
            
    }

  }
    //Pacman
    //ctx.fillStyle = "#FFB00F";
    //ctx.beginPath();
    //ctx.arc(px * largura + (largura/2), py * largura + (largura/2), largura/2, Math.PI * 2, false);
    //ctx.closePath();
    //ctx.fill();
    ctx.drawImage(tards, px* largura, py * largura, largura, largura);//construir pacman
    
    //Fantasmas
    for(i = 0; i < ghosts.length; i++){
        ghosts[i].desenhar(ctx);
    }
}

function onKD(evt){
    //alert(evt.keyCode)
    evt.preventDefault();
    
    
    if(relogio != null){
        
        if(evt.keyCode == Teclas.direita || evt.keyCode == Teclas.D){
            setaDireita = true;
            
            
        }
        if(evt.keyCode == Teclas.esquerda || evt.keyCode == Teclas.A){
            setaEsquerda = true;
            
            
        }
        if(evt.keyCode == Teclas.cima || evt.keyCode == Teclas.W){
            setaCima = true;
            
        }
        if(evt.keyCode == Teclas.baixo || evt.keyCode == Teclas.S){
            
            setaBaixo = true;
            
            
        }
    
        if(evt.keyCode == Teclas.Enter){
            novoJogo();
        }
        
    }
    
    if(evt.keyCode == Teclas.Enter){
            novoJogo();
        }
    
    if(evt.keyCode == Teclas.P){
        if(Nivel.vidas > 0 && Nivel.level < 3){
            pausar();
        }
    }
    
   
}

function moverPacman(){
    if(setaDireita){
        setaDireita = false;
        if(Nivel.level == 1){
                if(px - 1 >= 0){
                if(Cenario.mapa[py][px -1] != Cenario.parede){

                    px--;
                }
            }else if(Cenario.mapa[py][nx - 1] != Cenario.parede){
                px = nx - 1;
                takeOff.currentTime = 0;
                takeOff.play();
                
            }
        }else{
            if(px + 1 < nx){
                if(Cenario.mapa[py][px + 1] != Cenario.parede){

                    px++;
                   }
            }else if(Cenario.mapa[py][0] != Cenario.parede){
                px = 0;
                takeOff.currentTime = 0;
                takeOff.play();
            }
        }
    }
    if(setaEsquerda){
        setaEsquerda = false;
        if(Nivel.level == 1){
            if(px + 1 < nx){
                if(Cenario.mapa[py][px + 1] != Cenario.parede){

                    px++;
                   }
            }else if(Cenario.mapa[py][0] != Cenario.parede){
                px = 0;
                takeOff.currentTime = 0;
                takeOff.play();
            }
        }else{
            if(px - 1 >= 0){
                if(Cenario.mapa[py][px -1] != Cenario.parede){

                    px--;
                }
            }else if(Cenario.mapa[py][nx - 1] != Cenario.parede){
                px = nx - 1;
                takeOff.currentTime = 0;
                takeOff.play();
            }
        }
    }
    if(setaCima){
        setaCima = false;
        if(Nivel.level == 1){
                if(py + 1 < ny){
                if(Cenario.mapa[py + 1][px] != Cenario.parede){

                    py++;
                }
            }else if(Cenario.mapa[0][px] != Cenario.parede){
                py = 0;
                takeOff.currentTime = 0;
                takeOff.play();
            }
        }else{
            if(py - 1 >= 0){
                if(Cenario.mapa[py - 1][px] != Cenario.parede){

                    py--;
                }
            }else if(Cenario.mapa[ny - 1][px] != Cenario.parede){
                py = ny - 1;
                takeOff.currentTime = 0;
                takeOff.play();
            }
        }
    }
    if(setaBaixo){
        setaBaixo = false;
        if(Nivel.level == 1){
            if(py - 1 >= 0){
                if(Cenario.mapa[py - 1][px] != Cenario.parede){

                    py--;
                }
            }else if(Cenario.mapa[ny - 1][px] != Cenario.parede){
                py = ny - 1;
                takeOff.currentTime = 0;
                takeOff.play();
            }
        }else{
            if(py + 1 < ny){
                if(Cenario.mapa[py + 1][px] != Cenario.parede){

                    py++;
                }
            }else if(Cenario.mapa[0][px] != Cenario.parede){
                py = 0;
                takeOff.currentTime = 0;
                takeOff.play();
            }
        }
    }

}

function  moverGhosts(){
    for(i = 0; i < ghosts.length; i++){
        ghosts[i].mover();
    }
}

function pausar(){
    if(relogio != null){
        clearInterval(relogio);
        clearInterval(relogioGhosts);
        relogio = null;
        relogioGhosts = null;
        btPausa.innerHTML = "Continuar";
        musicaTema.pause();
    }else{
        relogio = setInterval("atualizarPacman()", intervalo);
        if(Nivel.level == 2){
            relogioGhosts = setInterval("atualizarGhosts()", Math.round(intervalo * 0.5));
        }else{
            relogioGhosts = setInterval("atualizarGhosts()", Math.round(intervalo * 1.2));
        }
        btPausa.innerHTML = "Pausar";
        musicaTema.play();
        
        atualizarNivel();
        if(Nivel.level == 0){
            informarNivel.innerHTML = "Nivel 1: Termine o que começou!";

        }
    }
    
}

function atualizarPacman(){
    moverPacman();
    if(verificarColisoes()){

        gameOver();
    }else if(Nivel.level >= 3){
            fimDoJogo();
        
    }else{
        desenharTudo();
    }
}

function atualizarGhosts() {
    moverGhosts();
    
    if(verificarColisoes()){
        musicaTema.pause();
        
        gameOver();
    }else if(Nivel.level >= 3){
            fimDoJogo();
       
    }else{
        desenharTudo();
    }
}

//Retorna verdadeiro para o caso de Game Over
function verificarColisoes(){
    //Comer ponto?
    if(Cenario.mapa[py][px] == Cenario.ponto){
        Cenario.mapa[py][px] = Cenario.vazio;
        audioPop.currentTime = 0;
        audioPop.play();
        atualizarPlacarPontos();
        atualizarNivel();
        
        //Ponto poder?
    } else if(Cenario.mapa[py][px] == Cenario.poder){
        Cenario.mapa[py][px] = Cenario.vazio;
        efeitoComerPoder.currentTime = 0;
        efeitoComerPoder.play();
        atualizarPlacarPontosBonusPoder();
        atualizarNivel();
        for(i = 0; i < ghosts.length; i++){
            ghosts[i].assustar();
        }
    }//Fim do else if
    //Colisão com Fantasma
    for(i = 0; i < ghosts.length; i++){
        if(px == ghosts[i].x && py == ghosts[i].y){
            if(ghosts[i].assustado == 0){
                
                atualizarPlacarVidas();
                px = pxi;
                py = pyi;
                ghosts[i].devorado();
                somPacmanMorreu.currentTime = 0;
                somPacmanMorreu.play();
                
                if(Nivel.vidas == 0){
                    return true;
                }else{
                    pausar();
                }
                
            }else{
                ghosts[i].devorado();
                atualizarPlacarPontosBonusFantasma();
                somDevorarFantasma.currentTime = 0;
                somDevorarFantasma.play();
                
            }
        }
    }
    return false;
}//Fim da Função

function gameOver(){
    pausar();
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(gameOverimg, 0, 0, canvas.width, canvas.height);
    exterminate.play();
    btPausa.disabled = true;
    btPausa.innerHTML = "Game Over!";
}
function atualizarPlacarPontos(){
    
    Nivel.placar++;
    pontosGanhos.innerHTML = "Placar: " + Nivel.placar; 
}
function atualizarPlacarVidas(){
    Nivel.vidas--;
    if(Nivel.vidas == 13){
        vidas.innerHTML = "Vidas: 12º Doutor";
    }else if(Nivel.vidas == 12){
        vidas.innerHTML = "Vidas: 11º Doutor";
    }else if(Nivel.vidas == 11){
        vidas.innerHTML = "Vidas: 10º Doutor";
    }else if(Nivel.vidas == 10){
        vidas.innerHTML = "Vidas: 9º Doutor";
    }else if(Nivel.vidas == 9){
        vidas.innerHTML = "Vidas: Doutor Guerra";
    }else{
        vidas.innerHTML = "Vidas: " + Nivel.vidas + "º Doutor";
    }
}
function atualizarPlacarPontosBonusPoder(){
    
    Nivel.placar = Nivel.placar + 100;
    pontosGanhos.innerHTML = "Placar: " + Nivel.placar; 
}

function atualizarPlacarPontosBonusFantasma(){
    
    Nivel.placar = Nivel.placar + 300;
    pontosGanhos.innerHTML = "Placar: " + Nivel.placar; 
}

function atualizarNivel(){
    
    if(qtdPontosDevorados == 1){
        Nivel.level++;
        if(Nivel.level < 3){
            somlevelUp.play();
        }
        
        if(Nivel.level == 0){
            informarNivel.innerHTML = "Nivel 1: Termine o que começou!";


        }else if(Nivel.level == 1){
            parede.src="icons/paredeVerde.png";
            poder.src="icons/poder2.png";
            ponto.src="icons/ponto2.png";
            Nivel2(Nivel.vidas, Nivel.placar)
            informarNivel.innerHTML = "Nivel 2: Não confunda direita com esquerda";
            

        }else if(Nivel.level == 2){
            parede.src="icons/paredeVermelha.png";
            poder.src="icons/poder3.png";
            ponto.src="icons/ponto3.png";
            Nivel3(Nivel.vidas, Nivel.placar);
            informarNivel.innerHTML = "Nivel 3: Não pisque!";
        
            
        
        }
        
    }
    
    
}

function Nivel2(vidas, placar){
    Nivel.vidas = vidas;
    Nivel.level = 1;
    Nivel.placar = placar;
    ghosts.length = 0;
    var nGhosts = 0; //Define a cor do fantasma
    Cenario.mapa = new Array();
    for(i = 0; i < cenarioCriado.length; i++){
        Cenario.mapa.push(cenarioCriado[i].slice(0));
    }
    nx = Cenario.mapa[0].length; //pega o número de colunas da linha 0
    ny = Cenario.mapa.length; //pega o número de linhas do Array
    //definir o tamanho do canvas em relação ao tamanho do cenário
    canvas.width = nx * largura;
    canvas.height = ny * largura;
    
    //definir função dos botões de pausa em relação a terminar ou iniciar o jogo
    
    for(y = 0; y < ny; y++){//definir a posição inical do pac-man.
        for(x = 0; x < nx; x++){
            if(Cenario.mapa[y][x] == Cenario.pacman){
                px = x;
                py = y;
                pxi = px;
                pyi = py;
            }
            if(Cenario.mapa[y][x] == Cenario.ghost){
                    
                        ghosts.push(new Ghost(x, y, Ghost.imagensNivel2[nGhosts++]));

            }
        }
    }
    if(relogioGhosts != null){
        pausar();
        
    }
        btPausa.disabled = false;
        btPausa.innerHTML = "Iniciar";
    
    desenharTudo();
    musicaTema.pause();
    
}

function Nivel3(vidas, placar){
    Nivel.vidas = vidas;
    Nivel.level = 2;
    Nivel.placar = placar;
    ghosts.length = 0;
    var nGhosts = 0; //Define a cor do fantasma
    Cenario.mapa = new Array();
    for(i = 0; i < cenarioCriado.length; i++){
        Cenario.mapa.push(cenarioCriado[i].slice(0));
    }
    nx = Cenario.mapa[0].length; //pega o número de colunas da linha 0
    ny = Cenario.mapa.length; //pega o número de linhas do Array
    //definir o tamanho do canvas em relação ao tamanho do cenário
    canvas.width = nx * largura;
    canvas.height = ny * largura;
    
    //definir função dos botões de pausa em relação a terminar ou iniciar o jogo
    
    for(y = 0; y < ny; y++){//definir a posição inical do pac-man.
        for(x = 0; x < nx; x++){
            if(Cenario.mapa[y][x] == Cenario.pacman){
                px = x;
                py = y;
                pxi = px;
                pyi = py;
            }
            if(Cenario.mapa[y][x] == Cenario.ghost){
                    
                        ghosts.push(new Ghost(x, y, Ghost.imagensNivel3[nGhosts++]));

            }
        }
    }
    if(relogioGhosts != null){
        pausar();
        
    }
        btPausa.disable = false;
        btPausa.innerHTML = "Iniciar";
    
    desenharTudo();
    musicaTema.pause();
    
}

function informarControlesDoJogo(){
    alert("Controles do Jogo: \n" +
         "Nvel 1 e 3: \n" +
         "- Movientar para cima: Seta ▲ ou letra W \n" +
         "- Movientar para baixo: Seta ▼ ou letra S \n" +
         "- Movientar para direita: Seta ► ou letra D \n" +
         "- Movientar para esquerda: Seta ◄ ou letra A \n" +
         "Nivel 2: \n" +
         "- Movientar para cima: Seta ▼ ou letra S \n" +
         "- Movientar para baixo: Seta ▲ ou letra W \n" +
         "- Movientar para direita: Seta ◄ ou letra A \n" +
         "- Movientar para esquerda: Seta ► ou letra D. \n" +
         "Iniciar ou pausar o jogo: \n" +
         "- Tecla de atalho: P \n" +
         "Novo jogo: \n" +
         "- Tecla de atalho: Enter");
}

function fimDoJogo(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.drawImage(imgVoceVenceu, 0, 0, canvas.width, canvas.height);
        pausar();
        btPausa.disabled = true;
        btPausa.innerHTML = "Você Venceu!!";
        somVoceGanhou.currentTime = 0;
        somVoceGanhou.play();
    
}
function setarPlacar(){
    pontosGanhos.innerHTML = "Placar: 0";
    vidas.innerHTML = "Vidas: 12º Doutor";
}







//ultima linha sempre!
novoJogo();


