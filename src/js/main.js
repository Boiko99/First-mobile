
$(document).ready(function(){

    $('.menu--img').click(function(){
        $('#main-menu').slideToggle(600);
    });
    $('.menu__close').click(function(){
        console.log('click triggered..');
        $('#main-menu').slideUp(600);
    })
});