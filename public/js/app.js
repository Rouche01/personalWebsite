window.addEventListener('load', () => {
    const el = $('#app');

    //compile Handlebar Templates 
    const homeTemplate = Handlebars.compile($('#home-template').html());
    const aboutTemplate = Handlebars.compile($('#about-template').html());
    const blogTemplate = Handlebars.compile($('#blog-template').html());
    const loadTemplate = Handlebars.compile($('#load-template').html());

    //const html = aboutTemplate();
    //el.html(html);

    // Instantiate api handler
    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        timeout: 7000,
    });

    const showError = (error) => {
        const { title, message } = error.response.data;
        const html = errorTemplate({ color: 'red', title, message});
        el.html(html);
    }

    const router = new Router({
        mode: 'history',
        page404: (path) => {
            const html = errorTemplate({
                color: 'yellow',
                title: 'Error 404 - Page NOT Found!',
                message: `The path '/${path}' does not exist on this site`
            });
            el.html(html);
        }
    });

    router.add('/', () => {
        let html = homeTemplate();
        el.html(html);
    });

    router.add('/about', () => {
        let html = aboutTemplate();
        el.html(html);
    });

    router.add('/blog', () => {
        let html = loadTemplate();
        el.html(html);
    });

    if(window.location.pathname.includes('about')) {
        $('#majorNav').removeClass('navbar-dark');
        $('#majorNav').addClass('navbar-light');
    } else if (window.location.pathname.includes('blog')) {
        $('#majorNav').removeClass('navbar-dark');
        $('#majorNav').addClass('navbar-light');
    } else {
        $('#majorNav').removeClass('navbar-light');
        $('#majorNav').addClass('navbar-dark');
    }

    router.navigateTo(window.location.pathname);

    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');

    $('a').on('click', (event) => {
        event.preventDefault();

        const target = $(event.target);
        $('.nav-link').removeClass('active');
        target.addClass('active');

        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        if(path.includes('about')) {
            $('#majorNav').removeClass('navbar-dark');
            $('#majorNav').addClass('navbar-light');
        } else if (path.includes('blog')) {
            $('#majorNav').removeClass('navbar-dark');
            $('#majorNav').addClass('navbar-light');
        } else {
            $('#majorNav').removeClass('navbar-light');
            $('#majorNav').addClass('navbar-dark');
        }
        router.navigateTo(path);
    });
    

});