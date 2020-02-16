require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.API_KEY;
// const timeout = process.env.TIMEOUT || 10000;

const axiosInstance = axios.create({
    url:  `https://graphql.datocms.com/`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    timeout: 8000,
})

const allBlogPosts = async () => {
    try {
        const response = await axiosInstance({
        method: 'post',
        data: {
            query: `
                query MyQuery {
                    allBlogposts {
                    id
                    content
                    featuredImage {
                        url
                        alt
                    }
                    slug
                    title
                    _publishedAt
                    }
                }
            `
        },
        }); 
        return response.data;
    } catch (error) {
        return new Error(data.error.type);
    }
};

const allResources = async () => {
    try {
        const response = await axiosInstance({
            method: 'post',
            data: {
                query: `
                    query MyQuery {
                        allResources {
                            id
                            title
                            slug
                            content
                            featuredImage {
                              alt
                              url
                            }
                            _seoMetaTags {
                              attributes
                              content
                            }
                            category
                            metaTags {
                              description
                              title
                              twitterCard
                            }
                          }
                    }
                `
            }
        });
        return response.data;
    } catch (error) {
        return new Error(data.error.type);
    }
};

module.exports = {
    allPosts: async () => await allBlogPosts(),
    allResources: async () => await allResources(),
};