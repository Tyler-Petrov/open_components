function encodeBase64(str) {
    // Convert string to base64
    let base64Str = btoa(str);
    // Make base64 URL safe
    let urlSafeBase64Str = base64Str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return urlSafeBase64Str;
}

function decodeBase64(base64Str) {
    // Make URL safe base64 back to regular base64
    let base64 = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if necessary
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }
    // Convert base64 to string
    let str = atob(base64);
    return str;
}

function convertCssDurationToMs(durationString) {
    // Trim any surrounding whitespace and initialize the multiplier based on the unit
    const trimmed = (durationString || "0ms").trim();

    // Check if the duration ends with 'ms' (milliseconds)
    if (trimmed.endsWith('ms')) {
        // Parse the number excluding the last two characters and return
        return parseInt(trimmed.slice(0, -2));
    }

    // Check if the duration ends with 's' (seconds)
    else if (trimmed.endsWith('s')) {
        // Parse the number excluding the last character, convert to milliseconds
        return parseFloat(trimmed.slice(0, -1)) * 1000;
    }
    else {
        // Handle case where no valid duration unit is provided
        throw new Error("Invalid duration format");
    }
}

function grammaticalJoin(lst, defaultValue = "", conjunction = "and") {
    if (!Array.isArray(lst)) {
        lst = Array.from(lst);
    }

    if (lst.length < 1) {
        return defaultValue;
    }

    if (lst.length === 1) {
        return lst[0];
    }

    if (lst.length === 2) {
        return lst.join(` ${conjunction} `);
    }

    return `${lst.slice(0, -1).join(", ")}, ${conjunction} ${lst[lst.length - 1]}`;
}

/* API request base */
function jsonAjax(args) {
    var ajaxArgs = Object.assign({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        json: {},
        defaultError: 'There was an unexpected error processing your request.',
        // complete: (jqXHR, textStatus) => {
        //     if (args.modal) args.modal.modal('hide');
        //     if (!args.flashSuccess || textStatus != "success") return;
        //     var successMessage = jqXHR.responseJSON.success
        //     if (!successMessage) return;
        //     flash(successMessage)
        // }
    }, args);

    ajaxArgs.data ??= JSON.stringify(ajaxArgs.json); // Equivalent to python's .setdefault() on dicts

    var ajaxBase = $.ajax(ajaxArgs);

    return ajaxBase.fail(function (response) {
        try {
            console.error(response.responseJSON.error);
        } catch {
            console.error(args.defaultError);
        }
    });
}

function cssDurationToMs(duration) {
    const regex = /^(\d+(\.\d+)?)(s|ms)$/;
    const match = duration.match(regex);

    if (!match) {
        throw new Error("Invalid duration format");
    }

    const value = parseFloat(match[1]);
    const unit = match[3];

    return unit === 's' ? value * 1000 : value;
}

function flash({ message, category = 'Info', title = null, duration = "10s" } = {}) {
    let alertMessageHtml = [
        `<div class="alert-message ${category.toLowerCase()}" style="--animation-duration: ${duration}">`,
        `<div class="icon">`,
        `<i class="fa fa-circle-info"></i>`,
        `</div>`,
        `<div class="title-row">`,
        `<h4>${title || category}</h4><br>`,
        `<h5 class="sub">`,
        message,
        `</h5>`,
        `</div>`,
        `<button class="dismiss">`,
        `<i class="fa fa-xmark"></i>`,
        `</button>`,
        `</div>`,
    ]

    let $alert = $(alertMessageHtml.join(''))

    $alert.hide().prependTo('.alert-messages-container').registerAlertMessage().slideDown(300)
}
