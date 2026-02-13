# 🚀 Smart Hire

**An AI-Powered Recruitment and Workforce Management System**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://www.mongodb.com/mern-stack)
[![AI Powered](https://img.shields.io/badge/AI-Powered-blue.svg)](https://openai.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Team](#team)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Smart Hire** is an intelligent web-based platform that revolutionizes recruitment and human resource management by integrating AI-driven automation into one unified system. The platform automates job description creation, AI-powered question generation, and conducts virtual voice-based interviews while providing comprehensive HR management capabilities.

### 🎓 Academic Context

This project is developed as a **Final Year Project** at the **Department of Computer Science, University of Gujrat, Pakistan** under the supervision of **Mr. Zafar Mehmood Khatak**.

### 🌟 Key Highlights

- 🤖 **AI-Powered Interviews**: Automated voice-based interviews with intelligent question generation
- 📊 **Complete HRMS**: Attendance, payroll, performance tracking, and task management
- 🎯 **Resume Matching**: AI-driven candidate-to-job matching
- 💼 **SaaS Model**: Multi-tier billing and subscription management
- 🔐 **Role-Based Access**: Separate dashboards for Admin, HR, and Employees
- ☁️ **Cloud Integration**: Scalable architecture with modern cloud services

---

## ✨ Features

### 🎤 AI-Powered Recruitment

- **Automated Job Description Creation**: Generate comprehensive job descriptions using AI
- **AI Question Generation**: Context-aware interview questions based on job requirements
- **Voice-Based Interviews**: Real-time voice interaction with AI interviewer
- **Speech-to-Text Conversion**: Accurate transcription of candidate responses
- **AI Interview Summaries**: Automated evaluation and summary generation
- **Resume Parsing**: Extract and analyze candidate information from resumes

### 👥 HR Management System

- **Employee Management**: Complete employee lifecycle management
- **Attendance Tracking**: Automated attendance monitoring and reporting
- **Payroll Management**: Salary calculation and payment processing
- **Performance Tracking**: Monitor and evaluate employee performance
- **Task Assignment**: Assign and track tasks across teams
- **Document Storage**: Centralized document management system
- **Policy Management**: Company policies and guidelines repository

### 🎛️ Role-Based Dashboards

#### Admin Dashboard
- Organization-wide oversight and control
- User and role management
- System configuration and settings
- Analytics and reporting

#### HR Dashboard
- Recruitment pipeline management
- Interview scheduling and recording
- Candidate evaluation and selection
- Employee onboarding and management

#### Employee Dashboard
- Personal information and documents
- Task tracking and completion
- Salary and attendance records
- Policy and announcement access

### 💳 SaaS Features

- Multi-tier subscription plans
- Secure payment processing via Stripe
- Usage analytics and billing management
- Organization-level account management

---

## 🏗️ Architecture

Smart Hire follows a **three-tier MERN architecture** integrated with AI and voice processing technologies:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│              (React.js - Admin/HR/Employee UI)              │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Application Layer                         │
│         (Node.js + Express.js - Business Logic)             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           AI & Voice Processing Layer                │  │
│  │  • Groq/OpenAI - Question Generation & Summaries    │  │
│  │  • Whisper/AssemblyAI - Speech-to-Text              │  │
│  │  • TTS Engine - Text-to-Speech                      │  │
│  │  • Socket.io/Mediasoup - Real-time Voice Streaming  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                       Data Layer                             │
│        (MongoDB Atlas - Users, Interviews, HR Data)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - Component-based SPA with responsive UI
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Material-UI / Tailwind CSS** - UI component library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **Mediasoup** - WebRTC media server for voice streaming

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - MongoDB object modeling

### AI & Voice Processing
- **Groq / OpenAI** - AI question generation and interview analysis
- **Whisper / AssemblyAI** - Speech-to-text conversion
- **eSpeakNG / TTS API** - Text-to-speech synthesis
- **Tesseract.js** - OCR for document parsing

### Authentication & Security
- **JWT (JSON Web Tokens)** - Secure authentication
- **Bcrypt** - Password hashing and encryption

### Payment & Billing
- **Stripe API** - Payment processing and subscription management

### Additional Tools
- **Multer** - File upload handling
- **Nodemailer** - Email notifications
- **Dotenv** - Environment variable management

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account
- **Git**

### Clone the Repository

```bash
git clone https://github.com/Adnan-Asad1/Smart-Hire-.git
cd Smart-Hire-
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with your MongoDB URI, API keys, etc.

# Start the backend server
npm start
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with your API endpoint

# Start the development server
npm start
```

### Environment Variables

Create a `.env` file in both `backend` and `frontend` directories:

#### Backend `.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

#### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

---

## 🚀 Usage

### For HR Professionals

1. **Create Job Postings**: Define job requirements and descriptions
2. **Generate Interview Questions**: Use AI to create relevant questions
3. **Schedule Interviews**: Set up voice-based AI interviews
4. **Review Candidates**: Access AI-generated summaries and evaluations
5. **Manage Employees**: Handle onboarding, attendance, and payroll

### For Administrators

1. **Manage Organization**: Configure system settings and policies
2. **User Management**: Create and manage user roles
3. **Monitor Analytics**: Track recruitment and HR metrics
4. **Billing Management**: Handle subscriptions and payments

### For Employees

1. **View Dashboard**: Access personal information and tasks
2. **Track Attendance**: Monitor attendance records
3. **Submit Documents**: Upload required documentation
4. **View Salary**: Access payroll information

---

## 📁 Project Structure

```
Smart-Hire/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── services/        # AI and external services
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main app component
│   └── package.json
│
├── docs/                # Documentation
├── .gitignore
├── README.md
└── LICENSE
```

---

## 👥 Team

This project is developed by a team of three students from the **University of Gujrat**:

| Name | Registration # | Role |
|------|---------------|------|
| **Adnan Asad** | 22021519-071 | Admin & Employee Backend, Database, Testing & Deployment |
| **Shiraz Nadeem** | 22021519-115 | HR Backend, Database, AI Modules & API Integration |
| **Abdul Rehman** | 22021519-102 | Frontend Development, UI/UX Design, Dashboards |

**Supervisor**: Mr. Zafar Mehmood Khatak  
**Department**: Computer Science  
**Institution**: University of Gujrat, Punjab, Pakistan

---

## 🗓️ Roadmap

### Week 1-2: System Design & Setup ✅
- Architecture design
- UI/UX mockups
- Development environment setup

### Week 3-4: Core Recruitment System 🔄
- Authentication system
- Job posting module
- AI question generation

### Week 5-6: AI Voice Interview & HRMS 📅
- Voice-based interview implementation
- Attendance tracking
- Payroll management

### Week 7-8: SaaS Billing & Testing 📅
- Payment integration
- Admin control panel
- System testing and optimization

### Week 9-10: Deployment & Final Review 📅
- Cloud hosting and deployment
- Documentation finalization
- Final submission

---

## 🤝 Contributing

We welcome contributions to improve Smart Hire! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

For questions, suggestions, or collaboration opportunities:

- **Adnan Asad** - [GitHub](https://github.com/Adnan-Asad1)
- **Project Link**: [https://github.com/Adnan-Asad1/Smart-Hire-](https://github.com/Adnan-Asad1/Smart-Hire-.git)

---

## 🙏 Acknowledgments

- **University of Gujrat** - For providing the platform and resources
- **Mr. Zafar Mehmood Khatak** - For supervision and guidance
- **Department of Computer Science** - For academic support
- All open-source libraries and tools used in this project

---

## 📊 Project Statistics

- **Estimated Development Time**: 10 weeks
- **Estimated Cost**: PKR 21,000
- **Tech Stack**: MERN + AI
- **Target Audience**: HR departments, recruitment firms, enterprises

---

<div align="center">

**Made with ❤️ by the Smart Hire Team**

⭐ Star this repository if you find it helpful!

</div>
