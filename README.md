# 🚀 Smart Hire

**An AI-Powered Recruitment and Workforce Management System**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://www.mongodb.com/mern-stack)
[![AI Powered](https://img.shields.io/badge/AI-Powered-blue.svg)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

---

## 🎯 About the Project

**Smart Hire** is an intelligent web-based platform that transforms how organizations handle recruitment and employee management. By leveraging artificial intelligence and modern web technologies, Smart Hire automates the entire hiring process—from job posting to candidate evaluation—while providing comprehensive HR management tools for day-to-day operations.

The system combines **AI-driven recruitment** with a complete **Human Resource Management System (HRMS)**, offering a unified solution for modern enterprises looking to streamline their workforce operations.

---

## ❓ Problem Statement

Organizations today face several critical challenges in recruitment and HR management:

### Recruitment Challenges
- **Time-Consuming Hiring Process**: Manual screening of hundreds of resumes and conducting interviews takes weeks
- **Inconsistent Evaluation**: Different interviewers may assess candidates differently, leading to biased decisions
- **Resource Intensive**: HR teams spend countless hours on repetitive tasks like scheduling, question preparation, and candidate communication
- **Limited Scalability**: Traditional methods can't efficiently handle high-volume hiring

### HR Management Challenges
- **Fragmented Systems**: Organizations use multiple disconnected tools for attendance, payroll, performance tracking, and document management
- **Manual Data Entry**: Prone to errors and time wastage
- **Lack of Real-Time Insights**: Difficulty in tracking employee performance and organizational metrics
- **Poor Employee Experience**: Employees struggle with accessing their information, tasks, and policies

---

## 💡 Solution

Smart Hire addresses these challenges by providing an **all-in-one AI-powered platform** that:

### For Recruitment
✅ **Automates Interview Process**: AI generates job-specific questions and conducts voice-based interviews  
✅ **Eliminates Bias**: Standardized AI evaluation ensures fair assessment of all candidates  
✅ **Saves Time**: Reduces hiring time from weeks to days with automated screening and evaluation  
✅ **Scales Effortlessly**: Handle hundreds of candidates simultaneously with AI interviewers  
✅ **Provides Insights**: AI-generated summaries help HR make data-driven hiring decisions

### For HR Management
✅ **Unified Platform**: Single system for attendance, payroll, performance, tasks, and documents  
✅ **Automation**: Automatic attendance tracking, salary calculations, and report generation  
✅ **Real-Time Analytics**: Live dashboards for monitoring organizational metrics  
✅ **Employee Self-Service**: Employees can access their information, submit documents, and track tasks independently  
✅ **SaaS Model**: Flexible subscription plans suitable for businesses of all sizes

---

## ✨ Key Features

### 🤖 AI-Powered Recruitment

| Feature | Description |
|---------|-------------|
| **Smart Job Descriptions** | AI generates comprehensive job descriptions based on role requirements |
| **Intelligent Question Generation** | Context-aware interview questions tailored to each position |
| **Voice-Based AI Interviews** | Real-time conversational interviews with speech recognition |
| **Automated Evaluation** | AI analyzes responses and generates candidate summaries |
| **Resume Matching** | AI-powered matching between candidate profiles and job requirements |
| **Interview Recording** | Save and review interview sessions for compliance and analysis |

### 👥 Complete HRMS

| Feature | Description |
|---------|-------------|
| **Employee Management** | Complete lifecycle management from onboarding to exit |
| **Attendance Tracking** | Automated check-in/check-out with real-time monitoring |
| **Payroll Management** | Automatic salary calculation, deductions, and payment processing |
| **Performance Tracking** | Monitor KPIs, goals, and employee performance metrics |
| **Task Management** | Assign, track, and manage tasks across teams |
| **Document Storage** | Centralized repository for employee documents and files |
| **Policy Management** | Publish and manage company policies, announcements, and guidelines |

### 🎛️ Role-Based Access

- **Admin Dashboard**: Full system control, user management, analytics, and configuration
- **HR Dashboard**: Recruitment pipeline, employee management, and HR operations
- **Employee Dashboard**: Personal information, tasks, attendance, salary, and documents

### 💳 SaaS Features

- Multi-tier subscription plans (Basic, Professional, Enterprise)
- Secure payment processing via Stripe
- Usage analytics and billing management
- Organization-level account management

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern, component-based UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Material-UI / Tailwind CSS** - Responsive UI components

### Backend
- **Node.js** - JavaScript runtime for server-side logic
- **Express.js** - Fast, minimalist web framework
- **Socket.io** - Real-time bidirectional communication
- **Mediasoup** - WebRTC media server for voice streaming

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - Elegant MongoDB object modeling

### AI & Voice Processing
- **Groq / OpenAI API** - AI question generation and interview analysis
- **Whisper / AssemblyAI** - Speech-to-text conversion
- **eSpeakNG / TTS API** - Text-to-speech synthesis
- **Tesseract.js** - OCR for resume parsing

### Security & Authentication
- **JWT** - Secure token-based authentication
- **Bcrypt** - Password hashing and encryption

### Payment Integration
- **Stripe API** - Subscription and payment processing

### Additional Tools
- **Multer** - File upload handling
- **Nodemailer** - Email notifications
- **Dotenv** - Environment configuration

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB Atlas** account - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adnan-Asad1/Smart-Hire-.git
   cd Smart-Hire-
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your API endpoint
   
   npm start
   ```

### Environment Configuration

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

## 💻 Usage

### For HR Professionals

1. **Post a Job**
   - Create job posting with requirements
   - AI generates job description automatically
   - Set interview parameters

2. **Conduct AI Interviews**
   - AI generates relevant interview questions
   - Candidates complete voice-based interviews
   - System records and transcribes responses

3. **Review Candidates**
   - Access AI-generated candidate summaries
   - Compare evaluation scores
   - Make data-driven hiring decisions

4. **Manage Employees**
   - Onboard new hires
   - Track attendance and performance
   - Process payroll and manage documents

### For Administrators

1. **System Configuration**
   - Manage user roles and permissions
   - Configure organizational settings
   - Set up subscription plans

2. **Analytics & Reporting**
   - Monitor recruitment metrics
   - Track HR operations
   - Generate custom reports

### For Employees

1. **Personal Dashboard**
   - View personal information
   - Track assigned tasks
   - Monitor attendance records

2. **Self-Service**
   - Submit documents
   - View salary slips
   - Access company policies

---

## 📁 Project Structure

```
Smart-Hire/
├── backend/
│   ├── config/          # Database and API configurations
│   ├── controllers/     # Request handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication, validation
│   ├── services/        # AI and external services
│   ├── utils/           # Helper functions
│   └── server.js        # Application entry point
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API integration
│   │   ├── context/     # State management
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Root component
│   └── package.json
│
├── docs/                # Documentation
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

---

## 👥 Team

Developed by students from the **University of Gujrat**:

| Name | Role |
|------|------|
| **Adnan Asad** | Backend Development (Admin & Employee), Database, Testing & Deployment |
| **Shiraz Nadeem** | Backend Development (HR), AI Integration, API Development |
| **Abdul Rehman** | Frontend Development, UI/UX Design, Dashboard Implementation |

**Supervisor**: Mr. Zafar Mehmood Khatak  
**Institution**: Department of Computer Science, University of Gujrat, Pakistan

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Adnan Asad** - [GitHub Profile](https://github.com/Adnan-Asad1)

**Project Repository**: [https://github.com/Adnan-Asad1/Smart-Hire-](https://github.com/Adnan-Asad1/Smart-Hire-.git)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the Smart Hire Team

</div>
