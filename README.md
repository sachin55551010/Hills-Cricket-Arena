<img width="1920" height="1080" alt="Screenshot (56)" src="https://github.com/user-attachments/assets/0b531ffc-6bb6-4f87-b99b-8ef183b7803e" />
<img width="1920" height="1080" alt="Screenshot (55)" src="https://github.com/user-attachments/assets/9f8bf1fa-03c0-48f3-8458-1e8a2ae43c82" />
<img width="1920" height="1080" alt="Screenshot (54)" src="https://github.com/user-attachments/assets/7eb7f678-2d73-4798-9e09-0054da34ec73" />
<img width="1920" height="1080" alt="Screenshot (53)" src="https://github.com/user-attachments/assets/6a3bd813-5082-4b6d-bab8-0fab47ff11c9" />
<img width="1920" height="1080" alt="Screenshot (52)" src="https://github.com/user-attachments/assets/585cd71a-5744-4310-aae4-50653d0c4db1" />
<img width="1920" height="1080" alt="Screenshot (51)" src="https://github.com/user-attachments/assets/a862a0a8-033e-4d3a-9818-5a17d67db1e1" />
<img width="1920" height="1080" alt="Screenshot (50)" src="https://github.com/user-attachments/assets/e935692a-d65c-4770-9185-2fd4eeace159" />
🏏 Cricket Tournament Management System
A full-stack web application built to manage cricket tournaments digitally — from player onboarding to team management and match scheduling — designed to solve the problem of discovering, joining, and organizing local tournaments from a single platform.

🚀 Features
🔐 Authentication
Google OAuth login
Secure JWT-based authentication
Automatic player profile creation on first login
👤 Player Profile
Editable player profile (photo, role, stats, contact info)
One player → one team per tournament (enforced at backend level)
🏆 Tournament Management
Any user can create a tournament and becomes the Organiser
Tournament details can be edited only before the tournament starts
Running or completed tournaments cannot be edited or deleted
👥 Team Management
Any logged-in user can add a team to a tournament
Team admin / organiser can:
Edit team details only before playing any match
Invite players via time-limited invite links (7 days expiry)
Backend restrictions prevent unfair team changes after matches
🗓 Match Scheduling
Organiser can schedule matches
Built-in validations:
Same team cannot play multiple matches simultaneously
Team composition locked once match is played
📱 Responsive Design
Fully optimized for mobile, tablet, and desktop
Smooth UI with Tailwind CSS

🛠 Tech Stack
Frontend
React
Redux Toolkit & RTK Query
Tailwind CSS
Vite
Backend
Node.js
Express.js
MongoDB & Mongoose
JWT Authentication
Google OAuth
Socket.io (for future real-time features)
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

🔄 Application Flow
User logs in via Google
Player profile is auto-generated
User can:
Join a team
Create a tournament
Organiser manages teams and schedules matches
Backend validations ensure data integrity and fair play

⏳ Pending Features
🟡 Live Match Scoring (In Progress)
Ball-by-ball updates
Real-time score sync using Socket.io
Player and team stats auto-calculation
🔒 Business Logic Highlights
Tournament data becomes immutable once started
Team structure cannot change after playing a match
Invite links expire automatically
Role-based access control (Player / Team Admin / Organiser)

📌 Why This Project?
This project focuses on real-world constraints, not just CRUD:
Prevents manipulation of running tournaments
Enforces fair participation rules
Designed for scalability and future live features

📬 Feedback & Contributions
Suggestions, ideas, and contributions are always welcome.
Feel free to open an issue or submit a pull request.
