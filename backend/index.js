const express = require("express");
const cors=require("cors");
const rootRouter=require("./routes/index")
const app=express();

//Information about backend routes and frontend(react) routes
/**
 * Express routes and React routes serve different purposes in web 
 * development, and understanding their distinction is important. Here's a 
 * breakdown of how they differ and what's visible to the user:

1. **Express Routes:**
   - **Backend Routes:** Express is a Node.js web application framework 
    that is used for setting up server-side routes and APIs. Express 
    routes handle HTTP requests (GET, POST, PUT, DELETE, etc.) on the 
    server-side.
   - **Data Handling:** They are typically used for accessing databases, 
    performing server-side logic, and returning data to the client.
   - **Invisible to Users:** Express routes are not directly visible to 
    the end-users. Users interact with these routes indirectly through 
    the frontend interface, such as when submitting a form or requesting 
    data.

2. **React Routes:**
   - **Frontend Routes:** React Router is a library for routing in React 
    applications. It enables navigation between different components in a 
    single-page application (SPA) without refreshing the page.
   - **Client-Side Rendering:** React Router handles the client-side 
    rendering of components based on the URL. It makes the app feel more 
    like a native application.
   - **Visible to Users:** React routes are visible to the users as they 
    are part of the URL in the browser. When a user navigates through the 
    site, the URL changes to reflect the current route (e.g., `/home`, 
    `/about`), and the corresponding component is rendered.

**What's Visible to the User?**
- The user will see the React routes in the browser's address bar as they 
navigate through different parts of the SPA. These routes correspond to 
different views or components in the React application.
- Express routes, on the other hand, work in the background. Users interact 
with them indirectly when data is sent to or received from the server, but 
they don't see these routes in the browser's address bar.

In summary, React Router deals with the client-side (visible to the user), 
enabling navigation between different parts of the React application 
without page refreshes. Express routes handle server-side requests and 
responses (invisible to the user), managing data exchange, API requests, 
and other server-side functionalities.
 */
app.use(cors());
app.use(express.json());

//This  below line of code instructs the Express application to 
//use the router for any paths that start with "/api/v1". It 
//effectively sets a base path for all the routes defined in the 
//router. For example, if there is a route in the router defined 
//as "/users", it will be accessible at "/api/v1/users".
app.use("/api/v1",rootRouter);


const port=3000;

app.listen(port);