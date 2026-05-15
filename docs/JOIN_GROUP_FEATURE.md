# Join Group Feature Documentation

## Overview

The Join Group feature allows users to request membership in study groups with an intelligent approval workflow based on group visibility and status.

---

## Features

### 1. **Smart Approval Workflow**
- **Open Groups**: Instant membership approval
- **Requires Approval Groups**: Pending request creation with coordinator notification

### 2. **Group Status Checking**
- Validates group capacity before allowing join
- Prevents duplicate membership
- Tracks member count accurately

### 3. **Coordinator Notifications**
- Simulates notification system
- Tracks pending requests
- Provides request management interface (foundation for future development)

---

## Frontend Implementation

### Components

#### 1. **GroupCard.tsx** - Individual Group Display

Displays a single study group with join functionality.

**Props:**
```typescript
interface GroupCardProps {
  id: string;
  title: string;
  subject: string;
  description: string;
  numberOfMembers: number;
  maxMembers: number;
  status: 'Open' | 'Requires Approval';
  visibility: 'Public' | 'Private';
  coordinatorRole: string;
  createdAt: string;
  userId?: string;
  onJoinSuccess?: (groupId: string, message: string) => void;
}
```

**Features:**
- "Request to Join" (Αίτηση Συμμετοχής) button
- Group information display
- Real-time join status messages
- Loading and error states
- Member count display with capacity indicator
- Group full indicator

**Usage:**
```tsx
import GroupCard from './components/GroupCard';

<GroupCard
  id="1"
  title="Mathematics Advanced"
  subject="Mathematics"
  description="Advanced mathematics study group"
  numberOfMembers={12}
  maxMembers={20}
  status="Open"
  visibility="Public"
  coordinatorRole="Συντονιστής"
  createdAt="2026-04-15"
  userId="user_123"
  onJoinSuccess={(groupId, message) => console.log(message)}
/>
```

#### 2. **SearchGroupsWithJoin.tsx** - Group List with Join

Displays filtered group list with join functionality.

**Features:**
- Integrate GroupCard components
- Filter groups by subject, members, date
- Handle join success globally
- Success notification display
- Grid layout for cards

**Usage:**
```tsx
import SearchGroupsWithJoin from './components/SearchGroupsWithJoin';

function App() {
  return <SearchGroupsWithJoin />;
}
```

---

## Backend Implementation

### Endpoint: `POST /api/groups/:groupId/join`

#### Request

**URL:** `http://localhost:5000/api/groups/:groupId/join`

**Method:** `POST`

**Content-Type:** `application/json`

**Path Parameters:**
- `groupId` (string, required) - The ID of the group to join

**Request Body:**
```json
{
  "userId": "user_123"
}
```

#### Validation

1. **User ID Validation**
   - Required, non-empty string
   - Error: "User ID is required"

2. **Group ID Validation**
   - Required, non-empty string
   - Error: "Group ID is required"

3. **Group Existence**
   - Group must exist in database
   - Error: "Group not found" (404)

4. **Membership Check**
   - User cannot be already member
   - Error: "You are already a member of this group"

5. **Capacity Check**
   - Group must not be full
   - Condition: `numberOfMembers < maxMembers`
   - Error: "This group is full. Cannot join."

#### Response: Open Group (Auto-Approved)

**Status:** `200 OK`

**Response Body:**
```json
{
  "message": "You have been successfully added to the group!",
  "status": "approved"
}
```

**Backend Actions:**
1. Add user to group members array
2. Increment member count
3. Return success response
4. Log approval

#### Response: Requires Approval Group (Pending)

**Status:** `200 OK`

**Response Body:**
```json
{
  "message": "Your join request has been submitted and is pending approval.",
  "status": "pending",
  "requestId": "req_1715779968000_user_123",
  "coordinatorNotification": "Coordinator (Συντονιστής) notification created: 'User user_123 has requested to join your group'"
}
```

**Backend Actions:**
1. Create pending join request record
2. Create coordinator notification
3. Store request in database
4. Return pending response
5. Log pending request

#### Error Responses

**400 Bad Request** - User already member
```json
{
  "error": "You are already a member of this group"
}
```

**400 Bad Request** - Group is full
```json
{
  "error": "This group is full. Cannot join."
}
```

**400 Bad Request** - Invalid user ID
```json
{
  "error": "User ID is required"
}
```

**404 Not Found** - Group doesn't exist
```json
{
  "error": "Group not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to process join request"
}
```

---

## Approval Workflow

### For Open Groups

```
User clicks "Request to Join"
         ↓
   Send POST request
         ↓
  Check validations
         ↓
  Status = "Open" ?
         ↓
   YES: Add to members
         ↓
  Increment member count
         ↓
 Return "approved" status
         ↓
Show success message
         ↓
Update UI (button becomes "✓ Joined")
```

### For Requires Approval Groups

