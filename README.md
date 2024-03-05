
# Food Delivery App

## Application Features:

1. **User Login and Registration**: Users can log in or register new accounts in the application.
2. **Browsing Restaurant Menus**: Users can browse the available restaurant menus and detailed information.
3. **Menu Filtering**: Users can filter the menu using the search bar on the main page.
4. **Adding Dishes to the Cart**: Users can add selected dishes to the shopping cart.
5. **Placing an Order**: Users can place an order by selecting dishes from the cart and specifying preferred payment and delivery methods. (to be added)
6. **Adding, Removing, and Editing Dishes**: Users can add new dishes to the restaurant's menu, remove existing dishes, and edit their details, such as name, description, price, etc.

## Programming Approaches and Project Structure:

1. **Modularity of Components**: The Ionic project is based on a modular structure of Angular components. Each application functionality is divided into separate components to increase code readability and ease of management.
2. **Use of Services**: The business logic of the application is separated into distinct services, allowing for code reuse and separating the presentation layer from the application logic.
3. **Server Communication**: The application communicates with the PostgreSQL server through appropriate HTTP queries. Angular modules like HttpClient are used to handle HTTP requests.
4. **Routing**: The application uses Angular's routing module to manage navigation between different application views.
5. **State Management**: Angular RxJS is used for managing the application's state and passing data between components.
6. **AuthGuard**: AuthGuard is used in the project to control access to different parts of the application based on the user's authentication status.
7. **Compliance with Angular Design Principles**: The project aims to adhere to Angular's best programming practices, such as using design patterns, dependency injection, avoiding duplicate code, etc.

## Technologies Used:

1. **Ionic Framework**: Used for building the user interface and managing navigation in the mobile application.
2. **Angular**: Angular is used as the framework for creating web applications, providing modularity and scalability of the code.
3. **PostgreSQL**: Database management system used for storing data about restaurants, menus, orders, etc.
4. **HTML/CSS/JavaScript**: Standard web technologies used to create the user interface and implement application logic.
5. **TypeScript**: Used as a programming language that extends JavaScript by adding static typing, improving code performance, and readability.

## Installation Guide:

To get the project up and running on your local machine for development and testing purposes, follow these steps:

1. **Clone the repository**

2. **Navigate to the project directory**

4. **Install Angular and Ionic**:
```bash
npm install @angular/cli
```
```bash
npm install @ionic/cli
```

3. **Install dependencies**:
```bash
npm install
```

4. **Install postgresql and setup in main/connection.js**

5. **Run api.js file**:
```bash
node api.js
```

6. **Start the development server**:
```bash
ionic serve
```

This commands will launch the app in your default web browser. You can now develop and test your application in a local environment.