const hzr = hzrender

let vec = new hzr.Vector3D(1,2,5)
hzr.print(vec.toString())

let Screen = new hzr.Screen()
Screen.clear()
Screen.digi(50,50,0,5,"green")
