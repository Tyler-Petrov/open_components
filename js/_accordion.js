$(document).on('click', '.accordion .header', function (event) {
    let accordion = $(this).closest('.accordion')

    // Show or hide accordion body based on if the show class was found
    let showAccordionBody = !accordion.hasClass('show')
    accordion.accordion(showAccordionBody ? "show" : "hide")
})

$.fn.accordion = function (action) {
    let accordion = $(this).closest('.accordion')

    // Get the animation duration from the css variable
    let animationDurationString = accordion.css('--accordion-animation-duration')
    let animationDurationMs = convertCssDurationToMs(animationDurationString)

    // Show or hide accordion body based on what action was passed in
    if (action == "show") {
        accordion.addClass('show').find('.body').slideDown(animationDurationMs)
    } else if (action == "hide") {
        accordion.removeClass('show').find('.body').slideUp(animationDurationMs)
    }

    return accordion
}
