class Controls {
    /**
     * Control a value through input
     * @param {HTMLElement|string} wrapper 
     */
    constructor(wrapper) {
        this.wrapper = typeof wrapper == "string" ? document.querySelector(wrapper) : wrapper
        this.controls = []


        document.body.appendChild(this.wrapper)
    }

    create(name, callback, options) {
        let controlGroup = document.createElement('div')
        
        // The name
        let nameEl = document.createElement('label')
        nameEl.innerText = name

        // The input
        let control = document.createElement("input")
        control.value = 0
        control.type = "range"
        control.max = options.max

        // The value 
        let value = document.createElement('label')
        value.innerText = control.value
        
        control.addEventListener("input", e => {
            callback(control.value)
            value.innerText = control.value
        })

        controlGroup.appendChild(nameEl)
        controlGroup.appendChild(control)
        controlGroup.appendChild(value)
        this.wrapper.appendChild(controlGroup)
        this.controls.push(control)
    }

    render() {

    }
}