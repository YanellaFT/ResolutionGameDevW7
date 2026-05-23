// play again btn does work
// fix home screen
// show loose screen doesnt work
// styel everything

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 580;

let player, flakes, score, misses, gameSpeed, spawnTimer;
let state = "home";

const max_misses = 5;

function initGame() {
    player = {
        x: canvas.width / 2 - 28,
        y: canvas.height - 90,
        width:56,
        height: 70,
        dx: 0
    };
    flakes = [];
    score = 0;
    misses = 0;
    gameSpeed = 1;
    spawnTimer = 0;
}

function drawPlayer(x, y, w, h) {
    const cx = x + w / 2;

    //snowman w/ falling snowflakes --> works!
    ctx.fillStyle = "#4c4c4c";
    ctx.beginPath();
    ctx.ellipse(cx, y + h + 2, w * 0.4, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    //bodies circles bottom
    const r1 = w * 0.28;
    ctx.fillStyle = "#eaf5ff";
    ctx.beginPath();
    ctx.arc(cx, y + h - r1, r1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b8d8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, y + h - r1, r1, 0, Math.PI * 2);
    ctx.stroke();
    // top circle
    const r2 = w * 0.22;
    ctx.fillStyle = "#eaf5ff";
    ctx.beginPath();
    ctx.arc(cx, y + h - r1 * 2 - r2 + 2, r2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b8d8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, y + h - r1 * 2 - r2 + 2, r2, 0, Math.PI * 2);
    ctx.stroke();

    //eyes
    const ypos_eyes = y + h - r1 * 2 - r2 + 2 - r2 * 0.2;
    ctx.fillStyle = '#0b0b0b';
    ctx.beginPath();
    ctx.arc(cx - r2 * 0.35, ypos_eyes, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r2 * 0.35, ypos_eyes, 2, 0, Math.PI * 2);
    ctx.fill();

    // the carrot nose 
    const ypos_nose = y + h -r2 + 2 - r1 * 2 + 1;
    ctx.fillStyle = "#ff8c00";
    ctx.beginPath();
    ctx.moveTo(cx, ypos_nose + 1);
    ctx.lineTo(cx + r2 * 0.5, ypos_nose + 2);
    ctx.lineTo(cx, ypos_nose + 4.5);
    ctx.closePath();
    ctx.fill();

    //stick arms
    const ypos_arms = y + h - r1 * 2 - r2 + 2;
    ctx.strokeStyle = "#8b5e3c";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath(); //left one
    ctx.moveTo(cx - r2, ypos_arms + 15);
    ctx.lineTo(cx - r2 - 10, ypos_arms + r2 *0.3 + 2);
    ctx.stroke();
    ctx.beginPath();//right one
    ctx.moveTo(cx + r2, ypos_arms + 15);
    ctx.lineTo(cx + r2 + 10, ypos_arms + r2 * 0.3 + 2);
    ctx.stroke();

    //hattt
    const ypos_hat = y + h - r1 * 2 - r2 - r2 - 7;
    ctx.fillStyle = '#1a2a3a';
    ctx.fillRect(cx - r2 * 0.7, ypos_hat, r2 * 1.4, r2 * 0.7, 3);
    ctx.fillRect(cx - r2 * 0.9, ypos_hat + r2 * 0.7, r2 * 1.8, 5);
    ctx.fillStyle = '#b1f74f';
    ctx.fillRect(cx - r2 * 0.7, ypos_hat + r2 * 0.5, r2 * 1.4, 3);    



    // ctx.fillStyle = "#FFD700";
    // ctx.fillRect(player.x, player.y, player.width, player.height);
    // ctx.fillStyle = "#000";
    // ctx.beginPath();
    // ctx.arc(player.x + 15, player.y + 15, 3, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.arc(player.x + 25, player.y + 15, 3, 0, Math.PI * 2);
    // ctx.fill();
}

function makeSnowflake() {
    const speed = (1 + Math.random() * 1.2) * gameSpeed;

    return {
        x: 20 + Math.random() * (canvas.width - 40),
        y: -15,
        r: 7 + Math.random() * 4,
        dy: speed,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.06
    };
}

function drawSnowflake(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rotation);
    
    ctx.strokeStyle = "#c7ddeb"
    ctx.lineWidth = 1.8;

    for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate(i * Math.PI / 3)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, f.r);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, f.r * 0.5);
        ctx.lineTo(f.r * 0.3, f.r * 0.75);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, f.r * 0.5);
        ctx.lineTo(-f.r * 0.3, f.r * 0.75);
        ctx.stroke();
        ctx.restore();

    }
    ctx.restore();

    //def not done



    // items.forEach((item, index) => {
    //     ctx.fillStyle = "#FF69B4";
    //     ctx.beginPath();
    //     ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
    //     ctx.fill();
    // });
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    for (let i = 0; i < max_misses; i++) {
        ctx.fillStyle = i < (max_misses - misses) ? "#ef3737" : "rgb(0, 0, 0)";
        ctx.fillText("X", canvas.width - 25 - i * 20, 30) //change to heart pic later
    }
}

