import mongoose from "mongoose";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Video from "./models/Video.js";
import Comment from "./models/Comment.js";
import History from "./models/History.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// Replace with your Atlas connection string
const MONGO_URI =
  "mongodb+srv://yoi1:fywkDt3P0hFnNSvi@cluster0.n0r5fqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function seed() {
  await mongoose.connect(MONGO_URI);

  await User.deleteMany({});
  await Channel.deleteMany({});
  await Video.deleteMany({});
  await Comment.deleteMany({});
  await History.deleteMany({});

  // 1. Create dummy users with hashed passwords and profile pictures
  const salt = bcrypt.genSaltSync(10);
  const users = await User.insertMany([
    {
      name: "Alice",
      email: "alice@example.com",
      password: bcrypt.hashSync("password123", salt),
      img: "https://dl.memuplay.com/new_market/img/com.vicman.newprofilepic.icon.2025-01-21-19-36-35.png",
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: bcrypt.hashSync("password123", salt),
      img: "https://i.pinimg.com/736x/67/b4/96/67b49639339ccdadf672c78cc77a58b9.jpg",
    },
    {
      name: "Charlie",
      email: "charlie@example.com",
      password: bcrypt.hashSync("password123", salt),
      img: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b367acac-2ef7-42e6-a6cc-2264a7212b61/dg9xlp3-fe6c857b-78c1-44f2-8c40-a85005444cea.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2IzNjdhY2FjLTJlZjctNDJlNi1hNmNjLTIyNjRhNzIxMmI2MVwvZGc5eGxwMy1mZTZjODU3Yi03OGMxLTQ0ZjItOGM0MC1hODUwMDU0NDRjZWEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.8wAoDJx9cjA8LZ1N4JQJH9YfOBkZOVFY-qEwlPd3nLo",
    },
  ]);

  // 2. Create dummy channels (linked to users)
  const channels = await Channel.insertMany([
    {
      name: "Alice's Channel",
      description: "Tech tutorials",
      userId: users[0]._id,
      banner:
        "https://live.staticflickr.com/65535/53110330044_f2ad75c372_h.jpg",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGEj8BJvkui02RnzWojhcBtml5m26xR4mNjTmyEdeYCw3nwLJMN_e0YvNKDwYXSAD4suY&usqp=CAU",
    },
    {
      name: "Bob's Channel",
      description: "Gaming videos",
      userId: users[1]._id,
      banner:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      img: "https://i.pinimg.com/736x/67/b4/96/67b49639339ccdadf672c78cc77a58b9.jpg",
    },
    {
      name: "Charlie's Channel",
      description: "Vlogs and more",
      userId: users[2]._id,
      banner:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      img: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b367acac-2ef7-42e6-a6cc-2264a7212b61/dg9xlp3-fe6c857b-78c1-44f2-8c40-a85005444cea.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2IzNjdhY2FjLTJlZjctNDJlNi1hNmNjLTIyNjRhNzIxMmI2MVwvZGc5eGxwMy1mZTZjODU3Yi03OGMxLTQ0ZjItOGM0MC1hODUwMDU0NDRjZWEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.8wAoDJx9cjA8LZ1N4JQJH9YfOBkZOVFY-qEwlPd3nLo",
    },
  ]);

  // 3. Create dummy videos (3 per user/channel)
  const videos = await Video.insertMany([
    // Alice's videos
    {
      title: "Learn React in 30 Minutes",
      imgUrl: "https://i.ytimg.com/vi/hQAHSlTtcmY/maxresdefault.jpg",
      videoUrl: "/uploads/program1.mp4",
      desc: "A comprehensive React tutorial covering components, state management, and hooks. Perfect for beginners who want to quickly understand React fundamentals and start building interactive web applications. We'll cover JSX syntax, component lifecycle, and modern React patterns.",
      tags: ["React"],
      userId: users[0]._id,
      views: 15200,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-20"),
      comments: [],
    },
    {
      title: "JavaScript ES6 Crash Course",
      imgUrl: "https://i.ytimg.com/vi/NCwa_xi0Uuc/maxresdefault.jpg",
      videoUrl: "/uploads/program2.mp4",
      desc: "Master modern JavaScript with ES6+ features including arrow functions, destructuring, spread operators, and async/await. Learn how to write cleaner, more efficient code and understand the latest JavaScript syntax that's essential for modern web development.",
      tags: ["JavaScript"],
      userId: users[0]._id,
      views: 9800,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-21"),
      comments: [],
    },
    {
      title: "CSS Flexbox in Depth",
      imgUrl: "https://i.ytimg.com/vi/JJSoEo8JSnc/maxresdefault.jpg",
      videoUrl: "/uploads/program1.mp4",
      desc: "Deep dive into CSS Flexbox layout system. Learn how to create responsive, flexible layouts with ease. We'll cover flex containers, flex items, alignment properties, and real-world examples that will transform your CSS skills.",
      tags: ["CSS"],
      userId: users[0]._id,
      views: 7200,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-22"),
      comments: [],
    },
    // Bob's videos
    {
      title: "Epic Game Walkthrough",
      imgUrl:
        "https://cdn.mos.cms.futurecdn.net/9xBT864XC3j5wcZRPgQapa-1200-80.png",
      videoUrl: "/uploads/game.mp4",
      desc: "Complete walkthrough of an epic gaming adventure with strategy tips and hidden secrets. Watch as we navigate through challenging levels, defeat powerful bosses, and discover all the game's hidden content and achievements.",
      tags: ["Gaming"],
      userId: users[1]._id,
      views: 8000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-23"),
      comments: [],
    },
    {
      title: "Top 10 Gaming Moments",
      imgUrl: "https://i.ytimg.com/vi/dYuv7oHBlD4/maxresdefault.jpg",
      videoUrl: "/uploads/game.mp4",
      desc: "Compilation of the most incredible gaming moments and achievements. From epic boss battles to unexpected glitches, these are the moments that make gaming unforgettable. Each clip showcases skill, luck, and pure entertainment.",
      tags: ["Gaming"],
      userId: users[1]._id,
      views: 12000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-24"),
      comments: [],
    },
    {
      title: "How to Speedrun Minecraft",
      imgUrl:
        "https://images.squarespace-cdn.com/content/v1/64c947429e47b803dc16c2cc/1727314972124-0CGVGGY1LN4Q97B8P1U2/Minecraft-Legends-vs-Minecraft-Dungeons-Which-Spinoff-Is-Right-For-You-Dungeons-and-Legends-Side-By-.jpg",
      videoUrl: "/uploads/game.mp4",
      desc: "Complete guide to speedrunning Minecraft from world generation to defeating the Ender Dragon. Learn optimal routes, resource gathering strategies, and advanced techniques used by professional speedrunners to achieve record times.",
      tags: ["Internshala"],
      userId: users[1]._id,
      views: 15000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-25"),
      comments: [],
    },
    // Charlie's videos
    {
      title: "A Day in My Life",
      imgUrl: "https://i.ytimg.com/vi/be80VTMSBlY/maxresdefault.jpg",
      videoUrl: "/uploads/game.mp4",
      desc: "Authentic vlog showing a typical day in my life as a content creator. From morning routines to evening editing sessions, get an inside look at the daily challenges and joys of being a full-time YouTuber and digital creator.",
      tags: ["Songs"],
      userId: users[2]._id,
      views: 5000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-26"),
      comments: [],
    },
    {
      title: "Travel Vlog: Japan",
      imgUrl: "https://i.ytimg.com/vi/QPcwfuStFnU/maxresdefault.jpg",
      videoUrl: "/uploads/sample.mp4",
      desc: "Immersive travel experience through Japan's most beautiful locations. From bustling Tokyo streets to serene Kyoto temples, experience the culture, food, and people that make Japan such a fascinating destination for travelers.",
      tags: ["Travel"],
      userId: users[2]._id,
      views: 11000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-27"),
      comments: [],
    },
    {
      title: "How I Edit My Videos",
      imgUrl:
        "https://images.squarespace-cdn.com/content/v1/5d09a4357acd2200011a3249/1588384518066-CXW44ELZJ45NQKJ57CYV/Untitled_Artwork+5.jpg",
      videoUrl: "/uploads/sample.mp4",
      desc: "Behind-the-scenes look at my video editing workflow and techniques. Learn about software choices, editing strategies, color grading, and the creative process that goes into making engaging content for YouTube and social media.",
      tags: ["Internshala"],
      userId: users[2]._id,
      views: 3000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-28"),
      comments: [],
    },
    // 6 more videos
    {
      title: "Node.js Crash Course",
      imgUrl: "https://i.ytimg.com/vi/fBNz5xF-Kx4/maxresdefault.jpg",
      videoUrl: "/uploads/program2.mp4",
      desc: "Complete Node.js tutorial for building server-side applications. Learn about modules, Express framework, middleware, and database integration. Perfect for developers who want to create robust backend services and APIs.",
      tags: ["NodeJs"],
      userId: users[0]._id,
      views: 8500,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-29"),
      comments: [],
    },
    {
      title: "Python for Beginners",
      imgUrl: "https://i.ytimg.com/vi/_uQrJ0TkZlc/maxresdefault.jpg",
      videoUrl: "/uploads/program1.mp4",
      desc: "Comprehensive Python programming tutorial for absolute beginners. Cover syntax, data structures, functions, and object-oriented programming. Build your first projects and understand why Python is perfect for beginners and professionals alike.",
      tags: ["JavaScript"],
      userId: users[2]._id,
      views: 9200,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-09-30"),
      comments: [],
    },
    {
      title: "How to Build a REST API",
      imgUrl: "https://i.ytimg.com/vi/l8WPWK9mS5M/maxresdefault.jpg",
      videoUrl: "/uploads/program1.mp4",
      desc: "Step-by-step guide to creating RESTful APIs with proper HTTP methods, status codes, and authentication. Learn best practices for API design, documentation, and testing. Build APIs that are scalable, secure, and easy to maintain.",
      tags: ["NodeJs"],
      userId: users[1]._id,
      views: 6700,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-10-01"),
      comments: [],
    },
    {
      title: "Vue.js vs React: Which to Choose?",
      imgUrl: "https://i.ytimg.com/vi/nhBVL41-_Cw/maxresdefault.jpg",
      videoUrl: "/uploads/program1.mp4",
      desc: "Detailed comparison of Vue.js and React frameworks for modern web development. Explore syntax differences, learning curves, ecosystem maturity, and use cases. Make an informed decision about which framework best suits your project needs.",
      tags: ["React"],
      userId: users[2]._id,
      views: 5400,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-10-02"),
      comments: [],
    },
    {
      title: "How to Make a Portfolio Website",
      imgUrl: "https://i.ytimg.com/vi/gYzHS-n2gqU/maxresdefault.jpg",
      videoUrl: "/uploads/sample.mp4",
      desc: "Complete guide to building a professional portfolio website that showcases your skills and projects. Learn responsive design, modern CSS techniques, and how to integrate with databases. Create a portfolio that stands out to potential employers.",
      tags: ["MongoDB"],
      userId: users[1]._id,
      views: 7800,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-10-03"),
      comments: [],
    },
    {
      title: "Best Free Coding Resources",
      imgUrl: "https://i.ytimg.com/vi/8mAITcNt710/maxresdefault.jpg",
      videoUrl: "/uploads/program2.mp4",
      desc: "Curated list of the best free resources for learning programming and web development. From interactive tutorials to documentation and community forums, discover tools that will accelerate your learning journey without breaking the bank.",
      tags: ["React"],
      userId: users[0]._id,
      views: 6100,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-10-04"),
      comments: [],
    },
    // 5 NEW VIDEOS WITH HALF DESCRIPTIONS
    {
      title: "Complete Web Development Bootcamp 2024",
      imgUrl: "https://i.ytimg.com/vi/8jLOx1hD3_o/maxresdefault.jpg",
      videoUrl: "/uploads/program2.mp4",
      desc: "Comprehensive web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, and MongoDB. Learn to build full-stack applications from scratch with modern tools and best practices. Perfect for beginners and intermediate developers looking to upgrade their skills.",
      tags: ["React", "NodeJs", "MongoDB"],
      userId: users[0]._id,
      views: 25000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-10-05"),
      comments: [],
    },
    {
      title: "Advanced Machine Learning with Python",
      imgUrl: "https://i.ytimg.com/vi/KNAWp2S3w94/maxresdefault.jpg",
      videoUrl: "/uploads/program2.mp4",
      desc: "Deep dive into machine learning algorithms and neural networks using Python. Cover supervised and unsupervised learning, model evaluation, and real-world applications. Build projects including recommendation systems and image classifiers.",
      tags: ["JavaScript"],
      userId: users[1]._id,
      views: 18000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-10-06"),
      comments: [],
    },
    {
      title: "Mobile App Development: React Native Masterclass",
      imgUrl: "https://i.ytimg.com/vi/VozPNrt-LfE/maxresdefault.jpg",
      videoUrl: "/uploads/program2.mp4",
      desc: "Complete React Native course for building cross-platform mobile applications. Learn navigation, state management, native modules, and deployment to iOS and Android stores. Build real-world apps including social media and e-commerce platforms.",
      tags: ["React", "JavaScript"],
      userId: users[2]._id,
      views: 22000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-10-07"),
      comments: [],
    },
    {
      title: "DevOps and CI/CD Pipeline Mastery",
      imgUrl:
        "https://cdn.prod.website-files.com/64b7ba4dc9375b7b74b2135e/67320126e90b62ef85b344d7_673200757b1948ea809a9a67_IMG%2520-%25201.jpeg",
      videoUrl: "/uploads/sample.mp4",
      desc: "Master DevOps practices and CI/CD pipeline implementation. Learn Docker, Kubernetes, cloud deployment, and monitoring tools. Build automated testing and deployment workflows for scalable, maintainable software delivery.",
      tags: ["NodeJs"],
      userId: users[0]._id,
      views: 16000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-10-08"),
      comments: [],
    },
    {
      title: "Blockchain Development: From Zero to Hero",
      imgUrl: "https://i.ytimg.com/vi/gyMwXuJrbJQ/maxresdefault.jpg",
      videoUrl: "/uploads/program2.mp4",
      desc: "Complete blockchain development course covering Ethereum, Solidity, and smart contracts. Learn to build DApps, DeFi protocols, and NFT marketplaces. Understand Web3.js integration and security best practices for blockchain applications.",
      tags: ["JavaScript", "MongoDB"],
      userId: users[1]._id,
      views: 19000,
      likes: [],
      dislikes: [],
      createdAt: new Date("2024-10-09"),
      comments: [],
    },
  ]);

  // 4. Create dummy comments from all users for each video
  const comments = [];

  videos.forEach((video, videoIndex) => {
    // Add 2-4 comments per video from different users
    const commentCount = Math.floor(Math.random() * 3) + 2; // 2-4 comments

    for (let i = 0; i < commentCount; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const commentTexts = [
        // Helpful/learning comments
        "Great video! Really helped me understand the concepts better.",
        "Thanks for sharing this tutorial, it's exactly what I was looking for!",
        "This is so well explained. You make complex topics seem simple!",
        "Your explanations are crystal clear. Much appreciated!",
        "The code examples are so helpful. Thanks for sharing!",
        "Excellent tutorial! The step-by-step approach is perfect for beginners.",
        "I've watched a lot of videos on this, and this one finally made sense.",
        "You just saved me a ton of time. Subscribed instantly!",
        "Love how you break everything down so clearly.",
        "Finally, something I can actually follow. Thanks!",

        // Casual/general engagement comments
        "Who's watching this in 2025? 😂",
        "Here before this blows up! 🔥",
        "The background music is kinda vibey ngl.",
        "Anyone else paused and rewound like 10 times? 😅",
        "Why does this voice sound like Morgan Freeman on 1.25x speed?",
        "I came for the tutorial, stayed for the jokes 😄",
        "This needs more views. Seriously.",
        "My dog was watching with me and even he understood lol.",
        "Loving the energy in this video!",
        "Okay but the editing here is clean af 🔥",

        // Funny/random/off-topic
        "Not me watching this at 3am with zero context.",
        "I don't even need this info, it just looked interesting.",
        "BRB showing this to my cat 🐱",
        "I clicked this accidentally and now I'm learning things 😅",
        "Imagine explaining this to your grandma.",
        "Me: 'I'll just watch for 5 mins' — 30 mins later: *still here*",
        "This comment section is wild 😂",
        "Anyone else eating while watching this?",
        "I feel like I'm learning and getting entertained at the same time.",
        "The way you said 'let's begin' felt like a threat 💀",

        // Emoji/short-form responses
        "🔥🔥🔥",
        "LEGEND 🙌",
        "Too good!",
        "W video fr",
        "Instant classic 👏",
        "Subscribed. No regrets.",
        "💯💯💯",
        "Thanks man ❤️",
        "Nice one!",
        "Sheesh 😮‍💨",
      ];

      const randomComment =
        commentTexts[Math.floor(Math.random() * commentTexts.length)];

      comments.push({
        userId: randomUser._id.toString(),
        videoId: video._id.toString(),
        desc: randomComment,
        createdAt: new Date(
          video.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
        ), // Random time within a week of video creation
      });
    }
  });

  await Comment.insertMany(comments);

  // 5. Create dummy history entries
  const historyEntries = [];

  // Add some videos to each user's history
  users.forEach((user, userIndex) => {
    // Each user watches 3-5 random videos
    const videosToWatch = videos.slice(userIndex * 3, (userIndex + 1) * 3 + 2);

    videosToWatch.forEach((video, index) => {
      historyEntries.push({
        userId: user._id.toString(),
        videoId: video._id.toString(),
        watchedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ), // Random time within last week
        watchDuration: Math.floor(Math.random() * 300) + 60, // Random duration 60-360 seconds
      });
    });
  });

  await History.insertMany(historyEntries);

  console.log("Dummy users, channels, videos, comments, and history inserted!");
  mongoose.disconnect();
}

seed();
