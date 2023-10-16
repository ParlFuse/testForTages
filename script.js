const axios = require('axios');

const api = 'https://jsonplaceholder.typicode.com/';

async function fetchUsersAndPosts() {
  try {
    const [usersResponse, postsResponse] = await Promise.all([
      axios.get(`${api}users`),
      axios.get(`${api}posts`)
    ]);

    const users = usersResponse.data;
    const posts = postsResponse.data;

    const groupedPosts = {};
    for (const post of posts) {
      if (!groupedPosts[post.userId]) {
        groupedPosts[post.userId] = [];
      }
      groupedPosts[post.userId].push(post);
    }

    const ervinHowellUser = users.find(user => user.name === 'Ervin Howell');
    const ervinHowellPosts = groupedPosts[ervinHowellUser.id] || [];
    for (const post of ervinHowellPosts) {
      const commentsResponse = await axios.get(`${api}posts/${post.id}/comments`);
      post.comments = commentsResponse.data;
    }

    const result = users.slice(0, 10).map(user => {
      const formattedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        address: `${user.address.city}, ${user.address.street}, ${user.address.suite}`,
        website: `https://${user.website}`,
        company: user.company.name,
        posts: (groupedPosts[user.id] || []).map(post => {
          const { userId, ...postWithoutUserId } = post;
          return {
            ...postWithoutUserId,
            title_crop: post.title.slice(0, 20) + (post.title.length > 20 ? '...' : '')
          };
        })
      };

      return formattedUser;
    });

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

fetchUsersAndPosts();
