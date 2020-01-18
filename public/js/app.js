window.addEventListener('load', () => {
    const el = $('#app');

    //compile Handlebar Templates 
    const homeTemplate = Handlebars.compile($('#home-template').html());

    //const html = homeTemplate();
    //el.html(html);
});

const changeNavStyle = () => {
    $( document ).ready( function() {
        if (document.URL.indexOf('about') > -1) {
            document.querySelector('#majorNav').classList.remove('navbar-dark');
            document.querySelector('#majorNav').classList.add('navbar-light');
        }
    })
}