const canvas = document.querySelector('#drawing-canvas')
const ctx = canvas.getContext("2d")
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)

class Circle {
    constructor(_x, _y, _radius, _dx, _dy, _acceleration, _mass) {
        this.x = _x
        this.y = _y
        this.dx = _dx
        this.dy = _dy
        this.radius = _radius
        this.acceleration = _acceleration
        this.mass = _mass
    }
    move() {
        this.x = this.x + this.dx
        this.y = this.y + this.dy
        // if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        //     this.dy = -0.5 * this.dy
        //     if (this.y + this.radius > canvas.height) this.y -= (this.y + this.radius - canvas.height)
        //     else if (this.y - this.radius < 0) this.y -= (this.y - this.radius + 0)
        // }
        // if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        //     this.dx = -1 * this.dx
        //     if (this.x + this.radius > canvas.width) this.x -= (this.x + this.radius - canvas.width)
        //     else if (this.x - this.radius < 0) this.x -= (this.x - this.radius + 0)
        // }
    }
    show() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fillStyle = "darkslategray"
        ctx.fill()
    }
}

function distance(x1, x2, y1, y2) {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}

function getAngle(x1, x2, y1, y2) {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.atan2(dy, dx)
}


const rms = new Circle(80, 150, 20, 0.5, 1.2, 0.1, Math.pow(5.972, 24))
const staticMass = new Circle(canvas.width / 2, canvas.height / 2, 60, 0, 0, 0.1, Math.pow(1.9, 30))
const mouseHandler = {
    mouseIsDown: false,
    mouseStart: {},
    mouseEnd: {},
    mouseCurr: {}
}

window.addEventListener("resize", () => {
    canvas.setAttribute("width", window.innerWidth)
    canvas.setAttribute("height", window.innerHeight)
})
window.addEventListener("mousedown", (e) => {
    mouseHandler.mouseIsDown = true
    mouseHandler.mouseStart = {x: e.clientX, y: e.clientY}
})
window.addEventListener("touchstart", (e) => {
    mouseHandler.mouseIsDown = true
    mouseHandler.mouseStart = {x: e.touches[0].clientX, y: e.touches[0].clientY}
})
window.addEventListener("mouseup", (e) => {
    mouseHandler.mouseIsDown = false
    mouseHandler.mouseEnd = {x: e.clientX, y: e.clientY}
    rms.dx = (mouseHandler.mouseStart.x - e.clientX) / 200
    rms.dy = (mouseHandler.mouseStart.y - e.clientY) / 200
    console.log(mouseHandler.mouseStart.x, e.clientX, rms.dx)
    console.log(mouseHandler.mouseStart.y, e.clientY, rms.dy)
    rms.x = mouseHandler.mouseCurr.x
    rms.y = mouseHandler.mouseCurr.y
})
window.addEventListener("touchend", (e) => {
    mouseHandler.mouseIsDown = false
    mouseHandler.mouseEnd = {x: e.clientX, y: e.clientY}
    rms.dx = (mouseHandler.mouseStart.x - mouseHandler.mouseCurr.x) / 200
    rms.dy = (mouseHandler.mouseStart.y - mouseHandler.mouseCurr.y) / 200
    rms.x = mouseHandler.mouseCurr.x
    rms.y = mouseHandler.mouseCurr.y
})
window.addEventListener("mousemove", (e) => {
    mouseHandler.mouseCurr = {x: e.clientX, y: e.clientY}
})
window.addEventListener("touchmove", (e) => {
    mouseHandler.mouseCurr = {x: e.touches[0].clientX, y: e.touches[0].clientY}
})
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#070113"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (mouseHandler.mouseIsDown) {
        ctx.beginPath()
        ctx.moveTo(mouseHandler.mouseStart.x, mouseHandler.mouseStart.y)
        ctx.lineTo(mouseHandler.mouseCurr.x, mouseHandler.mouseCurr.y)
        ctx.strokeStyle = "white"
        ctx.stroke()
        rms.x = mouseHandler.mouseCurr.x
        rms.y = mouseHandler.mouseCurr.y
    }
    staticMass.show()
    const d = distance(staticMass.x, rms.x, staticMass.y, rms.y)
    const angle = getAngle(staticMass.x, rms.x, staticMass.y, rms.y)
    const F1 = (Math.pow(6.6743, -11)*((rms.mass * staticMass.mass) / Math.pow(d, 2))) * 8000
    const Fy = F1 * Math.sin(angle)
    const Fx = F1 * Math.cos(angle)
    const accX = Fx / rms.mass
    const accY = Fy / rms.mass
    rms.dy = rms.dy - accY
    rms.dx = rms.dx - accX
    rms.move()
    rms.show()
    window.requestAnimationFrame(animate)
}
animate()