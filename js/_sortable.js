// ################### Sortable AJAX call ###################
function defaultSortableKwargs(sortable, kwargs = {}) {
    let handle = sortable.dataset.sortableHandle;

    return {
        animation: 150,
        fallbackTolerance: 3, // So that we can select items on mobile
        selectedClass: 'selected',
        ghostClass: "sortable-ghost", // Class name for the drop placeholder
        chosenClass: "sortable-chosen", // Class name for the chosen item
        dragClass: "sortable-drag", // Class name for the dragging item
        handle: handle,
        onEnd: function (event) {
            let sortableSignedKw = sortable.dataset.sortableSignedKw;
            if (!sortableSignedKw) return;

            if (event.oldDraggableIndex == event.newDraggableIndex) return;

            jsonAjax({
                "url": window.reorderUrl,
                "json": {
                    "sortable_signed_kw": sortable.dataset.sortableSignedKw,
                    "old_index": event.oldDraggableIndex,
                    "new_index": event.newDraggableIndex,
                },
            }).catch(_ => {
                // Get the item to move, and remove it from the dom
                let itemToMove = sortable.children[event.newIndex];
                itemToMove.remove();

                // Get the item that is in the place of the moved item
                let referenceItem = sortable.children[event.oldIndex];

                // Insert the moved element directly before the reference item
                sortable.insertBefore(itemToMove, referenceItem);
            });
        },
        ...kwargs,
    };
}
defaultSortableKwargs = defaultSortableKwargs;

$.fn.initializeSortable = function (sortableKwargs = {}) {
    $(this).each(function () {
        let sortable = this;
        let childrenLen = sortable.children.length;
        if (childrenLen <= 1) return;
        new Sortable(sortable, defaultSortableKwargs(sortable, sortableKwargs));
    });

    // Prevent context menu from showing on long press on mobile
    $(this).on('contextmenu', e => e.preventDefault());
};

if (typeof Sortable != "undefined") {
    var sortables = $('.sortable');
    sortables.initializeSortable();
}
