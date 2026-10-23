# Petal Bloom — Online Flower Shop

## 1. Project Overview

Petal Bloom is an online flower shop website. It helps customers view flowers, check prices, add flowers to a shopping bag, and place orders.

The website also has a management page where the owner can add, view, update, and delete flowers and manage customer orders.

## 2. Project Objectives

- Build a simple and user-friendly online flower shop.
- Allow customers to browse flowers and prices.
- Add a shopping bag with quantity and total price.
- Allow customers to place orders.
- Manage flower products using CRUD operations.
- Use APIs to send and receive data.
- Test the JavaScript code.
- Make the website work on different screen sizes.

## 3. Technologies Used

### HTML
HTML creates the structure of the website, including headings, buttons, images, and sections.

### CSS
CSS controls the appearance of the website, including colours, fonts, spacing, and layout.

### JavaScript
JavaScript makes the website interactive. It handles shopping bag actions, calculations, and communication with APIs.

### JSON Server
JSON Server provides a simple backend API. It manages flower products and customer orders using data stored in `db.json`.

### DummyJSON API
DummyJSON is an external API used to demonstrate how to fetch data from another service. Its beauty category returns cosmetics, not flowers.

### Jest
Jest is used to run automated tests that check whether selected JavaScript functions work correctly.

### Git and GitHub
Git tracks changes to the project. GitHub hosts the code online and supports collaboration and project management.

## 4. Main Features

- Browse flower products and prices.
- Add flowers to a shopping bag.
- Calculate the shopping bag total.
- Place customer orders.
- Add new flowers.
- View existing flowers.
- Update flower details.
- Delete flowers.
- View and update order statuses.

## 5. How the Website Works

Customers open the shop page and browse available flowers. They can add flowers to their shopping bag and see the total price.

When a customer places an order, the website sends the order information to the backend API.

The owner can open the management page to maintain flower products and manage orders.

## 6. API Endpoints

The local JSON Server uses these endpoints:

- Flowers: `http://localhost:3001/flowers`
- Orders: `http://localhost:3001/orders`

These local URLs work on the development computer. A deployed application will need the deployed backend API URL.

## 7. HTTP Methods

- **GET:** Retrieves data.
- **POST:** Creates new data.
- **PUT:** Replaces or updates a complete record.
- **PATCH:** Updates part of a record.
- **DELETE:** Removes a record.

These methods allow the application to communicate with the backend and perform data operations.

## 8. Testing

The project uses Jest for automated testing.

Run the tests with:

`npm test`

To view test coverage, run:

`npm test -- --coverage`

The last recorded test run passed nine tests. The reported coverage was 100% for statements and lines, 100% for functions, and 85.71% for branches in the measured test scope. This does not mean that every part of the whole website has been tested.

## 9. Local Setup Instructions

1. Install Node.js and npm.
2. Open the project folder in the terminal.
3. Install dependencies using `npm install`.
4. Start JSON Server using `npx json-server db.json --port 3001`.
5. Open `index.html` using VS Code Live Server.
6. Open `admin.html` to access flower and order management.

## 10. Main Project Files

- `index.html` — customer-facing shop page.
- `style.css` — main shop styling.
- `script.js` — customer shop functionality and API integration.
- `admin.html` — management page.
- `admin.css` — management page styling.
- `admin.js` — flower and order management.
- `flower-utils.js` — reusable flower validation and shopping bag functions.
- `db.json` — local flower and order data.
- `test/flowers.test.js` — automated tests.

## 11. GitHub and Version Control

Git records changes made during development. Each commit saves a record of a change.

GitHub stores the repository online. Branches allow changes to be developed separately, and pull requests allow changes to be reviewed before merging.

The project repository, project board, branches, pull requests, and required commits should be checked against the course requirements.

## 12. Responsive Design

Responsive design means the website adjusts to different screen sizes, such as computers, tablets, and mobile phones.

The website should be checked at different screen sizes to confirm that the text, images, navigation, and buttons remain usable.

## 13. Figma Wireframe

A wireframe is a simple plan of a website layout before or during implementation. The desktop wireframe should show the main sections and how customers navigate the shop.

Figma wireframe link: To be added after the design is completed.

## 14. Deployment

Frontend URL: To be added after deployment.

Backend API URL: To be added after deployment.

The deployed frontend must use the deployed backend API rather than relying only on a local URL.

## 15. Possible Teacher Questions

### What is Petal Bloom?
Petal Bloom is an online flower shop where customers can browse flowers and place orders.

### Why did you choose this project?
I chose it to practise building a practical website with product management, shopping bag calculations, and orders.

### What is an API?
An API allows different parts of an application to communicate and exchange data.

### What is CRUD?
CRUD means Create, Read, Update, and Delete. These operations allow the owner to manage flower products.

### What is JSON Server?
JSON Server provides a simple backend API for storing and managing project data.

### What is data persistence?
Data persistence means that saved information remains available after refreshing the page or making another request.

### What is responsive design?
Responsive design allows a website to adapt to different screen sizes.

### Why did you use Jest?
I used Jest to test selected JavaScript functions and check that they work correctly.

### What is Git?
Git tracks changes made to the project over time.

### What is GitHub?
GitHub hosts the code online and helps manage the project repository.

### What is a wireframe?
A wireframe is a simple layout plan showing where website content and features will appear.

## 16. Project Status

Petal Bloom has working flower management, shopping bag calculations, and order features that have been tested during development. Automated tests have also been run successfully.

The remaining submission items must be completed and verified, including documentation, GitHub workflow requirements, deployment, responsive design checks, and the Figma wireframe.

## 17. Conclusion

Petal Bloom demonstrates how HTML, CSS, JavaScript, APIs, JSON Server, automated testing, and version control can be used to build an online flower shop. The project aims to provide a simple shopping experience while allowing the owner to manage flowers and orders.
