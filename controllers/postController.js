const Post = require("../models/Post");
const User = require("../models/User");
module.exports.createPost = async (req, res) => {
  try {
    const {
      title,
      tags,
      category,
      content,
      authorId,
      authorName,
      authorUsername,
    } = await req.body;

    const { submitType } = await req.query;

    if (!title) {
      return res
        .send({
          success: false,
          message: "Post needs a title.",
        })
        .status(400);
    }

    const newPost = await Post.create({
      title: title.trim(),
      content,
      category: category.trim(),
      tags,
      author: {
        authorId,
        authorName,
        authorUsername,
      },
      published: submitType === "draft" ? false : true,
    });
    await User.findByIdAndUpdate(
      authorId,
      {
        $push: { posts: newPost._id },
      },
      {
        new: true,
        multi: false,
      }
    );
    res.status(200).send({
      success: true,
      message: "Post created successfully.",
      details: newPost,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error creating new post. Please try again.",
    });
  }
};

module.exports.fetchHomepagePosts = async (req, res) => {
  try {
    const { skip } = await req.query;
    const posts = await Post.find(
      { published: true },
      "title content category author likes comments"
    )
      .sort({ _id: -1 })
      // .skip(Number(skip))
      // .limit(3)
      .lean();

    // let result = posts.map(async (post) => {
    //   let author = await User.findById(post.author, "name username").lean();
    //   return {
    //     ...post,
    //     author,
    //   };
    // });
    // Promise.all(result).then((r) => {
    console.log(posts);
    return res.send({
      success: true,
      message: "Posts fetched successfully",
      details: posts,
    });
    // });

    // console.log(await result);

    // const embedAuthorInfo = (posts) => {
    //   var result = [];
    //   posts.forEach(async (post) => {
    //     let author = await User.findById(post.author, "name username").lean();
    //     await result.push({
    //       ...post,
    //       author: {
    //         name: author.name,
    //         username: author.username,
    //       },
    //     });
    //     console.log(result);
    //   });
    //   return result;
    // };
    // let r = await embedAuthorInfo(posts);
    // console.log(r);
  } catch (error) {
    console.log(error);
    return res.send({
      success: true,
      message: "Something went wrong while fetching posts.",
      details: null,
    });
  }
};

module.exports.fetchProfilePosts = async (req, res) => {
  try {
    const { skip, profile } = await req.query;
    const posts = await Post.find(
      {
        published: true,
        // author: {
        //   authorUsername: profile,
        // },
      },
      "title content category author likes comments"
    )
      .sort({ _id: -1 })
      .skip(skip ?? 0)
      .limit(3)
      .lean();

    console.log(posts);
    return res.send({
      success: true,
      message: "Posts fetched successfully",
      details: posts,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: true,
      message: "Something went wrong while fetching posts.",
      details: null,
    });
  }
};
