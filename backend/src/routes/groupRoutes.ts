import express, { Router, Request, Response } from 'express';

/**
 * Study Groups Routes
 * 
 * This module defines all API endpoints for managing study groups.
 * Routes handle group search, filtering, and creation functionality.
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
  },
];

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
    // In production: Query database for all groups
    // const groups = await Group.find();
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
    // Extract unique subjects from groups
    const uniqueSubjects = Array.from(
      new Set(mockGroups.map((group) => group.subject))
    );

    // In production: Query database for unique subjects
    // const subjects = await Group.distinct('subject');

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
 *   subject: string (optional) - Filter by subject
 *   minMembers: number (optional) - Minimum number of members
 *   maxMembers: number (optional) - Maximum number of members
 *   startDate: string (optional) - Start date (YYYY-MM-DD format)
 *   endDate: string (optional) - End date (YYYY-MM-DD format)
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

    // Validate request parameters
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

    // Apply filters
    let filteredGroups = mockGroups;

    // Filter by subject (case-insensitive)
    if (subject && subject.trim() !== '') {
      filteredGroups = filteredGroups.filter(
        (group) => group.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    // Filter by number of members
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

    // Filter by date range
    if (startDate || endDate) {
      filteredGroups = filteredGroups.filter((group) => {
        const groupDate = new Date(group.createdAt);

        // Check start date
        if (startDate) {
          const start = new Date(startDate);
          if (groupDate < start) return false;
        }

        // Check end date
        if (endDate) {
          const end = new Date(endDate);
          // Set end date to end of day (23:59:59)
          end.setHours(23, 59, 59, 999);
          if (groupDate > end) return false;
        }

        return true;
      });
    }

    // Sort results by creation date (newest first)
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
 *   visibility: 'Public' | 'Private' (required) - Group visibility
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

    // ========== Validation ==========
    const validationErrors: Record<string, string> = {};

    // Validate title
    if (!title || typeof title !== 'string') {
      validationErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      validationErrors.title = 'Title must be at least 3 characters';
    } else if (title.trim().length > 100) {
      validationErrors.title = 'Title must not exceed 100 characters';
    }

    // Validate description
    if (!description || typeof description !== 'string') {
      validationErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      validationErrors.description = 'Description must be at least 10 characters';
    } else if (description.trim().length > 500) {
      validationErrors.description = 'Description must not exceed 500 characters';
    }

    // Validate subject
    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      validationErrors.subject = 'Subject is required';
    }

    // Validate visibility
    if (!visibility || !['Public', 'Private'].includes(visibility)) {
      validationErrors.visibility = 'Visibility must be either Public or Private';
    }

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      validationErrors.userId = 'User ID is required';
    }

    // Return validation errors if any
    if (Object.keys(validationErrors).length > 0) {
      res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
      return;
    }

    // ========== Create Group ==========
    const newGroup = {
      id: (mockGroups.length + 1).toString(),
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      visibility: visibility,
      numberOfMembers: 1, // Creator is the first member
      maxMembers: 20, // Default max members
      status: 'Open',
      createdBy: userId,
      coordinatorRole: 'Συντονιστής', // Greek for "Coordinator"
      createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };

    // Add to mock database
    mockGroups.push(newGroup);

    // In production:
    // const newGroup = await Group.create({ ... });
    // or
    // const group = new Group({ ... });
    // await group.save();

    console.log(`✅ Group created: ${newGroup.title} by user ${userId}`);

    // ========== Response ==========
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

    // Find group by ID
    const group = mockGroups.find((g) => g.id === id);

    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    // In production: Query database
    // const group = await Group.findById(id);

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

export default router;