import tkinter as tk

GRID_W = 5   # šířka matice
GRID_H = 7   # výška matice
CELL_SIZE = 40  # velikost buňky (px)

class PixelEditor:
    def __init__(self, root):
        self.root = root
        self.canvas = tk.Canvas(root, width=GRID_W*CELL_SIZE, height=GRID_H*CELL_SIZE, bg="black")
        self.canvas.pack()

        # matice hodnot 0/1
        self.pixels = [[0 for _ in range(GRID_W)] for _ in range(GRID_H)]

        # nakreslení mřížky
        self.rects = []
        for y in range(GRID_H):
            row = []
            for x in range(GRID_W):
                rect = self.canvas.create_rectangle(
                    x*CELL_SIZE, y*CELL_SIZE,
                    (x+1)*CELL_SIZE, (y+1)*CELL_SIZE,
                    outline="gray", fill="black"
                )
                row.append(rect)
            self.rects.append(row)

        self.canvas.bind("<Button-1>", self.toggle_pixel)

        # tlačítko export
        btn = tk.Button(root, text="Export", command=self.export)
        btn.pack(pady=10)

        # výstupní text
        self.output = tk.Text(root, height=10, width=60)
        self.output.pack()

    def toggle_pixel(self, event):
        x = event.x // CELL_SIZE
        y = event.y // CELL_SIZE
        if 0 <= x < GRID_W and 0 <= y < GRID_H:
            self.pixels[y][x] = 1 - self.pixels[y][x]
            color = "white" if self.pixels[y][x] else "black"
            self.canvas.itemconfig(self.rects[y][x], fill=color)

    def export(self):
        js_array = "[\n"
        for row in self.pixels:
            js_array += "    " + str(row) + ",\n"
        js_array += "]"

        self.output.delete("1.0", tk.END)
        self.output.insert(tk.END, js_array)


if __name__ == "__main__":
    root = tk.Tk()
    root.title("Pixel Editor (5x7)")
    app = PixelEditor(root)
    root.mainloop()
