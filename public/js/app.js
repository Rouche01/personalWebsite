window.addEventListener('load', () => {
    const el = $('#app');
    let blogSlug;

    //compile Handlebar Templates 
    const homeTemplate = Handlebars.compile($('#home-template').html());
    const aboutTemplate = Handlebars.compile($('#about-template').html());
    const blogTemplate = Handlebars.compile($('#blog-template').html());
    const loadTemplate = Handlebars.compile($('#load-template').html());
    const articleTemplate = Handlebars.compile($('#article-template').html());

    //const html = aboutTemplate();
    //el.html(html);

    // Instantiate api handler
    const api = axios.create({
        baseURL: 'http://localhost:3000/api'
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

    const createExcerpt = (string) => {
        let stringArr = string.split(/(\s)/, 60);
        let excerpt = stringArr.join('');
        // stringArr.forEach((curr, index) => {
        //     if (index < 2) {
        //         excerpt = excerpt + " " + curr;
        //     }
        //     return excerpt;
        // })
        return excerpt;
    }

    router.add('/', () => {
        let html = homeTemplate();
        el.html(html);
    });

    router.add('/about', () => {
        let html = aboutTemplate();
        el.html(html);
    });

    el.on('click', '#blog-container', (event) => {
        //event.preventDefault();
        blogSlug = event.target.closest('a').getAttribute('href');
        //console.log(blogSlug);
        
    });

    router.add('/blog', async () => {
        // Display loader
        let html = loadTemplate();
        el.html(html);
        try {
            const response = await api.get('/blogposts');
            const blogPosts = response.data.data.allBlogposts;
            blogPosts.forEach((curr, index) => {
               curr.excerpt = createExcerpt(curr.content);
            });
            console.log(createExcerpt(blogPosts[0].content));
            html = blogTemplate({apiBlogPosts:blogPosts});
            el.html(html);
        } catch(error) {
           showError(error);
        }
    });

    router.add('{blogSlug}', async (blogSlug) => {
        const response = await api.get('/blogposts');
        const blogPosts = response.data.data.allBlogposts;
        console.log(blogPosts);
        const index = blogPosts.findIndex(blogPost => blogPost.slug === blogSlug );
        const clickedEl = blogPosts[index];
        const {id, content, featuredImage, title} = clickedEl;
        // const trial = blogSlug;
        // console.log(trial);
        console.log(clickedEl);
        let html = articleTemplate({id, content, featuredImage, title});
        el.html(html);
    });

    if(window.location.pathname.includes('about')) {
        $('#majorNav').removeClass('navbar-dark');
        $('#majorNav').addClass('navbar-light');
    } else if (window.location.pathname.includes('blog')) {
        $('#majorNav').removeClass('navbar-dark');
        $('#majorNav').addClass('navbar-light');
    } else if (window.location.pathname.includes('article')) {
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
        } else if (path.includes('article')) {
            $('#majorNav').removeClass('navbar-dark');
            $('#majorNav').addClass('navbar-light');
        } else {
            $('#majorNav').removeClass('navbar-light');
            $('#majorNav').addClass('navbar-dark');
        }
        router.navigateTo(path);
    });

    // el.on('click', '#blog-container', (event) => {
    //     event.preventDefault();
    //     console.log(event.target.closest('a').getAttribute('href'));
    // });
});

