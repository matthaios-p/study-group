# Create Group Feature Documentation

## Overview

The Create Group feature allows authenticated users to create new study groups with specific settings. Upon creation, the user is automatically assigned the role of **Coordinator (Συντονιστής)**.

---

## Frontend Implementation

### Component: `CreateGroup.tsx`

#### Features
- Professional form with validation
- Real-time field validation with error messages
- Character counters for text fields
- Visibility toggle (Public/Private)
- Loading and success states
- Responsive design (mobile-friendly)
- Automatic coordinator role assignment confirmation

#### Form Fields

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Title | Text Input | 3-100 characters | Yes |
| Description | Textarea | 10-500 characters | Yes |
| Subject | Dropdown Select | Choose from predefined list | Yes |
| Visibility | Radio Buttons | Public or Private | Yes |

#### Props

```typescript
interface CreateGroupProps {
  onGroupCreated?: (group: CreateGroupResponse) => void;  // Callback when group is created
  onCancel?: () => void;  // Callback when user cancels
}
```

#### Usage Example

```tsx
import CreateGroup from './components/CreateGroup';

function App() {
  const handleGroupCreated = (newGroup) => {
    console.log('Group created:', newGroup);
    // Add to search list, redirect, etc.
  };

  return (
    <CreateGroup 
      onGroupCreated={handleGroupCreated}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

#### Styling

- CSS file: `CreateGroup.css`
- Uses gradient background matching design system
- Smooth animations for success/error messages
- Mobile-responsive grid layout
- Professional button styles with hover effects

---

## Backend Implementation

### Endpoint: `POST /api/groups/create`

#### Request

**URL:** `http://localhost:5000/api/groups/create`

**Method:** `POST`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "title": "Physics Study Circle",
  "description": "Collaborative physics learning for university students",
  "subject": "Physics",
  "visibility": "Public",
  "userId": "user_123"
}
```

#### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| title | 3-100 characters | "Title must be at least 3 characters" / "Title must not exceed 100 characters" |
| description | 10-500 characters | "Description must be at least 10 characters" / "Description must not exceed 500 characters" |
| subject | Required, non-empty string | "Subject is required" |
| visibility | Must be "Public" or "Private" | "Visibility must be either Public or Private" |
| userId | Required, non-empty string | "User ID is required" |

#### Response (201 Created)

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

#### Error Responses

**400 Bad Request** - Validation Error

```json
{
  "error": "Validation failed",
  "details": {
    "title": "Title must be at least 3 characters",
    "subject": "Subject is required"
  }
}
```

**500 Internal Server Error**

```json
{
  "error": "Failed to create group"
}
```

---

## Coordinator Role Assignment

When a group is created:

1. The user creating the group is automatically assigned the **Coordinator (Συντονιστής)** role
2. The field `coordinatorRole` is set to `'Συντονιστής'`
3. The user ID is tracked in the `createdBy` field
4. Initial member count is set to 1 (the creator)
5. Initial status is set to `'Open'`

### Coordinator Responsibilities

- Manage group settings and information
- Invite and accept new members
- Moderate discussions
- Manage group permissions

---

## Integration with Search Feature

The newly created group object is compatible with the **SearchGroups** component:

```typescript
interface StudyGroup {
  id: string;
  title: string;
  subject: string;
  numberOfMembers: number;
  maxMembers?: number;
  status: 'Open' | 'Requires Approval';
  createdAt: string;
  description?: string;
  visibility?: string;
  createdBy?: string;
  coordinatorRole?: string;
}
```

The created group can be immediately added to the search results list.

---

## Testing

### Using cURL

```bash
curl -X POST http://localhost:5000/api/groups/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Mathematics Study Group",
    "description": "Collaborative learning for advanced mathematics topics",
    "subject": "Mathematics",
    "visibility": "Public",
    "userId": "user_123"
  }'
```

### Using Postman

1. Create a new POST request
2. URL: `http://localhost:5000/api/groups/create`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "title": "Advanced Mathematics Study Group",
     "description": "Collaborative learning for advanced mathematics topics",
     "subject": "Mathematics",
     "visibility": "Public",
     "userId": "user_123"
   }
   ```
5. Click Send

### Frontend Integration Test

```tsx
import CreateGroup from './components/CreateGroup';
import { useState } from 'react';

function TestCreateGroup() {
  const [createdGroup, setCreatedGroup] = useState(null);

  return (
    <div>
      <CreateGroup 
        onGroupCreated={(group) => {
          console.log('New group created:', group);
          setCreatedGroup(group);
        }}
      />
      {createdGroup && (
        <div>
          <h3>Group Created: {createdGroup.group.title}</h3>
          <p>Coordinator: {createdGroup.group.coordinatorRole}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Error Handling

The feature includes comprehensive error handling:

1. **Client-side Validation:**
   - Real-time field validation
   - Character count limits
   - Visual error indicators
   - Prevents form submission with errors

2. **Server-side Validation:**
   - Data type checking
   - Length validation
   - Required field checking
   - Comprehensive error messages

3. **HTTP Status Codes:**
   - `201`: Group created successfully
   - `400`: Validation error
   - `500`: Server error

---

## Database Considerations (Future Implementation)

When integrating with a real database:

```javascript
// Example with MongoDB
const groupSchema = new Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true, minlength: 10, maxlength: 500 },
  subject: { type: String, required: true },
  visibility: { type: String, enum: ['Public', 'Private'], required: true },
  numberOfMembers: { type: Number, default: 1 },
  maxMembers: { type: Number, default: 20 },
  status: { type: String, default: 'Open' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coordinatorRole: { type: String, default: 'Συντονιστής' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

---

## Security Considerations

1. **Input Sanitization:** Trim all string inputs
2. **Validation:** Strict validation on both client and server
3. **Authentication:** In production, verify userId from authenticated session
4. **Authorization:** Only creator can edit group settings
5. **Rate Limiting:** Consider implementing rate limiting for group creation
6. **Data Persistence:** Use secure database with proper backups

---

## Future Enhancements

- [ ] Image/avatar upload for groups
- [ ] Group categories and tags
- [ ] Maximum members limit configuration
- [ ] Group templates
- [ ] Bulk creation from CSV
- [ ] Group analytics and statistics
- [ ] Email notifications for group creation
- [ ] Activity logging
