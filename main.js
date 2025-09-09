const { Color3, Screen } = hzrender;

let screen = new Screen();

let textSpace = [""];        // každý řádek jako string
let cursor = {ch: "_", r: 0, l: 0};   // r = řádek, l = pozice v řádku
let txt = "";                 // text pro jednoduché renderování

function Type(char) {
    let line = textSpace[cursor.r];
    textSpace[cursor.r] = line.slice(0, cursor.l) + char + line.slice(cursor.l);
    cursor.l++;
}

function Remove() {
    if (cursor.l > 0) {
        let line = textSpace[cursor.r];
        textSpace[cursor.r] = line.slice(0, cursor.l - 1) + line.slice(cursor.l);
        cursor.l--;
    } else if (cursor.r > 0) {
        let prevLine = textSpace[cursor.r - 1];
        let currentLine = textSpace[cursor.r];
        cursor.l = prevLine.length;
        textSpace[cursor.r - 1] = prevLine + currentLine;
        textSpace.splice(cursor.r, 1);
        cursor.r--;
    }
}

function NewLine() {
    let line = textSpace[cursor.r];
    let newLine = line.slice(cursor.l);
    textSpace[cursor.r] = line.slice(0, cursor.l);
    textSpace.splice(cursor.r + 1, 0, newLine);
    cursor.r++;
    cursor.l = 0;
}

const input = document.getElementById('hiddenInput');
input.focus(); // automaticky focus pro zachytávání kláves

input.addEventListener('keydown', (e) => {
    if (e.key === "Backspace") {
        e.preventDefault();
        Remove();
    } else if (e.key === "Enter") {
        e.preventDefault();
        NewLine();
    }
});

input.addEventListener('input', (e) => {
    for (let char of e.target.value) {
        Type(char);
    }
    e.target.value = '';
});

setInterval(() => {
    if(cursor.ch=="_"){cursor.ch=""}else{cursor.ch="_"};
}, 250);

// --- render ---
function render() {
    input.focus();
    screen.clear();
    
    textSpace.forEach((line, index) => {
        let displayLine = line;
        if (index === cursor.r) {
            displayLine = line.slice(0, cursor.l) + cursor.ch + line.slice(cursor.l); // kurzor
        }
        screen.draw_string(5, 5 + index * 10, displayLine, 1, Color3(255, 255, 255));
    });

    requestAnimationFrame(render);
}

render();

// --- myš ---
let ll = 0, lx=0, ly=0, lx1=0, ly1=0;
screen.canvas.addEventListener('mousemove', function(event) {
    ll = !ll;
    if (ll) {
        lx = event.clientX;
        ly = event.clientY;
    } else {
        lx1 = event.clientX;
        ly1 = event.clientY;
    }
});
