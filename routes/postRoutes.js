const router = require("express").Router();
const postController = require("../controllers/postController");
const auth = require("../middlewares/auth");
router.post("/create-post", auth, postController.createPost);
router.get("/fetchHomepagePosts", postController.fetchHomepagePosts);
router.get("/fetchProfilePosts", postController.fetchProfilePosts);

module.exports = router;
