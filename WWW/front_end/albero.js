/**
 * Gestisce il comportamento di toggle per l'espansione/collasso dei nodi in una struttura ad albero.
 *
 * Quando un elemento con la classe "toggle" viene cliccato:
 * - alterna la classe "open" sull'elemento cliccato;
 * - mostra o nasconde (con animazione) il successivo elemento <ul> fratello del genitore.
 *
 * @event click
 * @memberof jQuery(".tree")
 * @param {Event} e - L'evento di click sul nodo toggle.
 */
$(".tree").on("click", ".toggle", function(e) {
    $(this).toggleClass("open");
    $(this).parent().next("ul").stop(true, true).slideToggle(200);
});
