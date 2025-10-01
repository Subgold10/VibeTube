## VibeTube (YouTube Clone)

SUBHA GOLDAR
** Internship Assignment Project **

A full-stack YouTube clone built with the MERN stack (MongoDB, Express, React, Node.js).

---

## GitHub - https://github.com/Subgold10/VibeTube.git

## Demo Video -

1.  https://screenrec.com/share/ytHUme3uOW
2.  https://drive.google.com/file/d/1s4uNFCUAPZmMbILn62PTW3lqbZd64tAQ/view?usp=sharing

## Features

VibeTube is a modern YouTube clone that lets you:

- **Browse and Search Videos:**

  - Home page with a responsive video grid, category filter buttons, and a YouTube-style header/sidebar.
  - Search for videos by title or tags.
  - View trending videos and get recommendations based on tags.

- **Authentication:**

  - Sign up and log in securely using JWT (stored in HTTP-only cookies).
  - Dynamic header and sidebar based on authentication state.

- **Video Management:**

  - Upload new videos with thumbnail images (files saved in `server/uploads/`).
  - Watch videos in a built-in player, like/dislike, and comment.
  - Edit or delete your own videos (deletes files from server).
  - See all videos you have uploaded in your profile/channel page.

- **Channel & Profile Management:**

  - Create your own channel after signing in.
  - Edit your channel details and banner.
  - View and manage all videos uploaded to your channel.
  - Edit your user profile and profile picture.

- **Subscriptions:**

  - Subscribe or unsubscribe to channels with one click.
  - See a feed of videos from your subscribed channels.
  - View your list of subscriptions in your profile.

- **Watch History:**

  - Adds Dummy History for the # Dummy users.
  - Automatically track videos you watch.
  - View your watch history and clear it at any time.

- **Community Features:**

  - Comment on videos, delete your own comments.
  - Like or dislike videos (one per user per video).

- **Recommendations & Trending:**

  - Get video recommendations based on tags.
  - Browse trending videos (most viewed in the last 7 days).

- **Modern UI & UX:**

  - Fully responsive for mobile, tablet, and desktop.
  - Accessible design and keyboard navigation.
  - Customizable favicon/logo (`client/public/logo.png`).
  - Pagination and loading states for large video lists.
  - Friendly error handling and feedback messages.

- **Admin & Dummy Users:**

  - Comes with default users (admin, Alice, Bob, Charlie) for easy testing.
  - Seed the database to MongoDB Atlas with sample data using `seedDummyData.js`.

- **Robust Backend:**
  - RESTful API with JWT authentication.
  - All video/image uploads are cleaned up on delete.
  - API documentation included (`server/API_DOCUMENTATION.md`).

---

## Tech Stack

- **Frontend:** React, Redux, React Router, Axios, Tailwind CSS, MUI
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** JWT (HTTP-only cookies)

---

## Directory Structure

```
YouTube-Clone-main/
├── client/           # React frontend
│   ├── public/
│   │   ├── logo.png  # Tab favicon/logo
│   │   └── ...
│   ├── src/
│   └── ...
├── server/           # Express backend
│   ├── uploads/      # Uploaded video and image files
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── seedDummyData.js # Dummy data seeder
│   └── ...
└── README.md
```

---

## Environment Variables - .env files will not be deleted for easy project checking, but you can add another if needed.

### Client (`client/.env`)

```
VITE_API_URL=http://localhost:7272/api
```

### Server (`server/.env`)

```
PORT=7272
MONGO=your-mongodb-uri
JWT=your-secret-key

```

---

## Installation & Running

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Subgold10/VibeTube.git
   cd VibeTube
   ```

2. **Install server dependencies:**

   ```bash
   cd server
   npm install
   # Create .env as above
   npm start
   ```

3. **Update admin password (if needed):**

   ```bash
   # Run this to update existing admin password to secure version
   node updateAdminPassword.js
   ```

4. **Install client dependencies: In New Terminal**

   ```bash
   cd client
   npm install
   # Create .env as above
   npm run dev
   ```

If trying in same Terminal use

```bash
cd ../client
npm install
# Create .env as above
npm run dev
```

4. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:7272/api](http://localhost:7272/api)

---

## Seeding Dummy Data

To populate the database with sample users, channels, and videos:

1. Edit your `server/seedDummyData.js` if you want to customize data.
2. Run:
   ```bash
   node seedDummyData.js
   ```
3. This will clear existing data and insert:
   - Users: Alice, Bob, Charlie (see below)
   - Channels and videos for each user

**When to use:**

- On first setup
- If you want to reset the database to a known state

---

## Default/Dummy Users

After seeding, you can log in as:

| Username | Email               | Password          | Creation                     |
| -------- | ------------------- | ----------------- | ---------------------------- |
| admin    | admin@example.com   | Admin@Secure2024! | [Created when Server Starts] |
| Alice    | alice@example.com   | password123       | [Dummy User through seeding] |
| Bob      | bob@example.com     | password123       | [Dummy User through seeding] |
| Charlie  | charlie@example.com | password123       | [Dummy User through seeding] |

---

## Video Uploads

- **Any logged-in user can upload videos** (with thumbnail image).
- Uploaded files are saved in `server/uploads/`.
- When a video is deleted, its files are also deleted from the server.
- Only the uploader can delete their own videos.

---

## Tips & Notes

- If you get errors, try logging out and back in, or reseed the database.
- Make sure MongoDB is running and accessible.
- For development, use the provided dummy users for easy login.
- You can change the favicon/logo by replacing `client/public/logo.png`.
- All API endpoints are documented in `server/API_DOCUMENTATION.md`.
- Video title updates in the channel section now include proper error handling and success feedback.
- Admin password has been updated to a more secure version: `Admin@Secure2024!`

---

Enjoy using VibeTube! If you have issues, check the logs or open an issue.
