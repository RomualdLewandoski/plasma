import Logger from "../Utils/Logger";
import FormType from "./FormType";

export default class Forms {

    defaultLabel = {
        label: undefined,
        required: false,
        linked: false,
        placeholder: undefined,
        class: [],
        options: undefined,
        choices: {},
        inline_check: false,
        row: 3,
        mapped: true,
        default: undefined
    }

    /**
     *
     * @param {string} formId
     */
    constructor(formId, data = null, templateValues = null) {
        this.formId = formId
        this.inputs = []
        if (templateValues == null) {
            this.templateValues = {}
        } else {
            this.templateValues = templateValues
        }
        this.build()
        if (data == null) {
            this.data = {}
        } else {
            let temp = {}
            let x
            for (x in this.inputs) {
                let input = this.inputs[x]
                if (input.labels.mapped) {
                    temp[input.id] = data[input.id]
                }
            }
            this.data = temp
        }

    }

    /**
     *
     * @param {string} id
     * @param type
     * @param {boolean} required
     */
    add(id, type = FormType.STRING, labels = this.defaultLabel) {
        for (let [key, value] of Object.entries(this.defaultLabel)) {
            let hasKey = key in labels;
            if (hasKey == false) {
                labels[key] = value
            }

        }

        let input = {
            id: id,
            type: type,
            labels: labels,
        }
        this.inputs.push(input)
    }

    /**
     *
     * @returns {[]}
     */
    getInputs() {
        return this.inputs
    }

    /**
     *
     * @returns {boolean}
     */
    validateForm() {
        let x
        var flag = true
        for (x in this.inputs) {
            let input = this.inputs[x]
            if (input.labels.required) {
                let val
                if (input.type != FormType.type.MULTIPLE) {
                    val = $('#' + input.id).val().trim()
                } else {
                    val = $('#' + input.id).val()
                }
                if (!val.length) {
                    flag = false
                    break;
                }
            }
        }
        this.setDatas()
        return flag
    }

    setDatas() {
        let x
        for (x in this.inputs) {
            let input = this.inputs[x]
            switch (input.type) {
                case FormType.type.STRING:
                case FormType.type.PASSWORD:
                case FormType.type.EMAIL:
                    this.data[input.id] = $('#' + input.id).val().trim()
                    break;
                case FormType.type.CHECKED:
                    this.data[input.id] = $('#' + input.id).is(":checked")
                    break;
                case FormType.type.RADIO:
                    this.data[input.id] = $('input[name=' + input.id + ']:checked', '#' + this.formId + '').val()
                    break;
                case FormType.type.SELECT:
                    this.data[input.id] = $('#' + input.id).children("option:selected").val();
                    break;
                case FormType.type.MULTIPLE:
                    let temp = [];
                    $.each($("#" + input.id + " option:selected"), function () {
                        temp.push($(this).val());
                    });
                    this.data[input.id] = temp.join(",")
                    break;
                case FormType.type.TEXT:
                case FormType.type.CKEDITOR:
                    this.data[input.id] = $('#' + input.id).val().trim()
                    break;
                default:

                    break;
            }

        }
    }

    /**
     *
     * @param id
     * @returns {null|string}
     */
    getData(id) {
        /*let x
        for (x in this.inputs) {
            let input = this.inputs[x]
            if (input.id == id) {
                return $('#' + input.id).val().trim()
            }
        }
        return null*/
        return this.data[id]
    }

    handle(method) {
        $("body").delegate("#" + this.formId, "submit", (event) => {
            event.preventDefault()
            method(event, this)
        })
    }

    unhandle() {
        $('body').undelegate("#" + this.formId, "submit")
    }

    /**
     * @abstract
     */
    build() {
        throw new Error('build() must be implemented inside the form');
    }

    getInput(id) {
        let x
        for (x in this.inputs) {
            let input = this.inputs[x]
            if (input.id == id) {
                return input;
            }
        }
        return null;
    }

