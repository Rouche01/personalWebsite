require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.API_KEY;
const timeout = process.env.TIMEOUT;

const allBlogPosts = async () => {
    try {
        const response = await axios({
        url:  `https://graphql.datocms.com/`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
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
                    }
                }
            `
        }
        }); 
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    allPosts: async () => await allBlogPosts(),
};