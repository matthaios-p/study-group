# Study Groups Finder Application

🎓 A web application for creating, discovering, and joining study groups based on subjects and interests.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Components](#components)
- [Development Guide](#development-guide)
- [Testing](#testing)
- [Contributing](#contributing)

---

## ✨ Features

### Implemented
- ✅ **Search Groups** - Find study groups by subject, member count, and date
- ✅ **Create Groups** - Create new study groups with automatic Coordinator role assignment
- ✅ **Filter & Sort** - Advanced filtering with subject, members, and date range
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Form Validation** - Real-time validation with error messages
- ✅ **State Management** - Loading and error states

### Planned
- 🔜 Join Groups
- 🔜 Group Management (edit, delete)
- 🔜 Member Management
- 🔜 Messaging & Discussions
- 🔜 User Profiles
- 🔜 Notifications

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **CSS3** - Styling with animations
- **React Router** - Navigation (planned)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests

### Development
- **npm** - Package manager
- **Git** - Version control
- **GitHub** - Repository hosting

---

## 📁 Project Structure

```
study-group/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchGroups.tsx
│   │   │   ├── SearchGroups.css
│   │   │   ├── CreateGroup.tsx
│   │   │   └── CreateGroup.css
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── groupRoutes.ts
│   │   ├── server.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   ├── CREATE_GROUP_FEATURE.md
│   └── SEARCH_GROUPS_FEATURE.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install development dependencies:**
   ```bash
   npm install --save-dev typescript @types/node @types/express ts-node
   ```

4. **Create .env file:**
   ```
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

5. **Start the server:**
   ```bash
   npm run dev
   # or
   npx ts-node src/server.ts
   ```

   Server will run on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install axios react-router-dom
   ```

3. **Create .env file:**
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

   Frontend will run on: `http://localhost:3000`

### Verify Setup

1. Check backend health:
   ```bash
   curl http://localhost:5000/health
   ```

2. Check frontend is running:
   - Open http://localhost:3000 in your browser

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/groups
```

### 1. Get All Groups

**Endpoint:** `GET /api/groups`

**Description:** Fetch all study groups

**Response (200):**
```json
[
  {
    "id": "1",
    "title": "Mathematics Advanced",
    "subject": "Mathematics",
    "description": "Advanced mathematics study group",
    "numberOfMembers": 12,
    "maxMembers": 20,
    "status": "Open",
    "visibility": "Public",
    "coordinatorRole": "Συντονιστής",
    "createdAt": "2026-04-15"
  }
]
```

### 2. Get Unique Subjects

**Endpoint:** `GET /api/groups/subjects`

**Description:** Fetch all available subjects for filter dropdown

**Response (200):**
```json
[
  "Biology",
  "Chemistry",
  "History",
  "Literature",
  "Mathematics",
  "Physics"
]
```

### 3. Search & Filter Groups

**Endpoint:** `POST /api/groups/search`

**Description:** Search groups with multiple filter criteria

**Request Body:**
```json
{
  "subject": "Mathematics",
  "minMembers": 5,
  "maxMembers": 20,
  "startDate": "2026-04-01",
  "endDate": "2026-05-15"
}
```

**Response (200):**
```json
[
  {
    "id": "1",
    "title": "Mathematics Advanced",
    "subject": "Mathematics",
    "numberOfMembers": 12,
    "status": "Open",
    "createdAt": "2026-04-15"
  }
]
```

**Error (400):**
```json
{
  "error": "minMembers cannot be greater than maxMembers"
}
```

### 4. Create Group

**Endpoint:** `POST /api/groups/create`

**Description:** Create a new study group with automatic Coordinator role

**Request Body:**
```json
{
  "title": "Physics Study Circle",
  "description": "Collaborative physics learning for university students",
  "subject": "Physics",
  "visibility": "Public",
  "userId": "user_123"
}
```

**Validation Rules:**
- `title`: 3-100 characters
- `description`: 10-500 characters
- `subject`: Required, non-empty
- `visibility`: Must be "Public" or "Private"
- `userId`: Required

**Response (201):**
```json
{
  "message": "Group created successfully",
  "group": {
    "id": "7",
    "title": "Physics Study Circle",
    "description": "Collaborative physics learning for university students",
    "subject": "Physics",
    "visibility": "Public",
    "numberOfMembers": 1,
    "maxMembers": 20,
    "status": "Open",
    "createdBy": "user_123",
    "coordinatorRole": "Συντονιστής",
    "createdAt": "2026-05-15"
  },
  "coordinatorMessage": "You have been assigned as the Coordinator (Συντονιστής) of \"Physics Study Circle\""
}
```

**Error (400):**
```json
{
  "error": "Validation failed",
  "details": {
    "title": "Title must be at least 3 characters",
    "subject": "Subject is required"
  }
}
```

### 5. Get Specific Group

**Endpoint:** `GET /api/groups/:id`

**Description:** Fetch a specific group by ID

**Response (200):**
```json
{
  "id": "1",
  "title": "Mathematics Advanced",
  "subject": "Mathematics",
  "description": "Advanced mathematics study group",
  "numberOfMembers": 12,
  "maxMembers": 20,
  "status": "Open",
  "createdAt": "2026-04-15"
}
```

**Error (404):**
```json
{
  "error": "Group not found"
}
```

---

## 🎨 Components

### SearchGroups Component

**File:** `frontend/src/components/SearchGroups.tsx`

**Features:**
- Display all study groups in a grid
- Filter by subject, members count, date range
- Real-time search results
- Group cards with key information
- Loading and error states
- Responsive design

**Usage:**
```tsx
import SearchGroups from './components/SearchGroups';

function App() {
  return <SearchGroups />;
}
```

### CreateGroup Component

**File:** `frontend/src/components/CreateGroup.tsx`

**Features:**
- Form for creating new study groups
- Fields: Title, Description, Subject, Visibility
- Real-time validation with error messages
- Character counters
- Automatic Coordinator role assignment
- Success/error notifications

**Usage:**
```tsx
import CreateGroup from './components/CreateGroup';

function App() {
  const handleGroupCreated = (newGroup) => {
    console.log('Group created:', newGroup);
  };

  return (
    <CreateGroup onGroupCreated={handleGroupCreated} />
  );
}
```

---

## 🔨 Development Guide

### Adding a New Endpoint

1. **Add route in `backend/src/routes/groupRoutes.ts`:**
   ```typescript
   router.post('/new-endpoint', (req: Request, res: Response): void => {
     try {
       // Your logic here
       res.status(200).json({ message: 'Success' });
     } catch (error) {
       console.error('Error:', error);
       res.status(500).json({ error: 'Failed' });
     }
   });
   ```

2. **Test with curl:**
   ```bash
   curl -X POST http://localhost:5000/api/groups/new-endpoint \
     -H "Content-Type: application/json" \
     -d '{"key": "value"}'
   ```

### Adding a New Component

1. **Create component file:**
   ```bash
   touch frontend/src/components/NewComponent.tsx
   ```

2. **Create styling file:**
   ```bash
   touch frontend/src/components/NewComponent.css
   ```

3. **Import and use in App:**
   ```tsx
   import NewComponent from './components/NewComponent';
   ```

---

## ✅ Testing

### Backend Testing

**Using cURL:**
```bash
# Get all groups
curl http://localhost:5000/api/groups

# Get subjects
curl http://localhost:5000/api/groups/subjects

# Search groups
curl -X POST http://localhost:5000/api/groups/search \
  -H "Content-Type: application/json" \
  -d '{"subject": "Mathematics"}'

# Create group
curl -X POST http://localhost:5000/api/groups/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Group",
    "description": "This is a test group",
    "subject": "Physics",
    "visibility": "Public",
    "userId": "user_123"
  }'
```

**Using Postman:**
1. Import collection from `docs/postman_collection.json` (if available)
2. Set variables for `base_url`, `user_id`, etc.
3. Run requests and verify responses

### Frontend Testing

1. **Check components load:**
   - Navigate to http://localhost:3000
   - Verify SearchGroups component displays
   - Verify CreateGroup component works

2. **Test form validation:**
   - Try submitting empty form
   - Try entering invalid data
   - Verify error messages appear

3. **Test API integration:**
   - Create a group
   - Search for groups
   - Verify data matches backend

---

## 🤝 Contributing

### Branch Naming
- Feature: `feature/feature-name`
- Bug fix: `bugfix/bug-name`
- Hotfix: `hotfix/hotfix-name`

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
```

### Pull Request Process
1. Create feature branch
2. Make changes with clear commits
3. Test thoroughly
4. Create pull request with description
5. Request review
6. Merge after approval

---

## 📝 Notes

- Using mock data in backend (replace with real database)
- CORS configured for frontend on port 3000
- All responses include proper HTTP status codes
- Comprehensive error handling on both frontend and backend
- TypeScript for type safety throughout

---

## 📞 Support

For issues or questions:
1. Check documentation in `docs/` folder
2. Create an issue on GitHub
3. Contact the development team

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎯 Roadmap

- [x] Search Groups Feature
- [x] Create Groups Feature
- [ ] Join Groups Feature
- [ ] User Profiles
- [ ] Messaging System
- [ ] Notifications
- [ ] Group Analytics
- [ ] Admin Dashboard

---

**Last Updated:** May 15, 2026

**Version:** 1.0.0
