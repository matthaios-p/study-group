import express, { Router, Request, Response } from 'express';
import { JoinRequestRecord, CoordinatorNotification } from '../types/joinRequest';

/**
 * Study Groups Routes
 * 
 * This module defines all API endpoints for managing study groups.
 * Routes handle group search, filtering, creation, and join functionality.
 */

const router: Router = express.Router();

/**
 * Mock database - Replace with actual database calls
 * In production, this should query a MongoDB, PostgreSQL, or other database
 */
let mockGroups = [
  {
    id: '1',
    title: 'Mathematics Advanced',
    subject: 'Mathematics',
    description: 'Advanced mathematics study group for university students',
    numberOfMembers: 12,
    maxMembers: 20,
    status: 'Open',
    visibility: 'Public',
    createdBy: 'user_001',
    coordinatorRole: 'Συντονιστής',
    createdAt: '2026-04-15',
    members: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005'],
  },
  {
    id: '2',
    title: 'Physics Study Circle',
    subject: 'Physics',
    description: 'Collaborative physics learning and problem solving',
    numberOfMembers: 8,
    maxMembers: 15,
    status: 'Requires Approval',
    visibility: 'Private',
    createdBy: 'user_002',
    coordinatorRole: 'Συντονιστής',
    createdAt: '2026-04-20',
    members: ['user_002', 'user_006', 'user_007'],
  },
  {
    id: '3',
    title: 'Chemistry Lab Prep',
    subject: 'Chemistry',
    description: 'Preparation for chemistry laboratory experiments',
    numberOfMembers: 15,
    maxMembers: 20,
    status: 'Open',
    visibility: 'Public',
    createdBy: 'user_003',
    coordinatorRole: 'Συντονιστής',
    createdAt: '2026-04-10',
    members: ['user_003'],
  },
  {
    id: '4',
    title: 'Biology Enthusiasts',
    subject: 'Biology',
    description: 'For biology lovers and students',
    numberOfMembers: 5,
    maxMembers: 10,
    status: 'Open',
    visibility: 'Public',
    createdBy: 'user_004',
    coordinatorRole: 'Συντονιστής',
    createdAt: '2026-05-01',
    members: ['user_004'],
  },
  {
    id: '5',
    title: 'History Deep Dive',
    subject: 'History',
    description: 'Exploring historical events and their context',
    numberOfMembers: 20,
    maxMembers: 25,
    status: 'Requires Approval',
    visibility: 'Private',
    createdBy: 'user_005',
    coordinatorRole: 'Συντονιστής',
    createdAt: '2026-03-25',
    members: ['user_005'],
  },
  {
    id: '6',
    title: 'Literature & Arts',
    subject: 'Literature',
    description: 'Literature analysis and artistic expression discussions',
    numberOfMembers: 10,
    maxMembers: 15,
    status: 'Open',
    visibility: 'Public',
    createdBy: 'user_006',
    coordinatorRole: 'Συντονιστής',
    createdAt: '2026-05-05',
    members: ['user_006'],
  },
];

/**
 * Mock join requests database
 * Stores pending join requests awaiting coordinator approval
 */
let mockJoinRequests: JoinRequestRecord[] = [];

/**
 * Mock notifications database
 * Stores notifications to coordinators about join requests
 */
let mockNotifications: CoordinatorNotification[] = [];

/**
 * GET /api/groups
 * 
 * Fetch all study groups
 * 
 * Response:
 * - 200: Array of all study groups
 * - 500: Server error
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    res.status(200).json(mockGroups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

/**
 * GET /api/groups/subjects
 * 
 * Fetch all unique subjects for filter dropdown
 * 
 * Response:
 * - 200: Array of unique subjects
 * - 500: Server error
 */
