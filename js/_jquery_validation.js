// ################### jQuery validation initialization ###################

// Function to trigger validation without displaying error messages
$.fn.silenceErrorMessages = function () {
    // Get the form 
    const $form = $(this);
    let validator = $form.validate()

    // Only adjust the submit button dismiss property, and don't show error messages
    validator.settings.errorPlacement = function (error, element) {
        $form.find('button[type="submit"]').prop('disabled', true)
    };
    validator.settings.success = function (label, element) {
        $form.find('button[type="submit"]').prop('disabled', false)
    };

    return $(this)
}

// Custom validators
$.validator.addMethod("anyof", function (value, element, options) {
    return this.optional(element) || options.indexOf(value) !== -1;
}, function (options, element) {
    return `You may only enter ${grammaticalJoin(options, "", "or")}.`
});
$.validator.addMethod("regexp", function (value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
}, "Please enter a valid value.");

// Set defaults for every form
$.validator.setDefaults({
    errorPlacement: function (error, element) {
        let $errorContainer = element.siblings(".error-message");
        if (!$errorContainer.length) {
            $errorContainer = $('<div class="error-message"></div>').insertAfter(element);
        }
        error.appendTo($errorContainer);

        // Get the form element
        $form = $(element).closest('form')
        // Make the submit button disabled
        $form.find('button[type="submit"]').prop('disabled', true)
    },
    success: function (label, element) {
        let $errorContainer = $(element).siblings(".error-message");
        if ($errorContainer.length) {
            $errorContainer.remove();
        }

        // Get the form element
        $form = $(element).closest('form')
        // Make the submit button not disabled
        $form.find('button[type="submit"]').prop('disabled', false)
    }
});
