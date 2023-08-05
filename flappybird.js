
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 40; //width/height ratio = 408/228 = 17/12
let birdHeight = 34;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImgs = []; //new
let currentBirdImgIndex = 0; //new
let birdFrameChangeRate = 10; //new
let birdFrameChangeCounter = 0; //new

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}
// Ajoutez gameTitle à votre objet de jeu global
let gameTitle = {
    img: new Image(),
    x: boardWidth / 2,
    y: boardHeight / 3,
    velocityX: -2,
};

gameTitle.img.src = './start.png';

let logoWidth = 150;  // changez cette valeur selon la taille désirée
let logoHeight = 75; // changez cette valeur selon la taille désirée

// Ajoutez cette nouvelle fonction pour dessiner le titre du jeu
function drawGameTitle() {
    context.fillStyle = "black";
    context.font = "40px sans-serif";
    context.textAlign = "center";
    context.fillText(gameTitle.text, gameTitle.x, gameTitle.y);
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -4; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load images
    birdImgs[0] = new Image();
    birdImgs[0].src = "./rocky1.png";
    birdImgs[1] = new Image();
    birdImgs[1].src = "./rocky2.png";
    birdImgs[2] = new Image();
    birdImgs[2].src = "./rocky3.png";

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
//    birdImg = new Image();
//    birdImg.src = "./flappybird.png";
//    birdImg.onload = function() {
//        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1100); //every 1.1 seconds
    document.addEventListener("keydown", moveBird);

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Dessinez le titre du jeu si la partie n'a pas encore commencé
    if (!gameOver && score === 0) {
        drawGameTitle();
        gameTitle.x += gameTitle.velocityX;
    }
    function drawGameTitle() {
        context.drawImage(gameTitle.img, gameTitle.x, gameTitle.y, logoWidth, logoHeight);
        // On fait glisser le titre vers la gauche seulement si la partie n'a pas commencé
        if (score === 0 && !gameOver) {
            gameTitle.x += gameTitle.velocityX;
        }
    }
    // Lorsqu'une touche est enfoncée pour commencer le jeu, déplacez le titre du jeu vers la gauche
    function moveBird(e) {
        if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
            //jump
            velocityY = -7;
            gameTitle.velocityX = -4; // Faites glisser le titre vers la gauche

            //reset game
            if (gameOver) {
                bird.y = birdY;
                pipeArray = [];
                score = 0;
                gameOver = false;
                gameTitle.x = boardWidth / 2; // Réinitialiser la position du titre
                gameTitle.velocityX = 0; // Arrêter le mouvement du titre
            }else {
            // If game is not over, move the title
            gameTitle.velocityX = -4;
        }

        }
    }


    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
//     context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    birdFrameChangeCounter++;
    if(birdFrameChangeCounter >= birdFrameChangeRate) {
        currentBirdImgIndex = (currentBirdImgIndex + 1) % birdImgs.length;
        birdFrameChangeCounter = 0;
}
    context.drawImage(birdImgs[currentBirdImgIndex], bird.x, bird.y, bird.width, bird.height);
    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/6;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -7;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

//function detectCollision(a, b) {
//    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
//           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
//           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
//           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
//}
// Avec cette nouvelle fonction
function detectCollision(a, b) {
    let hitboxReduction = 0.08;  // réduction de 7% de la hitbox
    let hitboxWidth = a.width * hitboxReduction;
    let hitboxHeight = a.height * hitboxReduction;

    // ajouter la réduction de la hitbox aux calculs de collision
    return a.x + hitboxWidth < b.x + b.width &&
           a.x + a.width - hitboxWidth > b.x &&
           a.y + hitboxHeight < b.y + b.height &&
           a.y + a.height - hitboxHeight > b.y;
}
