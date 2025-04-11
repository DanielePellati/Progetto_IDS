// Toggle per espandere/collassare i nodi
$(".tree").on("click", ".toggle", function() {
    $(this).toggleClass("open");
    $(this).parent().next("ul").stop(true, true).slideToggle(200);
});