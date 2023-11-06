var close = document.getElementsByClassName('header__close')[0];
var burger = document.getElementsByClassName('header__burger')[0];
var nav = document.getElementsByClassName('header__nav')[0];
close.onclick = function () {
    nav.style = "display: none;";
}
burger.onclick = function () {
    nav.style = "display: flex;";
}