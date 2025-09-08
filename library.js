// ==============================
// HZRENDER LIBRARY
// ==============================

const hzrender = (function() {
    
    class Vector2D {
        constructor(x = 0, y = 0) {
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
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    
        // Přidání vektoru
        add(v) {
            return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
        }
    
        // Odečtení vektoru
        subtract(v) {
            return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
        }
    
        // Násobení skalárem
        multiply(scalar) {
            return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
        }
    
        // Dělení skalárem
        divide(scalar) {
            return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
        }
    
        // Délka vektoru
        length() {
            return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        }
    
        // Normalizace vektoru (délka = 1)
        normalize() {
            const len = this.length();
            if (len === 0) return new Vector3(0, 0, 0);
            return this.divide(len);
        }
    
        // Vzdálenost mezi dvěma vektory
        distance(v) {
            return this.subtract(v).length();
        }
    
        // Skalarni součin
        dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }
    
        // Vektorový součin (cross product)
        cross(v) {
            return new Vector3(
                this.y * v.z - this.z * v.y,
                this.z * v.x - this.x * v.z,
                this.x * v.y - this.y * v.x
            );
        }
    
        // Vrátí kopii vektoru
        clone() {
            return new Vector3(this.x, this.y, this.z);
        }
    
        // Rotace kolem osy X, Y nebo Z o úhel v radiánech
        rotateX(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3(
                this.x,
                this.y * cos - this.z * sin,
                this.y * sin + this.z * cos
            );
        }
    
        rotateY(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3(
                this.x * cos + this.z * sin,
                this.y,
                -this.x * sin + this.z * cos
            );
        }
    
        rotateZ(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3(
                this.x * cos - this.y * sin,
                this.x * sin + this.y * cos,
                this.z
            );
        }
    
        // Převod na string pro snadné logování
        toString() {
            return `Vector3(${this.x}, ${this.y}, ${this.z})`;
        }
    }


    
    class Scene2D {
        constructor() {
            this.objects = [];
            this.camera = null;
        }
        
        setCamera(camera) {
            this.camera = camera;
        }
        
        addObject(object) {
            this.objects.push(object);
        }
        
        removeObject(object) {
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
            this.canvas.width = this.width
            this.canvas.height = this.height
            document.body.appendChild(this.canvas)
        }

        clear() {
            this.ctx.fillStyle = this.background
            this.ctx.fillRect(0, 0, this.width, this.height)
        }

        draw_rect(x, y, width, height, style) {
            this.ctx.fillStyle = style
            this.ctx.fillRect(p0x, p0y, width, height)
        }

        draw_pixel(x, y, p, style) {
            this.ctx.fillStyle = style
            this.ctx.fillRect(x, y, p, p)
        }

        
        digi(x, y, n, p, style) { 
            let digis = [ 
                [
                    [0, 0, 1, 0, 0],
                    [0, 1, 0, 1, 0],
                    [1, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1],
                    [1, 0, 0, 0, 1],
                    [1, 0, 0, 0, 1],
                ]
            ]; 
            for (let nx = 0; nx < 5; nx++) { 
                for (let ny = 0; ny < 7; ny++) { 
                    if (digis[n][ny][nx]) { 
                        this.draw_pixel(x + nx * p, y + ny * p, p, style); 
                    } 
                } 
            } 
        }
    };
    
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
        Vector2D,
        Vector3D,
        Screen,
        print
    };
})();