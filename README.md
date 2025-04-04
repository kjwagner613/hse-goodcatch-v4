# GoodCatch 

**GoodCatch** is a full-stack Node/Express app that empowers employees to document, track, and manage safety-related events in the workplace. Users can sign up, log in, and create detailed reports for incidents such as slips, spills, or unsafe storage — helping ensure workplace safety stays top priority.

---

## Features

- ✅ User Authentication (sign up, sign in, session-based auth)
- ✅ Create, Read, Update, Delete (CRUD) for safety events
- ✅ Events grouped by category and user
- ✅ Real-time search by site, department, category, or area
- ✅ Embedded event structure with `category` + `description`
- ✅ Clean, responsive design using CSS Grid & Flexbox
- ✅ Session-based access control (private dashboards)
- ✅ CSRF Protection for secure form submissions

---

## Technologies Used

- Node.js
- Express
- MongoDB + Mongoose
- EJS Templating
- bcrypt for password hashing
- express-session for session management
- csurf for CSRF protection
- dotenv for environment variables
- method-override for PUT/DELETE support

---

## Screenshots

![GoodCatch Dashboard](public/assets/screenshots/dashboard.png)
![Create Form](public/assets/screenshots/create-form.png)
![Search Results](public/assets/screenshots/search-results.png)

> (Drop your actual screenshots into the `/public/assets/screenshots` folder and update paths here)
