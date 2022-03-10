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
    console.log(vertexShader)
    let program = createProgram(gl, vertexShader, fragmentShader)

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // Look up uniform locations
    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
    let colorLocation = gl.getUniformLocation(program, "u_color")

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
    let size = 2
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset
    )

    let translation = [0, 0] // [x, y]
    let width = 100
    let height = 30
    let color = [Math.random(), Math.random(), Math.random(), 1]


    drawScene()

    function drawScene() {
        resizeCanvasToDisplaySize(gl)
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

        // Update the position buffer and rectangle position
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        setRectangle(gl, translation[0], translation[1], width, height)

        // Set random color
        gl.uniform4fv(colorLocation, color)

        // Draw the rectangle
        let offset = 0
        let count = 6
        gl.drawArrays(gl.TRIANGLES, offset, count)

    }
}
