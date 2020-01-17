window.addEventListener('load', () => {
    const el = $('#app');

    //compile Handlebar Templates 
    const homeTemplate = Handlebars.compile($('#home-template').html());

    const html = homeTemplate();
    el.html(html);
});