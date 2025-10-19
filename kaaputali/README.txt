Kaputali
Kaputali is a charming e-commerce website dedicated to handcrafted woolen flowers and home goods. Built with React and Vite, the site offers a clean, modern, and responsive user experience.

Features
1) Product Gallery: A beautiful grid of products with high-quality images.
2) Product Details Modal: A detailed view for each product, showcasing descriptions and additional images.
3) Contact Section: A dedicated section with social media links for customer inquiries.
4) Responsive Design: Optimized for seamless viewing on both desktop and mobile devices.

Technology Stack
1) React: A JavaScript library for building user interfaces.
2) Vite: A fast build tool for modern web projects.
3) CSS: For styling and layout.

Project Structure
    kaputali/
    ├── public/
    │   ├── assets/
    │   └── index.html
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── pages/
    │   └── styles/
    ├── .gitignore
    ├── firebase.json
    ├── package.json
    ├── README.md
    └── vite.config.js

Getting Started
Follow these steps to get a local copy of the project up and running.

Prerequisites
    Node.js (LTS version recommended)
    npm or yarn

Installation
1) Clone the repository:
    git clone [your-repository-url]

2) Navigate to the project directory:
    cd kaputali

3) Install the dependencies:
    npm install

Running Locally
To start the development server and view the project in your browser:

npm run dev

The app will be available at http://localhost:5173.

Building for Production
To create a production-ready build of the application:

npm run build

This will generate a dist folder containing all the static assets for deployment.

Deployment with Firebase
To deploy this project using Firebase Hosting, follow these steps:

1) Install Firebase CLI:
    npm install -g firebase-tools

2) Login to Firebase:
    firebase login

3) Deploy the project:
    firebase deploy --only hosting

Make sure your firebase.json file is configured correctly to serve the dist folder.

Author
Leejaw Chitrakar

Feel free to open an issue or submit a pull request if you have any suggestions or improvements.