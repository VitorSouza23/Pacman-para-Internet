//Classe Ghost -> define atributos e ações dos fantasmas
var Ghost = function(x, y, imagem){
    //Atributos dinâmicos
    this.listaDirecoes = new Array; //define os possíveis caminhos para os fantasmas
    this.xi = x;//ponto inicial de x
    this.yi = y;//ponto inicial de y
    this.x = x;//posiçãoa tual de x
    this.y = y; //posição atual de y
    this.img = imagem;
    this.direcaoAtual = Direcao.naoDefinida;
    //Número de movimentos restantes como assustado
    this.assustado = 0;
    
    //Métodos dinâmicos:
    this.desenhar = function(ct){
        if(this.assustado == 0){
                ct.drawImage(this.img, this.x*largura, this.y*largura, largura, largura);
           }else{
               if(this.assustado > 10){
                    fantasmaAssustado = new Image();
                    fantasmaAssustado = Ghost.assustados[Nivel.level];
                    ct.drawImage(fantasmaAssustado, this.x*largura, this.y*largura, largura, largura);
               }else{
                   if(this.assustado % 2 == 0){
                       fantasmaAssustado = new Image();
                       fantasmaAssustado = Ghost.assustados[Nivel.level];
                       ct.drawImage(fantasmaAssustado, this.x*largura, this.y*largura, largura, largura);
                   }else{
                       ct.drawImage(this.img, this.x*largura, this.y*largura, largura, largura);
                   }
               }
                
           }
           
        
    };
    this.checarDirecoes= function(){
        //Limpar o array de possíveis direções
        this.listaDirecoes.length = 0;
        if(this.direcaoAtual != Direcao.naoDefinida){
            this.listaDirecoes.push(this.direcaoAtual);
        }
        if(this.direcaoAtual != Direcao.cima && this.direcaoAtual != Direcao.baixo){ //Evita q os fantasma dem o retono e fiquem se movendo no mesmo lugar
            this.listaDirecoes.push(Direcao.cima);
            this.listaDirecoes.push(Direcao.baixo);
        }
        if(this.direcaoAtual != Direcao.esquerda && this.direcaoAtual != Direcao.direita){ //Evita q os fantasma dem o retono e fiquem se movendo no mesmo lugar
            this.listaDirecoes.push(Direcao.esquerda);
            this.listaDirecoes.push(Direcao.direita);
        }
        
        var i = 0;
        while (i < this.listaDirecoes.length){
            var remover = false;
            switch(this.listaDirecoes[i]){
                    case Direcao.cima:
                        if(this.y <= 1){
                            remover = true;
                        }else{
                            if(Cenario.mapa[this.y - 1][this.x] == Cenario.parede){
                                remover  = true;
                            }
                        }
                    break;
                    
                    case Direcao.baixo:
                        if(this.y >= ny - 2){//evita q o fantasma se teletransporte
                            remover = true;
                        }else{
                            if(Cenario.mapa[this.y + 1][this.x] == Cenario.parede){//não deixa ele passar por paredes
                                remover  = true;
                            }
                        }
                    break;
                    
                    case Direcao.esquerda:
                        if(this.x <= 1){
                            remover = true;
                        }else{
                            if(Cenario.mapa[this.y][this.x - 1] == Cenario.parede){
                                remover  = true;
                            }
                        }
                    break;
                    
                    case Direcao.direita:
                        if(this.x >= nx  -2 ){
                            remover = true;
                        }else{
                            if(Cenario.mapa[this.y][this.x + 1] == Cenario.parede){
                                remover  = true;
                            }
                        }
                    break;
            }//Fim do switch
           if(remover){
               this.listaDirecoes.splice(i, 1);
           }else{
               i++;
           }
        }//Fim do while
    
    };// Fim da função checar direções
    
    this.mover = function(){
        if(this.assustado > 0){
            this.assustado--;
        }
        this.checarDirecoes();
        var movimento = Direcao.naoDefinida;
        var aleatorio =  Math.random();
        //Se o primeiro for sorteado ou a lista tiver apenas 1 opção
        if(aleatorio < Ghost.chanceMovimento || this.listaDirecoes.length == 1){
            movimento = this.listaDirecoes[0];
        }else{
            chance = (1 - Ghost.chanceMovimento) / (this.listaDirecoes.length - 1);
            for(ca = 0; ca < this.listaDirecoes.length; ca++){
                if(aleatorio < Ghost.chanceMovimento + (ca * chance)){
                    movimento =  this.listaDirecoes[ca];
                    break;
                }
            }
        }
        this.direcaoAtual = movimento;
        switch(movimento) {
                case Direcao.cima:
                    this.y--;
                    break;
                
                case Direcao.baixo:
                    this.y++;
                    break;
                
                case Direcao.esquerda:
                    this.x--;
                    break;
                
                case Direcao.direita:
                    this.x++;
                    break;
        }
    };//Fim da função mover.
    this.assustar = function(){
        this.assustado = 30;
        switch(this.direcaoAtual){
                case Direcao.cima:
                    this.direcaoAtual =  Direcao.baixo;
                    break;
                
                case Direcao.baixo:
                    this.direcaoAtual = Direcao.cima;
                    break;
                
                case Direcao.esquerda:
                    this.direcaoAtual = Direcao.direita;
                    break;
                
                case Direcao.direita:
                    this.direcaoAtual = Direcao.esquerda;
                    break;
        }
    }
    
    this.devorado = function(){
        this.assustado = 0;
        this.x = this.xi;
        this.y = this.yi;
    }
    
    
    
   
};

