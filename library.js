// ==============================
// HZRENDER LIBRARY
// ==============================

const hzrender = (function () {

    function Color3(r, g, b) {
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    class Vector2D {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        // Přidá jiný vektor k tomuto
        add(v) {
            return new Vector2D(this.x + v.x, this.y + v.y);
        }

        // Odečte jiný vektor od tohoto
        subtract(v) {
            return new Vector2D(this.x - v.x, this.y - v.y);
        }

        // Vynásobí vektor skalárem
        multiply(scalar) {
            return new Vector2D(this.x * scalar, this.y * scalar);
        }

        // Vydělí vektor skalárem
        divide(scalar) {
            return new Vector2D(this.x / scalar, this.y / scalar);
        }

        // Délka vektoru (magnitude)
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        // Normalizuje vektor (délka = 1)
        normalize() {
            const len = this.length();
            if (len === 0) return new Vector2D(0, 0);
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
            return new Vector2D(this.x, this.y);
        }

        // Rotace vektoru o úhel v radiánech
        rotate(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector2D(
                this.x * cos - this.y * sin,
                this.x * sin + this.y * cos
            );
        }

        toString() {
            return `Vector2D(${this.x}, ${this.y})`;
        }
    }

    class Vector3D {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        add(v) {
            return new Vector3D(this.x + v.x, this.y + v.y, this.z + v.z);
        }

        subtract(v) {
            return new Vector3D(this.x - v.x, this.y - v.y, this.z - v.z);
        }

        multiply(scalar) {
            return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
        }

        // Dělení skalárem
        divide(scalar) {
            return new Vector3D(this.x / scalar, this.y / scalar, this.z / scalar);
        }

        length() {
            return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        }

        normalize() {
            const len = this.length();
            if (len === 0) return new Vector3D(0, 0, 0);
            return this.divide(len);
        }

        distance(v) {
            return this.subtract(v).length();
        }

        dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }

        cross(v) {
            return new Vector3D(
                this.y * v.z - this.z * v.y,
                this.z * v.x - this.x * v.z,
                this.x * v.y - this.y * v.x
            );
        }

        clone() {
            return new Vector3D(this.x, this.y, this.z);
        }

        rotateX(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3D(
                this.x,
                this.y * cos - this.z * sin,
                this.y * sin + this.z * cos
            );
        }

        rotateY(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3D(
                this.x * cos + this.z * sin,
                this.y,
                -this.x * sin + this.z * cos
            );
        }

        rotateZ(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3D(
                this.x * cos - this.y * sin,
                this.x * sin + this.y * cos,
                this.z
            );
        }

        toString() {
            return `Vector3D(${this.x}, ${this.y}, ${this.z})`;
        }
    }

    class Camera2D {
        constructor(x = 0, y = 0, zoom = 1) {
            this.position = new Vector2D(x, y);
            this.zoom = zoom;

            this.targetPosition = this.position.clone();
            this.targetZoom = zoom;

            this.smoothness = 0.1; // čím menší, tím pomalejší dojezd
        }

        move(dx, dy) {
            this.targetPosition.x += dx;
            this.targetPosition.y += dy;
        }

        setZoom(z) {
            this.targetZoom = Math.max(0.1, z); // ochrana proti zápornému zoomu
        }

        update() {
            // plynulé dorovnání pozice a zoomu
            this.position.x += (this.targetPosition.x - this.position.x) * this.smoothness;
            this.position.y += (this.targetPosition.y - this.position.y) * this.smoothness;
            this.zoom += (this.targetZoom - this.zoom) * this.smoothness;
        }
    }

    class Camera2DController {
        constructor(scene, screen, zoomOnMouse = true) {
            this.scene = scene;
            this.screen = screen;
            this.zoomOnMouse = zoomOnMouse;

            this.keys = {};

            // Eventy pro WASD
            document.addEventListener("keydown", e => this.keys[e.key] = true);
            document.addEventListener("keyup", e => this.keys[e.key] = false);

            // Event pro kolečko myši
            document.addEventListener("wheel", e => this.handleWheel(e));

            this.lastTime = performance.now();
            requestAnimationFrame(this.update.bind(this));
        }

        handleWheel(e) {
            const cam = this.scene.camera;
            const rect = this.screen.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let worldX, worldY;

            if (this.zoomOnMouse) {
                worldX = cam.position.x + (mouseX - this.screen.canvas.width / 2) / cam.zoom;
                worldY = cam.position.y + (mouseY - this.screen.canvas.height / 2) / cam.zoom;
            } else {
                worldX = cam.position.x;
                worldY = cam.position.y;
            }

            const zoomFactor = 1.1;
            if (e.deltaY < 0) cam.targetZoom *= zoomFactor;
            else cam.targetZoom /= zoomFactor;

            cam.targetPosition.x = worldX - (mouseX - this.screen.canvas.width / 2) / cam.targetZoom;
            cam.targetPosition.y = worldY - (mouseY - this.screen.canvas.height / 2) / cam.targetZoom;
        }

        update(timestamp) {
            const deltaTime = timestamp - this.lastTime;
            this.lastTime = timestamp;

            const cam = this.scene.camera;
            const speed = 0.5 * deltaTime;

            if (this.keys["w"]) cam.move(0, -speed);
            if (this.keys["s"]) cam.move(0, speed);
            if (this.keys["a"]) cam.move(-speed, 0);
            if (this.keys["d"]) cam.move(speed, 0);

            requestAnimationFrame(this.update.bind(this));
        }
    }


    function loadKeyframesFromTilemap(image, tileWidth, tileHeight, frameCount, row = 0) {
        let frames = [];
        for (let i = 0; i < frameCount; i++) {
            frames.push(new Texture2D(image, tileWidth, tileHeight, i, row));
        }
        return frames;
    }


    class Animation2D {
        constructor(frames = [], frameDuration = 100, looped = true) {
            this.frames = frames;            // pole Texture2D
            this.frameDuration = frameDuration;
            this.looped = looped;
            this.frameCount = frames.length;
            this.actual_frame = 0;
            this.elapsedTime = 0;
            this.isPlaying = true;
        }

        update(deltaTime) {
            if (!this.isPlaying || this.frameCount === 0) return;

            this.elapsedTime += deltaTime;
            if (this.elapsedTime >= this.frameDuration) {
                this.elapsedTime = 0;
                this.actual_frame++;

                if (this.actual_frame >= this.frameCount) {
                    if (this.looped) {
                        this.actual_frame = 0;
                    } else {
                        this.isPlaying = false;
                        this.actual_frame = this.frameCount - 1;
                    }
                }
            }
        }

        draw(ctx, x, y) {
            if (this.frames[this.actual_frame]) {
                this.frames[this.actual_frame].draw(ctx, x, y);
            }
        }
    }




    class Sprite2D {
        constructor(position) {
            this.id = Math.floor(Math.random() * 99999999999999999);
            this.position = position;
            this.animations = {};
            this.current_animation = null;
        }

        add_animation(name, animation) {
            this.animations[name] = animation;
        }

        play_animation(name) {
            if (this.animations[name]) {
                this.current_animation = this.animations[name];
                this.current_animation.isPlaying = true;
                this.current_animation.actual_frame = 0;
                this.current_animation.elapsedTime = 0;
            }
        }

        pause_animation() {
            if (this.current_animation) {
                this.current_animation.isPlaying = false;
            }
        }

        stop_animation() {
            if (this.current_animation) {
                this.current_animation.isPlaying = false;
                this.current_animation.actual_frame = 0;
            }
        }

        draw(ctx, deltaTime) {
            if (this.current_animation) {
                this.current_animation.update(deltaTime);
                this.current_animation.draw(ctx, this.position.x, this.position.y);
            }
        }
    }



    class Texture2D {
        constructor(image, tileWidth = null, tileHeight = null, tileX = 0, tileY = 0) {
            this.image = image;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.tileX = tileX;
            this.tileY = tileY;
        }

        draw(ctx, x, y) {
            if (this.tileWidth && this.tileHeight) {
                ctx.drawImage(
                    this.image,
                    this.tileX * this.tileWidth,  // zdroj X
                    this.tileY * this.tileHeight, // zdroj Y
                    this.tileWidth,
                    this.tileHeight,
                    x, y,
                    this.tileWidth,
                    this.tileHeight
                );
            } else {
                ctx.drawImage(this.image, x, y);
            }
        }
    }


    class Scene2D {
        constructor() {
            this.sprites = [];
            this.camera = new Camera2D(0, 0, 1); // každá scéna má kameru
        }

        add_sprite(sprt) {
            this.sprites.push(sprt);
        }

        remove_sprite(sprt) {
            this.sprites = this.sprites.filter(s => s.id !== sprt.id);
        }

        update(deltaTime) {
            for (let sprt of this.sprites) {
                if (sprt.current_animation) {
                    sprt.current_animation.update(deltaTime);
                }
            }
        }

        draw(ctx, deltaTime, canvas) {   // přidáme canvas jako parametr
            ctx.save();
            this.camera.update();

            ctx.translate(
                canvas.width / 2 - this.camera.position.x * this.camera.zoom,
                canvas.height / 2 - this.camera.position.y * this.camera.zoom
            );

            ctx.scale(this.camera.zoom, this.camera.zoom);

            for (let sprt of this.sprites) {
                sprt.draw(ctx, deltaTime);
            }

            ctx.restore();
        }

    }


    class Screen {
        constructor() {
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.background = "black";
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.position = new Vector2D(0, 0);
            this.fullscreen = true;
            this.scenes = [];
            this.current_scene = null;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
            document.body.appendChild(this.canvas);
        };

        render(deltaTime) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let scene of this.scenes) {
                scene.draw(this.ctx, deltaTime, this.canvas);  // předáme canvas
            }
        }




        add_scene(scene) {
            this.scenes.push(scene);
        };

        remove_scene(scene) {
            for (scn in this.scenes) {
                if (scn == scene) {
                    this.scenes.pop(scn);
                };
            };
        };

        clear() {
            if (this.fullscreen) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
            this.ctx.fillStyle = this.background;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }


        draw_rect(x, y, width, height, style) {
            this.ctx.fillStyle = style;
            this.ctx.fillRect(p0x, p0y, width, height);
        };

        draw_pixel(x, y, p, style) {
            this.ctx.fillStyle = style;
            this.ctx.fillRect(x, y, p, p);
        };

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
                if (e2 > -dy) { err -= dy; x1 += sx; };
                if (e2 < dx) { err += dx; y1 += sy; };
            };
        };

        digit(n, o, t, e, style) {
            const f = [0, 0, 0, 0, 0], i = [0, 0, 0, 0, 1],
                  r = [0, 0, 0, 1, 0], c = [0, 0, 0, 1, 1],
                  d = [0, 0, 1, 0, 0], a = [0, 0, 1, 0, 1],
                  s = [0, 0, 1, 1, 0], u = [0, 0, 1, 1, 1],
                  g = [0, 1, 0, 0, 0], h = [0, 1, 0, 0, 1],
                  p = [0, 1, 0, 1, 0], w = [0, 1, 1, 0, 0],
                  x = [0, 1, 1, 0, 1], l = [0, 1, 1, 1, 0],
                  b = [0, 1, 1, 1, 1], j = [1, 0, 0, 0, 0],
                  k = [1, 0, 0, 0, 1], m = [1, 0, 0, 1, 0],
                  q = [1, 0, 0, 1, 1], v = [1, 0, 1, 0, 0],
                  y = [1, 0, 1, 0, 1], z = [1, 0, 1, 1, 0],
                  A = [1, 1, 0, 0, 0], B = [1, 1, 0, 0, 1],
                  C = [1, 1, 1, 0, 0], D = [1, 1, 1, 1, 0],
                  E = [1, 1, 1, 1, 1], G = [1, 1, 0, 1, 1],
                  H = [1, 1, 0, 1, 0], I = [1, 1, 1, 0, 1];

            let F = [
                [d, p, k, k, E, k, k], [D, h, h, l, h, h, D], [l, k, j, j, j, k, l], [D, h, h, h, h, h, D],
                [E, j, j, D, j, j, E], [E, j, j, D, j, j, j], [l, k, j, q, k, k, b], [k, k, k, E, k, k, k],
                [l, d, d, d, d, d, l], [u, r, r, r, r, m, w], [k, m, v, A, v, m, k], [j, j, j, j, j, j, E],
                [k, G, y, y, k, k, k], [k, k, B, y, q, k, k], [l, k, k, k, k, k, l], [D, k, k, D, j, j, j],
                [l, k, k, k, y, m, x], [D, k, k, D, v, m, k], [l, k, j, l, i, k, l], [E, d, d, d, d, d, d],
                [k, k, k, k, k, k, l], [k, k, k, k, k, p, d], [k, k, k, y, y, y, p], [k, k, p, d, p, k, k],
                [k, k, k, p, d, d, d], [E, i, r, d, g, j, E], [f, f, l, i, b, k, b], [j, j, z, B, k, k, D],
                [f, f, l, k, j, k, l], [i, i, x, q, k, k, l], [f, f, l, k, E, j, l], [s, h, g, C, g, g, g],
                [f, f, b, k, b, i, l], [j, j, z, B, k, k, k], [d, f, d, w, d, d, l], [r, f, s, r, r, m, w],
                [j, j, m, v, A, v, m], [w, d, d, d, d, d, l], [f, f, H, y, y, y, y], [f, f, z, B, k, k, k],
                [f, f, l, k, k, k, l], [f, f, D, k, D, j, j], [f, f, x, q, b, i, i], [f, f, z, B, j, j, j],
                [f, f, l, j, l, i, D], [g, g, C, g, g, h, s], [f, f, k, k, k, q, x], [f, f, k, k, k, p, d],
                [f, f, k, k, y, y, p], [f, f, k, p, d, p, k], [f, f, k, k, b, i, l], [f, f, E, r, d, g, E],
                [l, k, q, y, B, k, l], [d, w, d, d, d, d, l], [l, k, i, s, g, j, E], [l, k, i, s, i, k, l],
                [r, s, p, m, E, r, r], [E, j, D, i, i, k, l], [s, g, j, D, k, k, l], [E, i, r, d, g, g, g],
                [l, k, k, l, k, k, l], [l, k, k, b, i, r, w], [f, f, f, f, f, w, w], [f, f, f, f, w, d, g],
                [v, p, a, f, f, f, f], [a, p, v, f, f, f, f], [g, d, r, f, f, f, f], [r, d, g, f, f, f, f],
                [p, p, p, f, f, f, f], [d, d, f, f, f, f, f], [l, k, i, r, d, f, d], [d, d, d, d, d, f, d],
                [l, k, i, x, y, y, l], [f, f, f, f, f, f, E], [f, f, d, y, l, y, d], [p, p, E, p, E, p, p],
                [d, b, v, l, a, D, d], [A, B, r, d, g, q, c], [w, m, v, g, y, m, x], [r, d, g, g, g, d, r],
                [g, d, r, r, r, d, g], [f, d, d, E, d, d, f], [f, f, f, E, f, f, f], [f, f, i, r, d, g, j],
                [f, f, j, g, d, r, i], [f, f, w, w, f, w, w], [f, w, w, f, w, d, g], [i, r, d, g, d, r, i],
                [j, g, d, r, d, g, j], [f, f, E, f, E, f, f], [l, g, g, g, g, g, l], [l, r, r, r, r, r, l],
                [d, p, k, f, f, f, f], [g, d, r, f, f, f, f], [r, d, d, g, d, d, r], [g, d, d, r, d, d, g],
                [d, d, d, d, d, d, d], [f, f, f, x, m, f, f], [d, f, d, d, d, d, d], [d, d, E, d, d, f, E],
                [b, q, q, b, c, c, c], [k, k, q, I, j, j, j], [f, d, f, E, f, d, f], [g, d, r, d, g, f, E],
                [r, d, g, d, r, f, E], [d, d, d, d, y, l, d], [d, l, y, d, d, d, d], [f, d, s, u, s, d, f],
                [f, d, s, E, s, d, f], [f, d, l, E, l, d, f], [f, d, w, E, w, d, f], [f, d, w, C, w, d, f]
            ]
            for (let f = 0; f < 5; f++) {
                for (let i = 0; i < 7; i++) {
                    F[t][i][f] && this.draw_pixel(n + f * e, o + i * e, e, style)
                }
            }
        }

        charToIndex(ch) {
            const code = ch.charCodeAt(0);

            // A-Z
            if (code >= 65 && code <= 90) {
                return code - 65; // 0–25
            }
            // a-z
            if (code >= 97 && code <= 122) {
                return 26 + (code - 97);
            }
            // 0–9
            if (code >= 48 && code <= 57) {
                return 52 + (code - 48);
            }

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
                " ": -1
            };
            return map[ch] !== undefined ? map[ch] : -1;
        }

        draw_string(x, y, str, p, style) {
            const spacing = p;
            let cursorX = x;

            for (let i = 0; i < str.length; i++) {
                const idx = this.charToIndex(str[i]);
                if (idx >= 0) {
                    this.digit(cursorX, y, idx, p, style);
                }
                cursorX += (5 * p) + spacing;
            }
        }

    }

    function print(log) {
        console.log(log);
    }

    function radToDeg(rad) {
        return rad * (180 / Math.PI);
    }

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
        Scene2D,
        Sprite2D,
        Texture2D,
        Animation2D,
        Camera2D,
        Camera2DController,
        loadKeyframesFromTilemap,
        Color3,
        print
    };
})();