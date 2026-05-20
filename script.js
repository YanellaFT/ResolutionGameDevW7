const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    dx: 0
};

const items = []
let score = 0;

function drawPlayer() {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(player.x + 15, player.y + 15, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x + 25, player.y + 15, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawItems() {
    items.forEach((item, index) => {
        ctx.fillStyle = "#FF69B4";
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function updatePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function updateItems() {
    items.forEach((item, index) => {
        item.y += item.dy;
        if (
            item.x > player.x &&
            item.x < player.x + player.width &&
            item.y > player.y &&
            item.y < player.y + player.height
        ) {
            items.splice(index, 1);
            score++;
        }
        
        if (item.y > canvas.height) {
            items.splice(index, 1);
        }
    });
}

function createItem() {
    const item = {
        x: Math.random() * (canvas.width - 20),
        y: -20,
        radius: 10,
        dy: Math.random() * 2 + 1
    };
    items.push(item);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updatePlayer();
    updateItems();
    
    drawPlayer();
    drawItems();
    drawScore();
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.dx = -5;
    if (e.key === "ArrowRight") player.dx = 5;
});

document.addEventListener("keyup", () => {
    player.dx = 0;
});

setInterval(createItem, 1000);

gameLoop();