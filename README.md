# Second-Hand Book Marketplace

Welcome to the Second-Hand Book Marketplace! This platform allows users to buy and sell second-hand books at 50% of the original price. 

## Features

- **Buy and Sell Books:** Users can list their used books for sale and browse books available for purchase.
- **Discounted Prices:** All books are sold at half their original price, making reading more affordable.
- **User Authentication:** Secure user login and registration.
- **Responsive Design:** Seamless experience on all devices.

## Technologies Used

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js
- MongoDB

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/second-hand-book-marketplace.git
    cd second-hand-book-marketplace
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env.local` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_uri
    NEXT_PUBLIC_API_URL=your_api_url
    ```

4. **Run the development server:**
    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- **Listing a Book:** Navigate to the 'Sell' page, fill in the book details, and submit.
- **Buying a Book:** Browse the available books, add to cart, and proceed to checkout.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)