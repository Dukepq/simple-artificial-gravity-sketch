const canvas = document.querySelector('#drawing-canvas')
const ctx = canvas.getContext("2d")
const VectorInput = document.querySelector('.vectorInput')
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)

class Circle {
    constructor(_x, _y, _radius, _vx, _vy, _acceleration, _mass) {
        this.x = _x
        this.y = _y
        this.vx = _vx
        this.vy = _vy
        this.radius = _radius
        this.acceleration = _acceleration
        this.mass = _mass
    }
    move() {
        this.x = this.x + this.vx
        this.y = this.y + this.vy
        // if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        //     this.vy = -0.5 * this.vy
        //     if (this.y + this.radius > canvas.height) this.y -= (this.y + this.radius - canvas.height)
        //     else if (this.y - this.radius < 0) this.y -= (this.y - this.radius + 0)
        // }
        // if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        //     this.vx = -1 * this.vx
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
    const vx = x2 - x1
    const vy = y2 - y1
    return Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2))
}

function getAngle(x1, x2, y1, y2) {
    const vx = x2 - x1
    const vy = y2 - y1
    return Math.atan2(vy, vx)
}


const rms = new Circle(80, 150, 20, 0.5, 1.2, 0.1, Math.pow(5.972, 24))
const staticMass = new Circle(canvas.width / 2, canvas.height / 2, 60, 0, 0, 0.1, Math.pow(1.9, 30))
const mouseHandler = {
    mouseIsDown: false,
    mouseStart: {},
    mouseEnd: {},
    mouseCurr: {}
}

let visibleVectors = false
VectorInput.onchange = () => {
    visibleVectors = visibleVectors ? false : true
}

window.addEventListener("resize", () => {
    canvas.setAttribute("width", window.innerWidth)
    canvas.setAttribute("height", window.innerHeight)
})
canvas.addEventListener("mousedown", (e) => {
    mouseHandler.mouseIsDown = true
    mouseHandler.mouseStart = {x: e.clientX, y: e.clientY}
})
canvas.addEventListener("touchstart", (e) => {
    mouseHandler.mouseIsDown = true
    mouseHandler.mouseStart = {x: e.touches[0].clientX, y: e.touches[0].clientY}
})
canvas.addEventListener("mouseup", (e) => {
    mouseHandler.mouseIsDown = false
    mouseHandler.mouseEnd = {x: e.clientX, y: e.clientY}
    rms.vx = (mouseHandler.mouseStart.x - e.clientX) / 200
    rms.vy = (mouseHandler.mouseStart.y - e.clientY) / 200
    rms.x = mouseHandler.mouseCurr.x
    rms.y = mouseHandler.mouseCurr.y
})
canvas.addEventListener("touchend", (e) => {
    mouseHandler.mouseIsDown = false
    mouseHandler.mouseEnd = {x: e.clientX, y: e.clientY}
    rms.vx = (mouseHandler.mouseStart.x - mouseHandler.mouseCurr.x) / 200
    rms.vy = (mouseHandler.mouseStart.y - mouseHandler.mouseCurr.y) / 200
    rms.x = mouseHandler.mouseCurr.x
    rms.y = mouseHandler.mouseCurr.y
})
canvas.addEventListener("mousemove", (e) => {
    mouseHandler.mouseCurr = {x: e.clientX, y: e.clientY}
})
canvas.addEventListener("touchmove", (e) => {
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
    rms.vy = rms.vy - accY
    rms.vx = rms.vx - accX
    rms.move()
    rms.show()
    if (visibleVectors) {
        const scaledForceX = Fx / Math.pow(10, 15)
        const scaledForceY = Fy / Math.pow(10, 15)
        ctx.beginPath()
        ctx.moveTo(rms.x, rms.y)
        ctx.lineTo(rms.x - scaledForceX / 3, rms.y)
        ctx.moveTo(rms.x, rms.y)
        ctx.lineTo(rms.x, rms.y - scaledForceY / 3)
        ctx.strokeStyle = "white"
        ctx.stroke()
    }
    window.requestAnimationFrame(animate)
}
animate()