router.get('/subjects', (req: Request, res: Response): void => {
  try {
    const uniqueSubjects = Array.from(
      new Set(mockGroups.map((group) => group.subject))
    );
    res.status(200).json(uniqueSubjects.sort());
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

/**
 * POST /api/groups/search
 * 
 * Search and filter study groups based on criteria
 * 
 * Request Body:
 * {
 *   subject: string (optional)
 *   minMembers: number (optional)
 *   maxMembers: number (optional)
 *   startDate: string (optional)
 *   endDate: string (optional)
 * }
 * 
 * Response:
 * - 200: Array of filtered study groups
 * - 400: Invalid request parameters
 * - 500: Server error
 */
router.post('/search', (req: Request, res: Response): void => {
  try {
    const { subject, minMembers, maxMembers, startDate, endDate } = req.body;

    if (minMembers !== undefined && minMembers < 0) {
      res.status(400).json({ error: 'minMembers cannot be negative' });
      return;
    }

    if (maxMembers !== undefined && maxMembers < 0) {
      res.status(400).json({ error: 'maxMembers cannot be negative' });
      return;
    }

    if (minMembers !== undefined && maxMembers !== undefined && minMembers > maxMembers) {
      res.status(400).json({ error: 'minMembers cannot be greater than maxMembers' });
      return;
    }

    let filteredGroups = mockGroups;

    if (subject && subject.trim() !== '') {
      filteredGroups = filteredGroups.filter(
        (group) => group.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    if (minMembers !== undefined && minMembers >= 0) {
      filteredGroups = filteredGroups.filter(
        (group) => group.numberOfMembers >= minMembers
      );
    }

    if (maxMembers !== undefined && maxMembers >= 0) {
      filteredGroups = filteredGroups.filter(
        (group) => group.numberOfMembers <= maxMembers
      );
    }

    if (startDate || endDate) {
      filteredGroups = filteredGroups.filter((group) => {
        const groupDate = new Date(group.createdAt);

        if (startDate) {
          const start = new Date(startDate);
          if (groupDate < start) return false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (groupDate > end) return false;
        }

        return true;
      });
    }

    filteredGroups.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.status(200).json(filteredGroups);
  } catch (error) {
    console.error('Error searching groups:', error);
    res.status(500).json({ error: 'Failed to search groups' });
  }
});

/**
 * POST /api/groups/create
 * 
 * Create a new study group
 * 
 * Request Body:
 * {
 *   title: string (required) - Group title (3-100 characters)
 *   description: string (required) - Group description (10-500 characters)
 *   subject: string (required) - Subject area
 *   visibility: 'Public' | 'Private' (required)
 *   userId: string (required) - ID of the user creating the group
 * }
 * 
 * Response:
 * - 201: Newly created group with coordinator role assigned
 * - 400: Validation error
 * - 500: Server error
 */
router.post('/create', (req: Request, res: Response): void => {
  try {
    const { title, description, subject, visibility, userId } = req.body;

    const validationErrors: Record<string, string> = {};

    if (!title || typeof title !== 'string') {
      validationErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      validationErrors.title = 'Title must be at least 3 characters';
    } else if (title.trim().length > 100) {
      validationErrors.title = 'Title must not exceed 100 characters';
    }

    if (!description || typeof description !== 'string') {
      validationErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      validationErrors.description = 'Description must be at least 10 characters';
    } else if (description.trim().length > 500) {
      validationErrors.description = 'Description must not exceed 500 characters';
    }

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      validationErrors.subject = 'Subject is required';
    }

    if (!visibility || !['Public', 'Private'].includes(visibility)) {
      validationErrors.visibility = 'Visibility must be either Public or Private';
    }

    if (!userId || typeof userId !== 'string') {
      validationErrors.userId = 'User ID is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
      return;
    }

    const newGroup = {
      id: (mockGroups.length + 1).toString(),
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      visibility: visibility,
      numberOfMembers: 1,
      maxMembers: 20,
      status: 'Open',
      createdBy: userId,
      coordinatorRole: 'Συντονιστής',
      createdAt: new Date().toISOString().split('T')[0],
      members: [userId],
    };

    mockGroups.push(newGroup);

    console.log(`✅ Group created: ${newGroup.title} by user ${userId}`);

    res.status(201).json({
      message: 'Group created successfully',
      group: newGroup,
      coordinatorMessage: `You have been assigned as the Coordinator (Συντονιστής) of "${newGroup.title}"`,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

/**
 * POST /api/groups/:groupId/join
 * 
 * Join a study group with approval workflow
 * 
 * Features:
 * - For "Open" groups: Automatically add user as member
 * - For "Requires Approval" groups: Create pending request
 * - Simulate coordinator notification
 * 
 * Request Body:
 * {
 *   userId: string (required) - ID of user requesting to join
 * }
 * 
 * Response:
 * - 200: Join successful
 *   For Open groups: { message: "...", status: "approved" }
 *   For Approval groups: { message: "...", status: "pending", requestId: "...", coordinatorNotification: "..." }
 * - 400: Invalid request or user already member
 * - 404: Group not found
 * - 500: Server error
 */
router.post('/:groupId/join', (req: Request, res: Response): void => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    // ========== Validation ==========
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    if (!groupId || typeof groupId !== 'string') {
      res.status(400).json({ error: 'Group ID is required' });
      return;
    }

    // ========== Find Group ==========
    const group = mockGroups.find((g) => g.id === groupId);

    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    // ========== Check if user already a member ==========
    if (group.members && group.members.includes(userId)) {
      res.status(400).json({ error: 'You are already a member of this group' });
      return;
    }

    // ========== Check if group is full ==========
    if (group.numberOfMembers >= group.maxMembers) {
      res.status(400).json({ error: 'This group is full. Cannot join.' });
      return;
    }

    // ========== Handle "Open" Status Groups ==========
    if (group.status === 'Open') {
      // Automatically add user as member
      if (!group.members) {
        group.members = [];
      }
      group.members.push(userId);
      group.numberOfMembers += 1;

      console.log(`✅ User ${userId} automatically joined group "${group.title}"`);

      res.status(200).json({
        message: 'You have been successfully added to the group!',
        status: 'approved',
      });
      return;
    }

    // ========== Handle "Requires Approval" Status Groups ==========
    if (group.status === 'Requires Approval') {
      // Create pending request
      const joinRequestId = `req_${Date.now()}_${userId}`;
      const joinRequest: JoinRequestRecord = {
        id: joinRequestId,
        groupId: groupId,
        userId: userId,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        coordinatorId: group.createdBy,
      };

      mockJoinRequests.push(joinRequest);

      // Create coordinator notification
      const notification: CoordinatorNotification = {
        id: `notif_${Date.now()}`,
        coordinatorId: group.createdBy,
        groupId: groupId,
        userId: userId,
        type: 'join_request',
        message: `User ${userId} has requested to join your group "${group.title}"`,
        createdAt: new Date().toISOString(),
        read: false,
      };

      mockNotifications.push(notification);

      console.log(
        `⏳ Join request pending for user ${userId} to join group "${group.title}"`
      );
      console.log(`📧 Coordinator ${group.createdBy} has been notified`);

      res.status(200).json({
        message: 'Your join request has been submitted and is pending approval.',
        status: 'pending',
        requestId: joinRequestId,
        coordinatorNotification: `Coordinator (${group.coordinatorRole}) notification created: "User ${userId} has requested to join your group"`,
      });
      return;
    }

    // ========== Unexpected Status ==========
    res.status(400).json({ error: 'Cannot join group with current status' });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: 'Failed to process join request' });
  }
});

/**
 * GET /api/groups/:id
 * 
 * Fetch a specific study group by ID
 * 
 * Parameters:
 * - id: string - Group ID
 * 
 * Response:
 * - 200: Study group details
 * - 404: Group not found
 * - 500: Server error
 */
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;

    const group = mockGroups.find((g) => g.id === id);

    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

/**
 * GET /api/groups/:groupId/join-requests
 * 
 * Fetch all pending join requests for a group (for Coordinator)
 * 
 * Response:
 * - 200: Array of pending join requests
 * - 500: Server error
 */
router.get('/:groupId/join-requests', (req: Request, res: Response): void => {
  try {
    const { groupId } = req.params;

    const requests = mockJoinRequests.filter(
      (req) => req.groupId === groupId && req.status === 'pending'
    );

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching join requests:', error);
    res.status(500).json({ error: 'Failed to fetch join requests' });
  }
});

/**
 * GET /api/notifications/:coordinatorId
 * 
 * Fetch all notifications for a coordinator
 * 
 * Response:
 * - 200: Array of notifications
 * - 500: Server error
 */
router.get('/notifications/:coordinatorId', (req: Request, res: Response): void => {
  try {
    const { coordinatorId } = req.params;

    const notifications = mockNotifications.filter(
      (notif) => notif.coordinatorId === coordinatorId
    );

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export default router;
