const profileData = require("../models/profileData");
const messageRepliesData = require("../models/messageRepliesData");
const likesData = require("../models/likesData");
const messagePostData = require("../models/messagePostData");
const replyData = require("../models/replyData");

exports.getHomeInfo = async (req, res) => {
  // TODO: We need a model which will get all unique profile likes

  let myInfo = req.session.user;
  let myid = myInfo.userid;
  let isItMyProfile = myid == req.params.userid;
  if (!isItMyProfile) {
    res.redirect(`/user/${myid}/home`);
    return;
  }
  let maxPage = 2;

  let pageNum =
    req.params.pagenum == undefined ? 0 : parseInt(req.params.pagenum);
  pageNum = pageNum > maxPage ? 2 : pageNum;
  let next = pageNum != maxPage ? true : false; //for next or prev page button activation
  let prev = pageNum != 0 ? true : false;
  let myPosts = await messagePostData.getPost(myid);
  let messages = await messageRepliesData.getAll(req.session.user);
  let likeCount = await likesData.getnumlikes(myid);
  let latestPosts;
  if (pageNum == 2) {
    latestPosts = await messagePostData.getLatestPosts(1, pageNum * 2);
  } else {
    latestPosts = await messagePostData.getLatestPosts(2, pageNum * 2);
  }

  likeCount = likeCount.rows[0].count;

  for (const post of latestPosts.rows) {
    post.timestamp = post.timestamp.toDateString();
    let replyInfo = await replyData.getReply(post.postid);
    post.replyDetail = replyInfo.rows;
  }

  res.render("home", {
    loggedIn: true,
    allPost: false,
    name: myInfo.firstname + " " + myInfo.lastname,
    url: myInfo.imageurl,
    facts: myInfo.description,
    postCount: myPosts.rowCount,
    messageCount: messages.rowCount,
    likes: likeCount,
    myProfile: isItMyProfile,
    userid: myid,
    latestPosts: latestPosts,
    prev: prev,
    next: next,
    prevPage: pageNum - 1,
    nextPage: pageNum + 1,
    posts: latestPosts.rows,
  });
};

exports.viewmyallpost = async (req, res) => {
  let myInfo = req.session.user;
  let myid = myInfo.userid;
  let isItMyProfile = myid == req.params.userid;
  let myPosts = await messagePostData.getPost(myid);
  let likeCount = await likesData.getnumlikes(myid);
  let messages = await messageRepliesData.getAll(req.session.user);
  for (post of myPosts.rows){
    console.log(post)
    post.timestamp = post.timestamp.toDateString();
    let replyInfo = (await replyData.getReply(post.postid)).rows;

    let replies = [];
    replyInfo.forEach((reply) => {
      let time = reply.timestamp.toDateString();
      replies.push({
        replydetail: reply.replydetail,
        timestamp: time,
        imageurl: reply.imageurl,
        name: reply.firstname + " " + reply.lastname,
      });
    });
    post.replyDetail = replies;
  };
  likeCount = likeCount.rows[0].count;

  res.render("home", {
    allPost: true,
    loggedIn: true,
    name: myInfo.firstname + " " + myInfo.lastname,
    url: myInfo.imageurl,
    facts: myInfo.description,
    postCount: myPosts.rowCount,
    messageCount: messages.rowCount,
    likes: likeCount,
    myProfile: isItMyProfile,
    userid: myid,
    allPosts: myPosts.rows,
  });
};

exports.viewProfilePage = async (req, res, next) => {
  let userid = req.params.userid;
  let myUserid = req.session.user.userid;
  let notMyProfile = myUserid != userid;
  let profile = await profileData
    .getProfileById(userid)
    .catch((e) => console.log("profile" + e));
  profile = profile.rows[0];
  let likes = await likesData
    .getLikes(userid)
    .catch((e) => console.log("likes" + e));
  let posts = await messagePostData
    .getPost(userid)
    .catch((e) => console.log("posts" + e));
  let messages = await messageRepliesData
    .getAll(profile)
    .catch((e) => console.log("messages" + e));
  let liked = false;

  for (post of posts.rows){
    console.log(post)
    post.timestamp = post.timestamp.toDateString();
    let replyInfo = (await replyData.getReply(post.postid)).rows;

    let replies = [];
    replyInfo.forEach((reply) => {
      let time = reply.timestamp.toDateString();
      replies.push({
        replydetail: reply.replydetail,
        timestamp: time,
        imageurl: reply.imageurl,
        name: reply.firstname + " " + reply.lastname,
      });
    });
    post.replyDetail = replies;
  };
  console.log(posts.rows);
  if (notMyProfile) {
    for (let i in likes.rows) {
      if (likes.rows[i].owner == myUserid) liked = true;
    }
  }
  res.render("partials/userprofile", {
    messageCount: messages.rowCount,
    loggedIn: true,
    userObj: profile,
    likes: likes.rowCount,
    posts: posts.rows,
    postCount: posts.rowCount,
    notMyProfile: notMyProfile,
    liked: liked,
  });
};

exports.editProfilePage = async (req, res, next) => {
  res.render("editprofile", {
    loggedIn: true,
    userObj: req.session.user,
  });
};
