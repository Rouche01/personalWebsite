const $ = require('jquery');
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'popper.js/dist/popper.min.js'
import axios from 'axios';
const Handlebars = require('handlebars');
import Router from 'vanilla-router';
import '../css/style.css';
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();


window.addEventListener('load', () => {
    const el = $('#app');
    let blogSlug;
    let globalBlogPost;

    //compile Handlebar Templates 
    const homeTemplate = Handlebars.compile($('#home-template').html());
    const aboutTemplate = Handlebars.compile($('#about-template').html());
    const blogTemplate = Handlebars.compile($('#blog-template').html());
    const loadTemplate = Handlebars.compile($('#load-template').html());
    const articleTemplate = Handlebars.compile($('#article-template').html());
    const nowTemplate = Handlebars.compile($('#now-template').html());
    const resourcesTemplate = Handlebars.compile($('#resources-template').html());
    const resourceTemplate = Handlebars.compile($('#resource-template').html());
    const errorTemplate = Handlebars.compile($('#error-template').html());
    // const meTemplate = Handlebars.compile($('#me-template').html());

    // Registering an helper function for hbs
    Handlebars.registerHelper("markdown", require('helper-markdown'));

    //const html = aboutTemplate();
    //el.html(html);

    // Instantiate api handler
    const api = axios.create({
        baseURL: 'https://romantic-tesla-d9f522.netlify.com/api',
        // timeout: 500,
    });

    const showError = (error) => {
        const { title, message } = error.response.data;
        const html = errorTemplate();
        el.html(html);
        const markup = `
        <div class="icon-head">
            <i class="fa fa-exclamation-triangle fa-5x d-block"></i>
        </div>
        <div class="error-content">
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
        `
        document.querySelector('#error-message').innerHTML = markup;
    }

    // const createHTML = (blogData) => {
    //     const blogContainer = document.querySelector('#blog-container');
    //     blogContainer.innerHTML = blogListTemplate(blogData);
    // }

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

    const convertDate = (timeStamp) => {
        const createDay = new Date(timeStamp);
        return createDay.toDateString();
    }

    // const getBlogPosts = async () => {
    //     try {
    //         const response = await api.get('/blogposts');
    //         const blogPosts = response.data.data.allBlogposts;
    //         blogPosts.forEach((curr, index) => {
    //             curr.excerpt = createExcerpt(curr.content);
    //         });
    //         globalBlogPost = [...blogPosts];
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    router.add('/', () => {
        let html = homeTemplate();
        el.html(html);
        document.title = "Richard Emate | Welcome to my world"
        $("meta[property='og\\:title']").attr("content", "Richard Emate");
        $("meta[property='og\\:url']").attr("content", `https://richardemate.com/index.html`);
        $("meta[property='og\\:image']").attr("content", "placeholder.jpg");
        $("meta[property='og\\:description']").attr("content", "Welcome to the official website of Richard Emate");
        $("meta[name='twitter\\:title']").attr("content", "Richard Emate");
        $("meta[name='twitter\\:description']").attr("content", "Welcome to the official website of Richard Emate");
        $("meta[name='twitter\\:image']").attr("content", "placeholder.jpg");
    });

    router.add('/about', () => {
        let html = aboutTemplate();
        el.html(html);
        document.title = "About Me | Richard Emate";
        $("meta[property='og\\:title']").attr("content", "About me");
        $("meta[property='og\\:url']").attr("content", `https://richardemate.com/about`);
        $("meta[property='og\\:image']").attr("content", "placeholder.jpg");
        $("meta[property='og\\:description']").attr("content", "My story, my values, my work & my life");
        $("meta[name='twitter\\:title']").attr("content", "About me");
        $("meta[name='twitter\\:description']").attr("content", "My story, my values, my work & my life");
        $("meta[name='twitter\\:image']").attr("content", "placeholder.jpg");
    });

    el.on('click', '#blog-container', (event) => {
        //event.preventDefault();
        blogSlug = event.target.closest('a').getAttribute('href');
        console.log(blogSlug);
        
    });


    router.add('/blog', async () => {
        // Display loader
        let html = loadTemplate();
        el.html(html);
        try {
            const response = await api.get('/blogposts');
            const blogPosts = response.data.data.allBlogposts;
            console.log(blogPosts);
            console.log(createExcerpt(blogPosts[0].content));
            html = blogTemplate();
            console.log(html);
            el.html(html);
            document.title = "Latest thoughts from me | Richard Emate"
            $("meta[property='og\\:title']").attr("content", "Latest thoughts from me");
            $("meta[property='og\\:url']").attr("content", `https://richardemate.com/blog`);
            $("meta[property='og\\:image']").attr("content", "placeholder.jpg");
            $("meta[property='og\\:description']").attr("content", "These are the list of my latest thoughts and updates from me");
            $("meta[name='twitter\\:title']").attr("content", "Latest thoughts from me");
            $("meta[name='twitter\\:description']").attr("content", "These are the list of my latest thoughts and updates from me");
            $("meta[name='twitter\\:image']").attr("content", "placeholder.jpg");
            // document.querySelector('#blog-container').innerHTML = "This is working!";
            blogPosts.forEach((curr, index) => {
                curr.excerpt = createExcerpt(curr.content);
                const markup = `
                 <div class="d-flex py-3 px-5 align-items-center">
                     <div class="blog-img p-2 d-none d-sm-block">
                         <a href="${curr.slug}" id="${curr.id}">
                             <img src="${curr.featuredImage.url}" height="225" width="338" alt="${curr.featuredImage.alt}" class="img-fluid">
                         </a>
                     </div>
                     <div class="blog-content p-2">
                         <h3 class="blog-title"><a href="${curr.slug}" id="${curr.id}">${curr.title}</a></h3>
                         <p class="d-inline blog-excerpt">${curr.excerpt}</p>
                         <a href="${curr.slug}" class="d-inline blog-link" id="${curr.id}"> Read More <i class="fa fa-angle-double-right"></i></a>
                     </div>
                 </div>
                 `
                 document.querySelector('#blog-container').insertAdjacentHTML('beforeend', markup);
            });
            globalBlogPost = [...blogPosts];
            // createHTML(blogPosts);
        } catch(error) {
           showError(error);
        }
    });

    router.add('/now', () => {
        let html = nowTemplate();
        el.html(html);
        document.title = "What I'm Doing Now | Richard Emate";
        $("meta[property='og\\:title']").attr("content", "What I'm Doing Now");
        $("meta[property='og\\:url']").attr("content", `https://richardemate.com/now`);
        $("meta[property='og\\:image']").attr("content", "placeholder.jpg");
        $("meta[property='og\\:description']").attr("content", "Projects, Adventures, Experiments, Learnings and Hobbies");
        $("meta[name='twitter\\:title']").attr("content", "What I'm Doing Now");
        $("meta[name='twitter\\:description']").attr("content", "Projects, Adventures, Experiments, Learnings and Hobbies");
        $("meta[name='twitter\\:image']").attr("content", "placeholder.jpg");
    });

    router.add('/resources', async () => {
        // Display loader
        let html = loadTemplate();
        el.html(html);
        try {
            const response = await api.get('/resources');
            const allResources = response.data.data.allResources;
            console.log(allResources);
            html = resourcesTemplate();
            el.html(html);
            document.title = "What I'm Doing Now | Richard Emate";
            $("meta[property='og\\:title']").attr("content", "What I'm Doing Now");
            $("meta[property='og\\:url']").attr("content", `https://richardemate.com/now`);
            $("meta[property='og\\:image']").attr("content", "placeholder.jpg");
            $("meta[property='og\\:description']").attr("content", "Projects, Adventures, Experiments, Learnings and Hobbies");
            $("meta[name='twitter\\:title']").attr("content", "What I'm Doing Now");
            $("meta[name='twitter\\:description']").attr("content", "Projects, Adventures, Experiments, Learnings and Hobbies");
            $("meta[name='twitter\\:image']").attr("content", "placeholder.jpg");
            allResources.forEach((curr, index) => {
                const markup = `
                    <div class="col-sm-4">
                        <div class="card mb-3">
                            <a href="${curr.slug}">
                                <img src="${curr.featuredImage.url}" alt="${curr.featuredImage.alt}" class="card-img-top">
                            </a>
                            <div class="card-body">
                                <h4 class="card-title"><a href="${curr.slug}">${curr.title}</a></h5>
                                <p class="card-text">${curr.metaTags.description}</p>
                            </div>
                        </div>
                    </div>
                `
                document.querySelector('#resourcesGrid').insertAdjacentHTML('beforeend', markup);

            })
        } catch(error) {
            showError(error);
        }
    });

    router.add('{blogSlug}', async (blogSlug) => {
        // Display Loader
        let html = loadTemplate();
        el.html(html);
        console.log(blogSlug);
        try {
            const blogpostResponse = await api.get('/blogposts');
            const blogPosts = blogpostResponse.data.data.allBlogposts;
            const resourcesResponse = await api.get('/resources');
            const allResources = resourcesResponse.data.data.allResources;
            blogPosts.forEach((curr, index) => {
                curr.excerpt = createExcerpt(curr.content);
            });
            console.log(blogPosts);
            const blogpostIndex = blogPosts.findIndex(blogPost => blogPost.slug === blogSlug );
            const resourceIndex = allResources.findIndex(resource => resource.slug === blogSlug);

            if (blogpostIndex !== -1) {
                console.log(blogpostIndex);
                const clickedEl = blogPosts[blogpostIndex];
                clickedEl.content = md.render(clickedEl.content);
                clickedEl._publishedAt = convertDate(clickedEl._publishedAt);
                const {id, content, featuredImage, title, _publishedAt} = clickedEl;
                const markup = `
                    <h1>${clickedEl.title}</h1>
                    <small class="text-muted">Published on ${clickedEl._publishedAt}</small>
                    <img src="${clickedEl.featuredImage.url}" alt="${clickedEl.alt}" class="img-fluid py-4">
                    <div id="article-content">
                        ${clickedEl.content}
                    </div>
                `
                console.log(clickedEl);
                let html = articleTemplate();
                console.log(html);
                el.html(html);
                document.title = `${clickedEl.title} | Richard Emate`;
                $("meta[property='og\\:title']").attr("content", clickedEl.title);
                $("meta[property='og\\:url']").attr("content", `https://richardemate.com/${blogSlug}`);
                $("meta[property='og\\:image']").attr("content", clickedEl.featuredImage.url);
                $("meta[property='og\\:description']").attr("content", clickedEl.excerpt);
                $("meta[name='twitter\\:title']").attr("content", clickedEl.title);
                $("meta[name='twitter\\:description']").attr("content", clickedEl.excerpt);
                $("meta[name='twitter\\:image']").attr("content", clickedEl.featuredImage.url);
                document.querySelector('#main-article').innerHTML = markup;
                const fbShare =  document.querySelector('#facebook-share');
                const twtShare = document.querySelector('#twitter-share');
                twtShare.href = `https://twitter.com/intent/tweet?text=${clickedEl.title};url=https://richardemate.com/${blogSlug}`
                fbShare.href = `https://www.facebook.com/sharer/sharer.php?u=https://richardemate.com/${blogSlug}`
                // fbShare.addEventListener("click", () => {
                //     (function(d, s, id) {
                //         var js, fjs = d.getElementsByTagName(s)[0];
                //         if (d.getElementById(id)) return;
                //         js = d.createElement(s); js.id = id;
                //         js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
                //         fjs.parentNode.insertBefore(js, fjs);
                //       }(document, 'script', 'facebook-jssdk'));
                // })
                el.on('click', '#load-comments', (event) => {
                    var disqus_config = function() {
                        this.page.url = window.location.href,
                        this.page.identifier = window.location.pathname
                    };

                    (function() { // DON'T EDIT BELOW THIS LINE
                    var d = document, s = d.createElement('script');
                    s.src = 'https://richard-emate.disqus.com/embed.js';
                    s.setAttribute('data-timestamp', +new Date());
                    (d.head || d.body).appendChild(s);
                    })();
                });
            } else if (resourceIndex !== -1) {
                console.log(resourceIndex);
                const clickedEl = allResources[resourceIndex];
                clickedEl.content = md.render(clickedEl.content);
                const markup = `
                    <h1>${clickedEl.title}</h1>
                    <div id="resource-content" class="mt-3">
                        ${clickedEl.content}
                    </div>
                `
                console.log(clickedEl);
                let html = resourceTemplate();
                console.log(html);
                el.html(html);
                document.querySelector('#main-resource').innerHTML = markup;

            } else {

            }
            
            const presentPage = window.location.href;
            // const trial = blogSlug;
            // console.log(trial);
            
        } catch(error) {
            console.log(error);
        }
        
    });

    

    if(window.location.pathname !== "/") {
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
        } else if (path.includes(blogSlug)) {
            $('#majorNav').removeClass('navbar-dark');
            $('#majorNav').addClass('navbar-light');
        } else if (path.includes('now')) {
            $('#majorNav').removeClass('navbar-dark');
            $('#majorNav').addClass('navbar-light');
        } else if (path.includes('resources')) {
            $('#majorNav').removeClass('navbar-dark');
            $('#majorNav').addClass('navbar-light');
        } else {
            $('#majorNav').removeClass('navbar-light');
            $('#majorNav').addClass('navbar-dark');
        }
        router.navigateTo(path);
    });

    // el.on('click', '#load-comments', (event) => {
    //     // event.preventDefault();
    //     // console.log(event.target.closest('a').getAttribute('href'));
    //     const disqua
    // });
});

