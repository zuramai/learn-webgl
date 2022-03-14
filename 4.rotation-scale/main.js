window.onload = main

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    let canvas = document.querySelector("#canvas");
    let gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    // Create the program by passing the vertex shader and fragment shader
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, document.querySelector("#vertex-shader-2d").text)
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, document.querySelector("#fragment-shader-2d").text)
    let program = createProgram(gl, vertexShader, fragmentShader)

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // Look up uniform locations
    let scaledLocation = gl.getUniformLocation(program, "u_scale")
    let rotationLocation = gl.getUniformLocation(program, "u_rotation")
    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
    let colorLocation = gl.getUniformLocation(program, "u_color")
    let translationLocation = gl.getUniformLocation(program, "u_translation")

    // Create a buffer
    let positionBuffer = gl.createBuffer();

    // Create a vertex array object (attribute state)
    let vao = gl.createVertexArray()

    // Use the vertex array
    gl.bindVertexArray(vao)
    gl.enableVertexAttribArray(positionAttributeLocation)

    // Bind it to ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    let size = 2 // (x, y)
    let type = gl.FLOAT;
    let normalize = false; // leave the values as they are
    let stride = 0; // how many bytes to move to the next vertex
    let offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset
    )

    let translation = [100, 200] // [x, y]
    let rotation = [0, 1]
    let scale = [1, 1]
    let color = [Math.random(), Math.random(), Math.random(), 1]


    // Create controls
    let controls = new Controls("#controls")
    controls.create("x", newVal => {
        translation[0] = Number(newVal) 
        drawScene()
    }, { max: gl.canvas.width })
    controls.create("y", newVal => {
        translation[1] = Number(newVal) 
        drawScene()
    }, { max: gl.canvas.height })
    controls.create("scaleX", newVal => {
        scale[0] = Number(newVal) 
        drawScene()
    }, { max: 2, step: 0.1 })
    controls.create("scaleY", newVal => {
        scale[1] = Number(newVal) 
        drawScene()
    }, { max: 2, step: 0.1 })
    controls.create("rotate", newVal => {
        var angleInRadians = newVal * Math.PI / 180;
        rotation[0] = Math.sin(angleInRadians);
        rotation[1] = Math.cos(angleInRadians);
        drawScene()
    }, { max: 360 })


    setGeometry(gl)
    drawScene()

    function drawScene() {
        resizeCanvasToDisplaySize(gl.canvas)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    
        gl.clearColor(0,0,0,0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
        // Use the program
        gl.useProgram(program)

        // Bind the attribute/buffer
        gl.bindVertexArray(vao)

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

        // Set random color
        gl.uniform4fv(colorLocation, color)

        // Set the translation and rotation
        gl.uniform2fv(translationLocation, translation)
        gl.uniform2fv(rotationLocation, rotation)
        gl.uniform2fv(scaledLocation, scale)

        // Draw the rectangle
        let offset = 0
        let count = 18
        gl.drawArrays(gl.TRIANGLES, offset, count)

    }
}


// Fill the current ARRAY_BUFFER buffer
// with the values that define a letter 'F'.
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,
    
            // top rung
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,
    
            // middle rung
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90]),
        gl.STATIC_DRAW);
    }