/*Ghost.cores = new Array();
Ghost.cores.push("rgba( 85, 238, 85, 0.85)");
Ghost.cores.push("rgba( 85, 238, 238, 0.85)");
Ghost.cores.push("rgba( 238, 238, 85, 0.85)");
Ghost.cores.push("rgba( 238, 85, 85, 0.85)");
Ghost.cores.push("rgba(21, 21, 21, 0.85)");
Ghost.cores.push("rgba( 238, 85, 238, 0.85)");*/

Ghost.imagens = new Array();
img = new Image();
img.src = "icons/dalek1.png";
Ghost.imagens.push(img);
img = new Image();
img.src = "icons/dalek2.png";
Ghost.imagens.push(img);
img = new Image();
img.src = "icons/dalek3.png";
Ghost.imagens.push(img);
img = new Image();
img.src = "icons/dalek4.png";
Ghost.imagens.push(img);

Ghost.imagensNivel2 = new Array();
img2 = new Image();
img2.src = "icons/cybermen1.png";
Ghost.imagensNivel2.push(img2);
img2 = new Image();
img2.src = "icons/cybermen2.png";
Ghost.imagensNivel2.push(img2);
img2 = new Image();
img2.src = "icons/cybermen3.png";
Ghost.imagensNivel2.push(img2);
img2 = new Image();
img2.src = "icons/cybermen4.png";
Ghost.imagensNivel2.push(img2);

Ghost.imagensNivel3 = new Array();
img3 = new Image();
img3.src = "icons/anjoDePedra1.png";
Ghost.imagensNivel3.push(img3);
img3 = new Image();
img3.src = "icons/anjoDePedra2.png";
Ghost.imagensNivel3.push(img3);
img3 = new Image();
img3.src = "icons/anjoDePedra3.png";
Ghost.imagensNivel3.push(img3);
img3 = new Image();
img3.src = "icons/anjoDePedra4.png";
Ghost.imagensNivel3.push(img3);

Ghost.assustados = new Array();
ass = new Image();
ass.src= "icons/dalekBranco.png";
Ghost.assustados.push(ass);
ass = new Image();
ass.src= "icons/cybermenBranco.png";
Ghost.assustados.push(ass);
ass = new Image();
ass.src= "icons/anjoDePedraBranco.png";
Ghost.assustados.push(ass);


Ghost.chanceMovimento = 0.5;