// function updatePlayer() {
//     player.x += player.dx;
//     if (player.x < 0) player.x = 0;
//     if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
// }

function updateGame() {
    player.x += player.dx;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    gameSpeed = 1+ score * 0.045;

    spawnTimer++;
    const spawnRate = Math.max(28, 70 - score * 1.5);
    if (spawnTimer >= spawnRate) {
        flakes.push(makeSnowflake());
        spawnTimer = 0;
    }

    for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i];
        f.y += f.dy;
        f.rotation += f.spin;

        if (
            f.x > player.x - f.r &&
            f.x < player.x + player.width + f.r &&
            f.y > player.y &&
            f.y < player.y + 20
        ) {
            flakes.splice(i, 1);
            score++;
            continue;
        }

        if (f.y > canvas.height + 10) {
            flakes.splice(i, 1);
            misses++;
        }
    }

    if (misses >= max_misses) {
        showLose();
    };

    // items.forEach((item, index) => {
    //     item.y += item.dy;
    //     if (
    //         item.x > player.x &&
    //         item.x < player.x + player.width &&
    //         item.y > player.y &&
    //         item.y < player.y + player.height
    //     ) {
    //         items.splice(index, 1);
    //         score++;
    //     }
        
    //     if (item.y > canvas.height) {
    //         items.splice(index, 1);
    //     }
    // });
}

// function createItem() {
//     const item = {
//         x: Math.random() * (canvas.width - 20),
//         y: -20,
//         radius: 10,
//         dy: Math.random() * 2 + 1
//     };
//     // items.push(item);
// }

function gameLoop() {
if (state !== "playing") {
    requestAnimationFrame(gameLoop);
    return;
}

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // updatePlayer();
    // updateItems();
    
    // drawPlayer(player.x, player.y, player.width, player.height);
    // drawItems();
    // drawScore();

    flakes.forEach(drawSnowflake);
    drawPlayer(player.x, player.y, player.width, player.height);
    updateGame();
    drawScore();

    requestAnimationFrame(gameLoop);
    
}

function showLose() {
    state = "lose";
    document.getElementById("final_score").textContent = score;


}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") player.dx = -5;
    if (e.key === "ArrowRight" || e.key === "d") player.dx = 5;
});

document.addEventListener("keyup", () => {
    player.dx = 0;
});


// setInterval(makeSn, 1000);

document.getElementById("play_btn").onclick = () => {
    document.getElementById("home_screen").style.display = "none";
    state = "playing";
    initGame();
};

document.getElementById("replay_btn").onclick = () => {
    document.getElementById("lose_screen").style.display = "none";
    state = "playing";
    initGame();
};


gameLoop();