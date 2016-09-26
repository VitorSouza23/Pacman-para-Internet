var Cenario = function (){
}
Cenario.vazio = 0;
Cenario.parede = 1;
Cenario.poder = 2;
Cenario.ghost = 3;
Cenario.pacman = 4;
Cenario.ponto = 5;
Cenario.paredeBranca = 6;
//Armazenar cópia do cenário;
Cenario.mapa = null;
//Largura de cada elemento da amtriz
var largura = 27;

var intervalo = 200; //difinir o tempo em que o pacman vai se mover;

//Direções
var Direcao = function(){
}
Direcao.naoDefinida = -1;
Direcao.cima = 0;
Direcao.baixo = 1;
Direcao.esquerda = 2;
Direcao.direita = 3;

//Configurações das teclas
var Teclas = function(){
}
Teclas.cima = 38;
Teclas.baixo = 40;
Teclas.esquerda = 37;
Teclas.direita = 39;
Teclas.A = 65;
Teclas.W = 87;
Teclas.S = 83;
Teclas.D = 68;
Teclas.P = 80;
Teclas.Enter = 13;
Teclas.I = 73;

var Nivel = function(){
}
Nivel.level = 0;
Nivel.vidas = 13;
Nivel.placar = 0;
Nivel.numeroTotalDePontos = 0;