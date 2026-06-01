# Ecommerce Site

A full-stack ecommerce application built with Node.js, Express, MongoDB, and vanilla CSS.

## Features

- **Product Management**: Browse products, search, and filter by category
- **Shopping Cart**: Add/remove products, update quantities
- **User Authentication**: Register, login, and manage profile
- **Order Management**: Place orders and track order history
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)

### Setup

1. Clone the repository
```bash
git clone <repo-url>
cd ecommerce-site
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
NODE_ENV=development
```

5. Start MongoDB service
```bash
# Linux/Mac
mongod

# Or use MongoDB Atlas (cloud)
```

6. Start the server
```bash
npm start

# Or with auto-reload (development)
npm run dev
```

7. Open browser and navigate to `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?search=query` - Search products
- `GET /api/products?category=category` - Filter by category
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId/add` - Add to cart
- `POST /api/cart/:userId/remove` - Remove from cart
- `POST /api/cart/:userId/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

## Sample Data

To add sample products to MongoDB:

```javascript
db.products.insertMany([
  {
    name: "Laptop",
    description: "High-performance laptop",
    price: 999.99,
    category: "Electronics",
    stock: 10,
    rating: 4.5
  },
  {
    name: "T-Shirt",
    description: "Comfortable cotton t-shirt",
    price: 19.99,
    category: "Fashion",
    stock: 50,
    rating: 4
  }
]);
```

## File Structure

```
ecommerce-site/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   └── app.js          # Frontend JavaScript
├── models/
│   ├── Product.js      # Product model
│   ├── User.js         # User model
│   └── Order.js        # Order model
├── routes/
│   ├── products.js     # Product routes
│   ├── users.js        # User routes
│   ├── cart.js         # Cart routes
│   └── orders.js       # Order routes
├── server.js           # Express server
├── package.json        # Dependencies
└── README.md           # This file
```

## Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Admin dashboard
- Product reviews and ratings
- Wishlist functionality
- Email notifications
- Inventory management
- Analytics and reporting

## License

ISC
