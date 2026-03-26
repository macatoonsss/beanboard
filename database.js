// Firebase Database Module
// Functions for database operations

// Add a new post
async function createPost(userId, content, imageUrl = null) {
  try {
    const postsRef = firebase.firestore().collection('posts');
    
    const docRef = await postsRef.add({
      userId: userId,
      content: content,
      imageUrl: imageUrl,
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      shares: 0
    });

    console.log("Post created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// Get all posts
async function getAllPosts() {
  try {
    const postsSnapshot = await firebase.firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .get();

    const posts = [];
    for (const doc of postsSnapshot.docs) {
      const post = doc.data();
      post.id = doc.id;

      // Get user info for this post
      const userRef = await firebase.firestore().collection('users').doc(post.userId).get();
      if (userRef.exists) {
        post.user = userRef.data();
      }

      posts.push(post);
    }

    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

// Get posts by user
async function getUserPosts(userId) {
  try {
    const postsSnapshot = await firebase.firestore()
      .collection('posts')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const posts = [];
    postsSnapshot.forEach(doc => {
      const post = doc.data();
      post.id = doc.id;
      posts.push(post);
    });

    return posts;
  } catch (error) {
    console.error("Error getting user posts:", error);
    return [];
  }
}

// Like a post
async function likePost(postId, userId) {
  try {
    const likesRef = firebase.firestore()
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .doc(userId);

    const likeDoc = await likesRef.get();

    if (likeDoc.exists) {
      // Unlike
      await likesRef.delete();
      console.log("Post unliked");
    } else {
      // Like
      await likesRef.set({
        userId: userId,
        likedAt: new Date()
      });
      console.log("Post liked");
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

// Add comment to post
async function addComment(postId, userId, commentText) {
  try {
    const commentsRef = firebase.firestore()
      .collection('posts')
      .doc(postId)
      .collection('comments');

    const docRef = await commentsRef.add({
      userId: userId,
      commentText: commentText,
      createdAt: new Date()
    });

    console.log("Comment added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

// Get comments for a post
async function getPostComments(postId) {
  try {
    const commentsSnapshot = await firebase.firestore()
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('createdAt', 'desc')
      .get();

    const comments = [];
    for (const doc of commentsSnapshot.docs) {
      const comment = doc.data();
      comment.id = doc.id;

      // Get user info for comment
      const userRef = await firebase.firestore().collection('users').doc(comment.userId).get();
      if (userRef.exists) {
        comment.user = userRef.data();
      }

      comments.push(comment);
    }

    return comments;
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
}

// Delete post
async function deletePost(postId) {
  try {
    await firebase.firestore().collection('posts').doc(postId).delete();
    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

// Search users
async function searchUsers(searchTerm) {
  try {
    const usersSnapshot = await firebase.firestore()
      .collection('users')
      .where('username', '>=', searchTerm)
      .where('username', '<=', searchTerm + '\uf8ff')
      .get();

    const users = [];
    usersSnapshot.forEach(doc => {
      const user = doc.data();
      user.id = doc.id;
      users.push(user);
    });

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}

console.log("Database module loaded");
