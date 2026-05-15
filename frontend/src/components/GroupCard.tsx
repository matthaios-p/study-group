import React, { useState } from 'react';
import axios from 'axios';
import './GroupCard.css';

/**
 * GroupCard Component
 *
 * Displays a study group card with details and join functionality.
 * Features:
 * - Display group information (title, subject, members, status)
 * - "Request to Join" (Αίτηση Συμμετοχής) button
 * - Join request handling with approval workflow
 * - Success/error notifications
 * - Loading states
 */

export interface GroupCardProps {
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
  userId?: string; // Current user ID
  onJoinSuccess?: (groupId: string, message: string) => void;
}

interface JoinRequest {
  userId: string;
  groupId: string;
}

interface JoinResponse {
  message: string;
  status: 'approved' | 'pending';
  requestId?: string;
  coordinatorNotification?: string;
}

const GroupCard: React.FC<GroupCardProps> = ({
  id,
  title,
  subject,
  description,
  numberOfMembers,
  maxMembers,
  status,
  visibility,
  coordinatorRole,
  createdAt,
  userId = 'user_123', // Default user ID - should come from auth context
  onJoinSuccess,
}) => {
  // State management
  const [isJoining, setIsJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [joinStatus, setJoinStatus] = useState<'success' | 'pending' | 'error' | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  /**
   * Handle join group request
   */
  const handleJoinGroup = async (): Promise<void> => {
    setIsJoining(true);
    setJoinMessage(null);
    setJoinStatus(null);

    try {
      const response = await axios.post<JoinResponse>(
        `/api/groups/${id}/join`,
        { userId }
      );

      const { message, status: joinApprovalStatus, coordinatorNotification } = response.data;

      // Update UI based on response
      if (joinApprovalStatus === 'approved') {
        setJoinStatus('success');
        setJoinMessage(
          `✅ ${message} You are now a member of "${title}".`
        );
        setHasJoined(true);
      } else if (joinApprovalStatus === 'pending') {
        setJoinStatus('pending');
        setJoinMessage(
          `⏳ ${message} Your request is pending approval from the Coordinator (${coordinatorRole}).`
        );
      }

      // Call callback if provided
      if (onJoinSuccess) {
        onJoinSuccess(id, message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        'Failed to process join request. Please try again.';
      setJoinStatus('error');
      setJoinMessage(`❌ ${errorMessage}`);
      console.error('Error joining group:', error);
    } finally {
      setIsJoining(false);

      // Clear message after 5 seconds
      setTimeout(() => {
        setJoinMessage(null);
      }, 5000);
    }
  };

  /**
   * Format date to readable format
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Get badge styling based on group status
   */
  const getStatusBadgeClass = (status: string): string => {
    return status === 'Open' ? 'status-badge open' : 'status-badge approval';
  };

  /**
   * Check if group is full
   */
  const isGroupFull = numberOfMembers >= maxMembers;

  /**
   * Get button styling based on state
   */
  const getJoinButtonClass = (): string => {
    if (hasJoined) return 'btn-join joined';
    if (isGroupFull) return 'btn-join full';
    return 'btn-join';
  };

  /**
   * Get join button text
   */
  const getJoinButtonText = (): string => {
    if (hasJoined) return '✓ Joined';
    if (isGroupFull) return 'Group Full';
    if (isJoining) return 'Processing...';
    return 'Request to Join (Αίτηση Συμμετοχής)';
  };

  return (
    <div className="group-card">
      {/* Card Header */}
      <div className="group-card-header">
        <h3 className="group-title">{title}</h3>
        <span className={getStatusBadgeClass(status)}>
          {status}
        </span>
      </div>

      {/* Card Body */}
      <div className="group-card-body">
        {/* Description */}
        <p className="group-description">{description}</p>

        {/* Group Info Rows */}
        <div className="group-info-row">
          <span className="label">Subject:</span>
          <span className="value subject-tag">{subject}</span>
        </div>

        <div className="group-info-row">
          <span className="label">Members:</span>
          <span className="value">
            <span className={isGroupFull ? 'members-full' : ''}>
              {numberOfMembers}/{maxMembers}
            </span>
          </span>
        </div>

        <div className="group-info-row">
          <span className="label">Visibility:</span>
          <span className="value">{visibility}</span>
        </div>

        <div className="group-info-row">
          <span className="label">Coordinator:</span>
          <span className="value">{coordinatorRole}</span>
        </div>

        <div className="group-info-row">
          <span className="label">Created:</span>
          <span className="value">{formatDate(createdAt)}</span>
        </div>
      </div>

      {/* Join Message */}
      {joinMessage && (
        <div className={`join-message ${joinStatus}`}>
          {joinMessage}
        </div>
      )}

      {/* Card Footer */}
      <div className="group-card-footer">
        <button
          className={getJoinButtonClass()}
          onClick={handleJoinGroup}
          disabled={isJoining || hasJoined || isGroupFull}
          title={isGroupFull ? 'This group is full' : ''}
        >
          {getJoinButtonText()}
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
