// ==============================
// HZRENDER LIBRARY
// ==============================

const hzrender = (function() {
    
    function Color3(r,g,b){
        return "rgb(" + r + "," + g + "," + b + ")";
    }
    
    class Vector2D {
        constructor(x = 0, y = 0){
            this.x = x;
            this.y = y;
        }
    
        // Přidá jiný vektor k tomuto
        add(v) {
            return new Vector2(this.x + v.x, this.y + v.y);
        }
    
        // Odečte jiný vektor od tohoto
        subtract(v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        }
    
        // Vynásobí vektor skalárem
        multiply(scalar) {
            return new Vector2(this.x * scalar, this.y * scalar);
        }
    
        // Vydělí vektor skalárem
        divide(scalar) {
            return new Vector2(this.x / scalar, this.y / scalar);
        }
    
        // Délka vektoru (magnitude)
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    
        // Normalizuje vektor (délka = 1)
        normalize() {
            const len = this.length();
            if (len === 0) return new Vector2(0, 0);
            return this.divide(len);
        }
    
        // Vypočítá vzdálenost mezi dvěma vektory
        distance(v) {
            return this.subtract(v).length();
        }
    
        // Skalarni součin (dot product)
        dot(v) {
            return this.x * v.x + this.y * v.y;
        }
    
        // Vrátí kopii vektoru
        clone() {
            return new Vector2(this.x, this.y);
        }
    
        // Rotace vektoru o úhel v radiánech
        rotate(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector2(
                this.x * cos - this.y * sin,
                this.x * sin + this.y * cos
            );
        }
        
        toString() {
            return `Vector2(${this.x}, ${this.y})`;
        }
    }
    
    class Vector3D {
        constructor(x = 0, y = 0, z = 0){
            this.x = x;
            this.y = y;
            this.z = z;
        }
    
        // Přidání vektoru
        add(v){
            return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
        }
    
        // Odečtení vektoru
        subtract(v){
            return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
        }
    
        // Násobení skalárem
        multiply(scalar){
            return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
        }
    
        // Dělení skalárem
        divide(scalar){
            return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
        }
    
        // Délka vektoru
        length(){
            return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        }
    
        // Normalizace vektoru (délka = 1)
        normalize(){
            const len = this.length();
            if (len === 0) return new Vector3(0, 0, 0);
            return this.divide(len);
        }
    
        // Vzdálenost mezi dvěma vektory
        distance(v){
            return this.subtract(v).length();
        }
    
        // Skalarni součin
        dot(v){
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }
    
        // Vektorový součin (cross product)
        cross(v){
            return new Vector3(
                this.y * v.z - this.z * v.y,
                this.z * v.x - this.x * v.z,
                this.x * v.y - this.y * v.x
            );
        }
    
        // Vrátí kopii vektoru
        clone(){
            return new Vector3(this.x, this.y, this.z);
        }
    
        // Rotace kolem osy X, Y nebo Z o úhel v radiánech
        rotateX(angle){
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3(
                this.x,
                this.y * cos - this.z * sin,
                this.y * sin + this.z * cos
            );
        }
    
        rotateY(angle){
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3(
                this.x * cos + this.z * sin,
                this.y,
                -this.x * sin + this.z * cos
            );
        }
    
        rotateZ(angle){
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3(
                this.x * cos - this.y * sin,
                this.x * sin + this.y * cos,
                this.z
            );
        }
    
        // Převod na string pro snadné logování
        toString(){
            return `Vector3(${this.x}, ${this.y}, ${this.z})`;
        }
    }


    
    class Scene2D {
        constructor(){
            this.objects = [];
            this.camera = null;
        }
        
        setCamera(camera){
            this.camera = camera;
        }
        
        addObject(object){
            this.objects.push(object);
        }
        
        removeObject(object){
            const index = this.objects.indexOf(object);
            if (index > -1) {
                this.objects.splice(index, 1);
            }
        }
    }
    
    class Camera2D {
        constructor(){
            this.x;
            this.y;
        }
        
    }

    class Screen {
        constructor(){
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.background = "black"
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.position = new Vector2D(0, 0)
            this.fullscreen = true
            this.canvas.width = this.width
            this.canvas.height = this.height
            document.body.appendChild(this.canvas)
        }

        clear(){
            if (self.fullscreen){
                this.canvas.width = window.innerWidth
                this.canvas.height = window.innerHeight
            }
            this.ctx.fillStyle = this.background
            this.ctx.fillRect(0, 0, this.width, this.height)
        }

        draw_rect(x, y, width, height, style){
            this.ctx.fillStyle = style
            this.ctx.fillRect(p0x, p0y, width, height)
        }

        draw_pixel(x, y, p, style){
            this.ctx.fillStyle = style
            this.ctx.fillRect(x, y, p, p)
        }
        
        draw_line(x1, y1, x2, y2, p = 1, style = "#fff") {
            let dx = Math.abs(x2 - x1);
            let dy = Math.abs(y2 - y1);
            let sx = (x1 < x2) ? 1 : -1;
            let sy = (y1 < y2) ? 1 : -1;
            let err = dx - dy;
        
            while (true) {
                this.draw_pixel(x1, y1, p, style);
                if (x1 === x2 && y1 === y2) break;
        
                let e2 = 2 * err;
                if (e2 > -dy) { err -= dy; x1 += sx; }
                if (e2 < dx) { err += dx; y1 += sy; }
            }
        }
        
        digi(n,o,t,e,style){
            const f=[0,0,0,0,0],i=[0,0,0,0,1],
                r=[0,0,0,1,0],c=[0,0,0,1,1],
                d=[0,0,1,0,0],a=[0,0,1,0,1],
                s=[0,0,1,1,0],u=[0,0,1,1,1],
                g=[0,1,0,0,0],h=[0,1,0,0,1],
                p=[0,1,0,1,0],w=[0,1,1,0,0],
                x=[0,1,1,0,1],l=[0,1,1,1,0],
                b=[0,1,1,1,1],j=[1,0,0,0,0],
                k=[1,0,0,0,1],m=[1,0,0,1,0],
                q=[1,0,0,1,1],v=[1,0,1,0,0],
                y=[1,0,1,0,1],z=[1,0,1,1,0],
                A=[1,1,0,0,0],B=[1,1,0,0,1],
                C=[1,1,1,0,0],D=[1,1,1,1,0],
                E=[1,1,1,1,1],G=[1,1,0,1,1],
                H=[1,1,0,1,0],I=[1,1,1,0,1];
                
            let F=[
                [d,p,k,k,E,k,k],[D,h,h,l,h,h,D],
                [l,k,j,j,j,k,l],[D,h,h,h,h,h,D],
                [E,j,j,D,j,j,E],[E,j,j,D,j,j,j],
                [l,k,j,q,k,k,b],[k,k,k,E,k,k,k],
                [l,d,d,d,d,d,l],[u,r,r,r,r,m,w],
                [k,m,v,A,v,m,k],[j,j,j,j,j,j,E],
                [k,G,y,y,k,k,k],[k,k,B,y,q,k,k],
                [l,k,k,k,k,k,l],[D,k,k,D,j,j,j],
                [l,k,k,k,y,m,x],[D,k,k,D,v,m,k],
                [l,k,j,l,i,k,l],[E,d,d,d,d,d,d],
                [k,k,k,k,k,k,l],[k,k,k,k,k,p,d],
                [k,k,k,y,y,y,p],[k,k,p,d,p,k,k],
                [k,k,k,p,d,d,d],[E,i,r,d,g,j,E],
                [f,f,l,i,b,k,b],[j,j,z,B,k,k,D],
                [f,f,l,k,j,k,l],[i,i,x,q,k,k,l],
                [f,f,l,k,E,j,l],[s,h,g,C,g,g,g],
                [f,f,b,k,b,i,l],[j,j,z,B,k,k,k],
                [d,f,d,w,d,d,l],[r,f,s,r,r,m,w],
                [j,j,m,v,A,v,m],[w,d,d,d,d,d,l],
                [f,f,H,y,y,y,y],[f,f,z,B,k,k,k],
                [f,f,l,k,k,k,l],[f,f,D,k,D,j,j],
                [f,f,x,q,b,i,i],[f,f,z,B,j,j,j],
                [f,f,l,j,l,i,D],[g,g,C,g,g,h,s],
                [f,f,k,k,k,q,x],[f,f,k,k,k,p,d],
                [f,f,k,k,y,y,p],[f,f,k,p,d,p,k],
                [f,f,k,k,b,i,l],[f,f,E,r,d,g,E],
                [l,k,q,y,B,k,l],[d,w,d,d,d,d,l],
                [l,k,i,s,g,j,E],[l,k,i,s,i,k,l],
                [r,s,p,m,E,r,r],[E,j,D,i,i,k,l],
                [s,g,j,D,k,k,l],[E,i,r,d,g,g,g],
                [l,k,k,l,k,k,l],[l,k,k,b,i,r,w],
                [f,f,f,f,f,w,w],[f,f,f,f,w,d,g],
                [v,p,a,f,f,f,f],[a,p,v,f,f,f,f],
                [g,d,r,f,f,f,f],[r,d,g,f,f,f,f],
                [p,p,p,f,f,f,f],[d,d,f,f,f,f,f],
                [l,k,i,r,d,f,d],[d,d,d,d,d,f,d],
                [l,k,i,x,y,y,l],[f,f,f,f,f,f,E],
                
                [f,f,d,y,l,y,d],[p,p,E,p,E,p,p],
                [d,b,v,l,a,D,d],[A,B,r,d,g,q,c],
                [w,m,v,g,y,m,x],[r,d,g,g,g,d,r],
                [g,d,r,r,r,d,g],[f,d,d,E,d,d,f],
                [f,f,f,E,f,f,f],[f,f,i,r,d,g,j],
                [f,f,j,g,d,r,i],[f,f,w,w,f,w,w],
                [f,w,w,f,w,d,g],[i,r,d,g,d,r,i],
                [j,g,d,r,d,g,j],[f,f,E,f,E,f,f],
                [l,g,g,g,g,g,l],[l,r,r,r,r,r,l],
                [d,p,k,f,f,f,f],[g,d,r,f,f,f,f],
                [r,d,d,g,d,d,r],[g,d,d,r,d,d,g],
                [d,d,d,d,d,d,d],[f,f,f,x,m,f,f],
                [d,f,d,d,d,d,d],[d,d,E,d,d,f,E],
                [b,q,q,b,c,c,c],[k,k,q,I,j,j,j],
                [f,d,f,E,f,d,f],[g,d,r,d,g,f,E],
                [r,d,g,d,r,f,E],[d,d,d,d,y,l,d],
                [d,l,y,d,d,d,d],[f,d,s,u,s,d,f],
                [f,d,s,E,s,d,f],[f,d,l,E,l,d,f],
                [f,d,w,E,w,d,f],[f,d,w,C,w,d,f]
            ]
            for(let f=0;f<5;f++){
                for(let i=0;i<7;i++){
                    F[t][i][f]&&this.draw_pixel(n+f*e,o+i*e,e,style)
                }
            }
        }
        
        // převod znak -> index do digis
        charToIndex(ch) {
            const code = ch.charCodeAt(0);
        
            // A-Z
            if (code >= 65 && code <= 90) {
                return code - 65; // 0–25
            }
            // a-z
            if (code >= 97 && code <= 122) {
                return 26 + (code - 97); // 26–51
            }
            // 0–9
            if (code >= 48 && code <= 57) {
                return 52 + (code - 48); // 52–61
            }
        
            // speciální znaky – doplň podle pořadí ve svém digis
            const map = {
                ".": 62,
                ",": 63,
                "!": 64,
                "?": 65,
                ":": 66,
                ";": 67,
                "-": 68,
                "_": 73,
                "(": 70,
                ")": 71,
                "[": 72,
                "]": 73,
                "{": 74,
                "}": 75,
                "+": 76,
                "*": 77,
                "/": 78,
                "=": 79,
                "<": 80,
                ">": 81,
                "@": 82,
                "#": 83,
                "$": 84,
                "%": 85,
                "&": 86,
                "\"": 87,
                "'": 88,
                " ": -1  // mezera
            };
            return map[ch] !== undefined ? map[ch] : -1;
        }
        
        // vykreslení stringu
        draw_string(x, y, str, p, style) {
            const spacing = p;  
            let cursorX = x;
        
            for (let i = 0; i < str.length; i++) {
                const idx = this.charToIndex(str[i]);
                if (idx >= 0) {
                    this.digi(cursorX, y, idx, p, style);
                }
                // posun kurzoru – vždy o 5 pixelů + mezera
                cursorX += (5 * p) + spacing;
            }
        }

    }
    
    function print(log){
        console.log(log);
    }
    
    function radToDeg(rad) {
        return rad * (180 / Math.PI);
    }

    // Statická metoda: převod stupňů na radiány
    function degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    return {
        //Camera3D
        //Cube
        //Scene3D
        //render
        //initControls
        //initMobileControls
        //isMobileDevice
        Color3,
        Vector2D,
        Vector3D,
        Screen,
        print
    };
})();