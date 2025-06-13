# Visiogen AI

## Introduction

Visiogen is a cutting-edge AI-powered platform that revolutionizes the way we create and manipulate digital imagery. Born from the intersection of artificial intelligence and creative design, Visiogen empowers users to transform their imagination into stunning visual content with just a few clicks.

Whether you're a professional designer seeking to streamline your workflow, a content creator looking for unique visuals, or simply an enthusiast exploring the possibilities of AI art, Visiogen provides the tools you need to bring your creative vision to life. Our platform leverages the latest advancements in machine learning and computer vision to offer an intuitive, accessible, and powerful image generation experience.

With Visiogen, the barrier between imagination and creation has never been thinner. Welcome to the future of visual content creation.

![Visiogen AI Screenshot](https://github.com/user-attachments/assets/a5664d39-25c2-4ea3-b8af-20d86b0ca0ea)

## Profile
![Profile](https://github.com/user-attachments/assets/e706022f-2de0-4760-97a3-db342482bd33)

## 🌟 Features

- **AI Image Generation**: Create stunning images from text descriptions using state-of-the-art AI models
- **AI Prompt Enhancer**: Transform basic ideas into detailed, optimized prompts that generate better results
- **User Authentication**: Secure login and registration system
- **Gallery Management**: Save, organize, your generated images
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Export Options**: Download images in various formats and resolutions

## 🚀 Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **UI Components**: Tailwind CSS, Framer Motion
- **Database**: PostgresSQL (Prisma ORM), Neon DB
- **Authentication**: Next-auth
- **AI Integration**: Pollination.ai
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- API keys for the AI services used

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abhishek83gupta/Visiogen.git
   cd Visiogen
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     DATABASE_URL=
     
     GOOGLE_CLIENT_ID=
     GOOGLE_CLIENT_SECRET=
     
     GITHUB_ID=
     GITHUB_SECRET=
     
     NEXT_PUBLIC_API_URL=
     NEXT_PUBLIC_HOSTNAME=
     NEXTAUTH_SECRET=
     API_URL=
     ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server in a new terminal
   cd client
   npm start
   ```

## 🖥️ Usage

1. Register a new account or log in with existing credentials
2. Navigate to the image generation page
3. Enter a detailed text description of the image you want to create
4. Adjust settings like image size, style, and other parameters
5. Generate your image and wait for the AI to process your request
6. Save your generated image to your gallery or download it directly

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ by Abhishek Gupta</p>