    draw(id) {
        let input = this.getInput(id)
        if (input == null) {
            Logger.log(Logger.type.SEVERE, "Unable to find input to draw for id " + id)
        } else {
            var template = "";
            let placeholder = "";
            let classes = "";
            let label = "";
            let options = "";
            let value = ""
            let x
            for (x in input.labels.class) {
                let classe = input.labels.class[x]
                classes = classes + classe + " "
            }
            switch (input.type) {
                case FormType.type.STRING:
                case FormType.type.PASSWORD:
                case FormType.type.EMAIL:
                    if (input.labels.placeholder != undefined) {
                        placeholder = `placeholder="${input.labels.placeholder}"`
                    }
                    if (input.labels.label == undefined || input.labels.label != false) {
                        let labelName = input.labels.label == undefined ? input.id : input.labels.label
                        label = `<label for="${input.id}" class="form-label">${labelName}</label>`
                    }
                    if (input.labels.mapped) {
                        value = this.data != null && this.data[input.id] != null ? this.data[input.id] : ""
                    }
                    template = `${label} <input class="form-control form-control-user ${classes} " type="${input.type.toString().toLowerCase()}" id="${input.id}"
                                                    ${placeholder} name="${input.id}" value="${value}">`
                    break;
                case FormType.type.CHECKED:
                    if (input.labels.label == undefined || input.labels.label != false) {
                        let labelName = input.labels.label == undefined ? input.id : input.labels.label
                        label = `<label for="${input.id}" class="form-check-label">${labelName}</label>`
                    }
                    if (input.labels.mapped) {
                        value = this.data[input.id] != null && this.data[input.id] == true ? "checked" : ""
                    }
                    template = `<input type="checkbox" class="form-check-input ${classes}" id="${input.id}" name="${input.id}" ${value}> ${label} `
                    break;
                case FormType.type.RADIO:
                    let i = 0;
                    for (let [key, value] of Object.entries(input.labels.choices)) {
                        i++;
                        let checked = ""
                        let inline = ""
                        if (input.labels.inline_check) {
                            inline = "form-check-inline"
                        }
                        if (input.labels.mapped) {
                            checked = this.data != null && this.data[input.id] != null && this.data[input.id] == key ? "checked" : ""
                        }
                        let radioTemplate = `<div class="form-check ${inline}">
                                                <input class="form-check-input" type="radio" name="${input.id}" id="${input.id}_${i}" value="${key}" ${checked}>
                                                <label class="form-check-label" for="${input.id}_${i}">
                                                    ${value}
                                                </label>
                                            </div>`
                        template = template + radioTemplate
                    }
                    break;
                case FormType.type.SELECT:
                    if (input.labels.default != undefined) {
                        if (!input.labels.mapped) {
                            let tmp = `<option value="" disabled selected>${input.labels.default}</option>`
                            options = options + tmp
                        }
                    }
                    if (input.labels.label == undefined || input.labels.label != false) {
                        let labelName = input.labels.label == undefined ? input.id : input.labels.label
                        label = `<label for="${input.id}" class="form-label">${labelName}</label>`
                    }
                    for (let [key, value] of Object.entries(input.labels.choices)) {
                        let selected = ""
                        if (input.labels.mapped) {
                            selected = this.data != null && this.data[input.id] != null && this.data[input.id] == key ? "selected" : ""
                        }
                        let tmp = `<option value="${key}" ${selected}>${value}</option>`
                        options = options + tmp
                    }
                    template = `${label} <select class="form-select ${classes}" id="${input.id}" name="${input.id}">${options}</select>`
                    break;
                case FormType.type.MULTIPLE: //like us lol
                    if (input.labels.label == undefined || input.labels.label != false) {
                        let labelName = input.labels.label == undefined ? input.id : input.labels.label
                        label = `<label for="${input.id}" class="form-label">${labelName}</label>`
                    }
                    for (let [key, value] of Object.entries(input.labels.choices)) {
                        let selected = ""
                        if (input.labels.mapped) {
                            selected = this.data != null && this.data[input.id] != null && this.data[input.id].includes(key) ? "selected" : ""
                        }
                        let tmp = `<option value="${key}" ${selected}>${value}</option>`
                        options = options + tmp
                    }
                    template = `${label} <select class="form-select ${classes}" multiple id="${input.id}" name="${input.id}">${options}</select>`
                    break;
                case FormType.type.TEXT:
                    if (input.labels.label == undefined || input.labels.label != false) {
                        let labelName = input.labels.label == undefined ? input.id : input.labels.label
                        label = `<label for="${input.id}" class="form-label">${labelName}</label>`
                    }
                    if (input.labels.mapped) {
                        value = this.data != null && this.data[input.id] != null ? this.data[input.id] : ""
                    }
                    let rows = input.labels.row
                    template = `${label} <textarea class="form-control" id="${input.id}" rows="${rows}">${value}</textarea>`
                    break;
                case FormType.type.CKEDITOR:
                    if (input.labels.label == undefined || input.labels.label != false) {
                        let labelName = input.labels.label == undefined ? input.id : input.labels.label
                        label = `<label for="${input.id}" class="form-label">${labelName}</label>`
                    }
                    if (input.labels.mapped) {
                        value = this.data != null && this.data[input.id] != null ? this.data[input.id] : ""
                    }
                    let row_ck = input.labels.row
                    template = `${label} <textarea class="form-control" id="${input.id}" rows="${row_ck}">${value}</textarea>

                    <script src="assets/ckeditor/ckeditor.js"></script>
                    <script>
CKEDITOR.replace( '${input.id}' );
</script>
`
                    break;
                default:
                    console.log("soon, case of TEXT, RADIO, CHECKED, SELECT, MULTIPLE");
            }
            return `<div class="mb-3"> ` + template + `</div>`
        }
    }

    form_start(customClass) {
        return `<form class="${customClass}" id="${this.formId}">`
    }

    form_end() {
        return '</form>'
    }

    fill() {
        let x
        let template = ""
        for (x in this.inputs) {
            let input = this.inputs[x]
            template = template + this.draw(input.id)
        }
        return template
    }


}