```
User clicks "Request to Join"
         ↓
   Send POST request
         ↓
  Check validations
         ↓
Status = "Requires Approval" ?
         ↓
   YES: Create pending request
         ↓
 Create coordinator notification
         ↓
 Return "pending" status
         ↓
Show pending message
         ↓
Notify coordinator (simulated)
         ↓
(Future) Coordinator approves/rejects
         ↓
(Future) User notified of decision
```

---

## Supporting Endpoints (Future Development)

### GET /api/groups/:groupId/join-requests

Fetch all pending join requests for a group.

**Response:**
```json
[
  {
    "id": "req_1715779968000_user_123",
    "groupId": "2",
    "userId": "user_123",
    "status": "pending",
    "requestedAt": "2026-05-15T10:30:00Z",
    "coordinatorId": "user_002"
  }
]
```

### GET /api/notifications/:coordinatorId

Fetch all notifications for a coordinator.

**Response:**
```json
[
  {
    "id": "notif_1715779968000",
    "coordinatorId": "user_002",
    "groupId": "2",
    "userId": "user_123",
    "type": "join_request",
    "message": "User user_123 has requested to join your group 'Physics Study Circle'",
    "createdAt": "2026-05-15T10:30:00Z",
    "read": false
  }
]
```

---

## Testing

### Using cURL

**Test 1: Join Open Group (Auto-Approved)**
```bash
curl -X POST http://localhost:5000/api/groups/1/join \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123"}'
```

Expected Response:
```json
{
  "message": "You have been successfully added to the group!",
  "status": "approved"
}
```

**Test 2: Join Requires Approval Group (Pending)**
```bash
curl -X POST http://localhost:5000/api/groups/2/join \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_999"}'
```

Expected Response:
```json
{
  "message": "Your join request has been submitted and is pending approval.",
  "status": "pending",
  "requestId": "req_1715779968000_user_999",
  "coordinatorNotification": "Coordinator (Συντονιστής) notification created: ..."
}
```

**Test 3: Join as Already Member**
```bash
curl -X POST http://localhost:5000/api/groups/1/join \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_001"}'
```

Expected Response (400):
```json
{
  "error": "You are already a member of this group"
}
```

**Test 4: Get Pending Requests**
```bash
curl http://localhost:5000/api/groups/2/join-requests
```

Expected Response:
```json
[
  {
    "id": "req_1715779968000_user_999",
    "groupId": "2",
    "userId": "user_999",
    "status": "pending",
    "requestedAt": "2026-05-15T10:30:00Z"
  }
]
```

---

## User Experience Flow

### Scenario 1: Joining Open Group

1. User views group card
2. Clicks "Request to Join (Αίτηση Συμμετοχής)" button
3. Button shows "Processing..." state
4. Success message appears: "✅ You have been successfully added to the group!"
5. Button changes to "✓ Joined" (disabled)
6. Member count updates

### Scenario 2: Joining Requires Approval Group

1. User views group card
2. Clicks "Request to Join (Αίτηση Συμμετοχής)" button
3. Button shows "Processing..." state
4. Pending message appears: "⏳ Your request is pending approval from the Coordinator..."
5. Button remains enabled but shows pending status
6. Message disappears after 5 seconds
7. Coordinator receives notification

---

## Security Considerations

1. **User Authentication**: Verify user ID from authenticated session (not implemented in mock)
2. **Authorization**: Ensure only group members can perform certain actions
3. **Input Validation**: Validate all user inputs on both client and server
4. **Rate Limiting**: Prevent spam join requests
5. **Data Integrity**: Ensure consistency of member counts and join requests

---

## Future Enhancements

- [ ] Coordinator approval/rejection UI
- [ ] Email notifications
- [ ] Join request history
- [ ] Bulk join request management
- [ ] Withdrawal of join requests
- [ ] Member removal functionality
- [ ] Leave group functionality
- [ ] Role management (member levels)
- [ ] Activity logging
- [ ] Real-time notifications using WebSockets

---

## Database Schema (Future)

```javascript
// Join Request Collection
{
  _id: ObjectId,
  groupId: ObjectId,
  userId: ObjectId,
  status: String, // "pending", "approved", "rejected"
  requestedAt: Date,
  resolvedAt: Date,
  resolutionNote: String,
  coordinatorId: ObjectId
}

// Notification Collection
{
  _id: ObjectId,
  coordinatorId: ObjectId,
  groupId: ObjectId,
  userId: ObjectId,
  type: String, // "join_request"
  message: String,
  createdAt: Date,
  read: Boolean
}
```

---

## Notes

- Currently using mock data for demonstrations
- Coordinator notifications are simulated
- Real implementation should use database transactions
- Consider implementing queue system for notification reliability
- Add logging and monitoring for audit trail

---

**Last Updated:** May 15, 2026

**Version:** 1.0.0
