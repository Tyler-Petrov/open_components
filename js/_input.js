

// ################### Search ###################
$.fn.searchElementsByText = function (searchText) {
    $(this).each(function () {
        if (searchText == "") {
            $(this).show();
        } else if ($(this).text().toLowerCase().includes(searchText.toLowerCase())) {
            $(this).show()
        } else {
            $(this).hide()
        }
    });
}

$('input[data-search-selector]').on('keyup DOMContentLoaded', function (event) {
    let searchStr = $(this).val()

    let searchSelector = $(this).data('search-selector')
    let elementsToSearch = $(searchSelector)

    elementsToSearch.searchElementsByText(searchStr)
})


// ################### Show hide password field ###################
$('.input-wrapper input[type="password"]').each(function () {
    let input = $(this)
    let wrapper = input.closest('.input-wrapper')

    wrapper.find('.toggle-password-visibility').click(function (event) {
        if (input.attr('type') == 'text') {
            input.attr('type', 'password')
        } else {
            input.attr('type', 'text')
        }
    })
})


// ################### Yes no field ###################
$('.boolean-input-wrapper :is(.yes, .no)').click(function (event) {
    $(this).parent().find('input[type="checkbox"]').prop('checked', $(this).hasClass("yes"))
})


// ################### Update select widget on select change ###################
$('.input-wrapper select').on('change', function () {
    let selectElm = $(this)
    let wrapper = selectElm.closest('.input-wrapper')
    let selectedOptionElm = wrapper.find('.widget .selected-option-text')

    selectedOptionElm.text(selectElm.find('option:selected').text())
})


// ################### Suggestion Input Autocomplete ###################
$(window).on('resize', adjustDropdownPosition);

$(document).on('click', '.input-wrapper .suggestion-dropdown > *', function () {
    let wrapper = $(this).closest('.input-wrapper')
    let input = wrapper.find('input')

    const selectedItem = $(this).text().trim();
    input.val(selectedItem);
})

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}
$(document).on("focus", ".input-wrapper input", function () {
    let suggestionDropdown = $(this).closest('.input-wrapper').find('.suggestion-dropdown')
    suggestionDropdown.css({ width: $(this).outerWidth() })
})
$(document).on("focus blur input", ".input-wrapper input", function (event) {
    let input = $(this)
    let wrapper = input.closest('.input-wrapper')
    let suggestionDropdown = wrapper.find('.suggestion-dropdown')
    if (suggestionDropdown.length == 0) return;

    if (input.is(':focus')) {
        suggestionDropdown.addClass('show')

        // Sort suggestions from list
        const query = input.val().toLowerCase();
        wrapper.find(".suggestion-dropdown > *").each(function () {
            const item = $(this).text().toLowerCase();
            if (item.includes(query)) {
                const highlightedText = highlightMatch($(this).text(), query);
                $(this).html(highlightedText);
                $(this).removeClass('hidden');
            } else {
                $(this).addClass('hidden');
            }
        });

        // Adjust the dropdown position
        adjustDropdownPosition()
    } else {
        setTimeout(function () {
            suggestionDropdown.removeClass('show')
        }, 100)
    }
})

function adjustDropdownPosition() {
    $('.input-wrapper .suggestion-dropdown').each(function () {
        let dropdownMenu = $(this)
        let inputWrapper = dropdownMenu.closest('.input-wrapper')

        // If dropdown isn't shown, then exit function
        if (!dropdownMenu.is(':visible')) return;

        let dropdownHeight = dropdownMenu[0].scrollHeight + 20;
        let widgetHeight = inputWrapper.outerHeight();
        let windowHeight = $(window).height();
        let widgetOffset = inputWrapper.offset().top;

        let spaceAbove = widgetOffset - $(window).scrollTop();
        let spaceBelow = windowHeight - (widgetOffset + widgetHeight - $(window).scrollTop());

        // Adjust position based on available space
        if (spaceBelow >= Math.min(spaceAbove, dropdownHeight)) {
            // Place below
            dropdownMenu.css({
                translate: "0 5px",
                "max-height": spaceBelow - 10
            });
        } else {
            // Place above
            dropdownMenu.css({
                translate: `0 calc(-100% - ${widgetHeight + 10}px)`,
                "max-height": spaceAbove - 15
            });
        }
    })
}
