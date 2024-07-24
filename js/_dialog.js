
// Keydown event to handle the ESC key
$(document).keydown(function (event) {
    if (event.key === 'Escape') {
        // Stop event here
        event.preventDefault();
        event.stopPropagation()

        $('dialog[open]').closeModal()
    }
});

$.fn.closeModal = function () {
    dialog = $(this);

    let animationDurationString = dialog.css('--modal-animation-duration')
    let animationDurationMs = convertCssDurationToMs(animationDurationString)

    dialog.addClass('closing'); // Temporarily add a class to control the reverse animation
    setTimeout(() => {
        dialog.each(function () {
            this.close()
        });

        dialog.removeClass('closing'); // Clean up class after closing
    }, animationDurationMs); // Match the duration of the closing animation
}

$(document).on("click", ".close-modal", function () {
    // Close open modals
    $(this).closest('dialog[open]').closeModal()
})


/* When the click handler is used some custom js is run before the modal is opened */
$(document).on('click', "[data-modal-selector].open-form-modal", function (event) {
    let modal = $($(this).data('modal-selector'))

    /* By default clear form values and form errors on open through the btn click handler */
    modal.find('form').clearFormValues().clearFormErrors()

    for (attr of this.attributes) {
        // Set the prefix of a data attr
        let attrPrefix = 'elm-sel'

        // Get the operation of the form I.E. Create or Delete
        if (attr.name == 'form-operation') {
            let formOperation = attr.value
            console.debug(formOperation)

            modal.find(".form-operation").text(formOperation)

            if (formOperation.toLowerCase() == "update") {
                console.debug("update form")

                // Show the button for opening the delete sub form (if applicable)
                modal.find(".open-delete-sub-form-modal").show()
            } else {
                console.debug("create form")

                // Hide the button for opening the delete sub form (if applicable)
                // If form operation is create, there is no object to delete
                modal.find(".open-delete-sub-form-modal").hide()
            }

            continue
        }

        if (attr.name == "hidden-elms") {
            modal.find(attr.value).hide()
        }

        // Continue to the next attr if this attr isn't a data attr
        if (!attr.name.startsWith(attrPrefix)) continue;

        // Get the element selector by removing the prefix
        var elementSelector = attr.name.slice(attrPrefix.length)

        // If the element selector doesn't have a css selector prefix then assume it's a name attr
        cssSelectorPrefixes = ['.', '#']
        if (!cssSelectorPrefixes.includes(elementSelector[0])) {
            elementSelector = `[name=${elementSelector}]`
        }

        // Search the modal for an element that matches the attr name
        let element = modal.find(elementSelector)

        // Continue to the next attr if the element wasn't found
        if (element.length == 0) continue;

        let attrVal
        try {
            attrVal = helpers.decodeBase64(attr.value)
        } catch {
            attrVal = attr.value
        }

        // Set the val and text of the element to the value of the data attr
        if (element.is('input[type="checkbox"]')) {
            element.prop('checked', ["true", "yes"].includes(attrVal.toLowerCase())).trigger('change')
        } else if (element.is('input[type="radio"]')) {
            let value = attrVal.toLowerCase()

            if (!['yes', 'true', 'false', 'no'].includes(value)) continue;

            let isTrue = ['yes', 'true'].includes(value)

            element.each(function () {
                $(this).prop('checked', String(isTrue) == $(this).val().toLowerCase())
            })

            // element.prop('checked', ["true", "yes"].includes(attrVal.toLowerCase())).trigger('change')
        } else if (element.is('input, textarea, select')) {
            element.val(attrVal).trigger('change')
        } else {
            element.text(attrVal)
        }
    }
})

$(document).on('click', "[data-modal-selector].open-delete-sub-form-modal", function (event) {
    let baseFormModal = $(this).closest('dialog')
    let subFormModal = $($(this).data('modal-selector'))

    // Get object id from base form field
    let objectId = baseFormModal.find('#object_id, .object_id, #obj_id, .obj_id').val()

    // Set object id in the sub form object_id field
    subFormModal.find("#delete_sub_form_object_id").val(objectId)
})


/* When the click handler is used some custom js is run before the modal is opened */
$(document).on("click", "[data-modal-selector]", function () {
    if ($(this).data('cancel-dialog-open')) return;

    // Open modal
    let modal = $($(this).data('modal-selector'))

    /* Show the modal */
    modal.showModal()
})

$.fn.clearFormValues = function () {
    // Clear all all values from every input
    $(this).find(':is(input:not([type="checkbox"], [type="radio"]), textarea):not(#csrf_token, #form_hash, #form_timestamp)').val("").trigger('change')
    // Uncheck checkboxes
    $(this).find('input:is([type="checkbox"], [type="radio"])').prop('checked', false).trigger('change')
    // By default select the first select's options because that's browser default
    $(this).find('select option:first-of-type').prop('selected', true).trigger('change')

    return $(this)
}

$.fn.clearFormErrors = function () {
    $(this).find(':is(.input-wrapper)').each(function () {
        /* Previous error message handling */
        // $(this).data('error-message', null)
        // $(this).removeClass('error')

        $(this).find('.error-message').remove()
    })

    $(this).find('button[type="submit"]:disabled').prop('disabled', false)

    return $(this)
}

$.fn.showModal = function () {
    $(this).trigger('shown')
    $(this)[0].showModal()
}

$.fn.openAccordion = function () {
    $(this).accordion('show').get(0).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
    });
}
