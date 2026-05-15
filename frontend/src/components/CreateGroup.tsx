import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './CreateGroup.css';

/**
 * CreateGroup Component
 *
 * This component provides a form for creating new study groups.
 * Features:
 * - Form fields for: Title, Description, Subject, and Visibility
 * - Form validation with error messages
 * - Automatic assignment of Coordinator role to creator
 * - Loading and success states
 * - Responsive design with professional styling
 */

interface CreateGroupFormData {
  title: string;
  description: string;
  subject: string;
  visibility: 'Public' | 'Private';
}

interface CreateGroupResponse {
  id: string;
  title: string;
  description: string;
  subject: string;
  visibility: string;
  coordinatorRole: string;
  status: string;
  createdAt: string;
  numberOfMembers: number;
}

interface CreateGroupProps {
  onGroupCreated?: (group: CreateGroupResponse) => void;
  onCancel?: () => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ onGroupCreated, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState<CreateGroupFormData>({
    title: '',
    description: '',
    subject: '',
    visibility: 'Public',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Available subjects for dropdown
  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Literature',
    'Computer Science',
    'Economics',
    'Psychology',
    'Philosophy',
    'Other',
  ];

  /**
   * Handle form input changes
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Validate form data before submission
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate title
    if (!formData.title.trim()) {
      errors.title = 'Group title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Group title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Group title must not exceed 100 characters';
    }

    // Validate description
    if (!formData.description.trim()) {
      errors.description = 'Group description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Group description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      errors.description = 'Group description must not exceed 500 characters';
    }

    // Validate subject
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    // Validate visibility
    if (!formData.visibility) {
      errors.visibility = 'Visibility setting is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setError('Please fix the errors above and try again');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send request to create group
      const response = await axios.post<CreateGroupResponse>(
        '/api/groups/create',
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          subject: formData.subject,
          visibility: formData.visibility,
        }
      );

      // Success handling
      setSuccess(true);
      const newGroup = response.data;

      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        visibility: 'Public',
      });

      // Call callback if provided
      if (onGroupCreated) {
        onGroupCreated(newGroup);
      }

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'Failed to create group. Please try again.';
      setError(errorMessage);
      console.error('Error creating group:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form reset
   */
  const handleReset = (): void => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      visibility: 'Public',
    });
    setValidationErrors({});
    setError(null);

    // Call cancel callback if provided
    if (onCancel) {
      onCancel();
    }
  };

  /**
   * Get character count display
   */
  const getCharCount = (current: number, max: number): string => {
    return `${current}/${max}`;
  };

  return (
    <div className="create-group-container">
      <div className="create-group-card">
        {/* Header */}
        <div className="create-group-header">
          <h1>Create New Study Group</h1>
          <p>Start your own study group and invite members to learn together</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            <div className="success-content">
              <p className="success-title">Group Created Successfully!</p>
              <p className="success-text">
                You have been assigned as the Coordinator (Συντονιστής) of this group.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="create-group-form">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title">
              Group Title <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Advanced Mathematics Study Circle"
              className={`form-input ${validationErrors.title ? 'input-error' : ''}`}
              maxLength={100}
              disabled={loading}
            />
            <div className="form-meta">
              <span className="char-count">
                {getCharCount(formData.title.length, 100)}
              </span>
              {validationErrors.title && (
                <span className="error-text">{validationErrors.title}</span>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description">
              Group Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the purpose and goals of your study group..."
              className={`form-textarea ${validationErrors.description ? 'input-error' : ''}`}
              maxLength={500}
              rows={5}
              disabled={loading}
            />
            <div className="form-meta">
              <span className="char-count">
                {getCharCount(formData.description.length, 500)}
              </span>
              {validationErrors.description && (
                <span className="error-text">{validationErrors.description}</span>
              )}
            </div>
          </div>

          {/* Subject Field */}
          <div className="form-group">
            <label htmlFor="subject">
              Subject (Μάθημα) <span className="required">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={`form-select ${validationErrors.subject ? 'input-error' : ''}`}
              disabled={loading}
            >
              <option value="">-- Select a Subject --</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
            {validationErrors.subject && (
              <span className="error-text">{validationErrors.subject}</span>
            )}
          </div>

          {/* Visibility Field */}
          <div className="form-group">
            <label htmlFor="visibility">
              Visibility <span className="required">*</span>
            </label>
            <div className="visibility-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="visibility"
                  value="Public"
                  checked={formData.visibility === 'Public'}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className="radio-text">
                  <strong>Public</strong>
                  <span className="radio-description">
                    Anyone can see and join this group
                  </span>
                </span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="visibility"
                  value="Private"
                  checked={formData.visibility === 'Private'}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className="radio-text">
                  <strong>Private</strong>
                  <span className="radio-description">
                    Only invited members can see and join this group
                  </span>
                </span>
              </label>
            </div>
            {validationErrors.visibility && (
              <span className="error-text">{validationErrors.visibility}</span>
            )}
          </div>

          {/* Coordinator Info */}
          <div className="coordinator-info">
            <div className="info-icon">👤</div>
            <div className="info-content">
              <p className="info-title">Coordinator Role (Συντονιστής)</p>
              <p className="info-description">
                You will automatically be assigned as the Coordinator of this group.
                As Coordinator, you can manage group settings, invite members, and
                moderate discussions.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Creating Group...
                </>
              ) : (
                'Create Group'
              )}
            </button>
          </div>
        </form>

        {/* Form Footer */}
        <div className="form-footer">
          <p>
            💡 <strong>Tip:</strong> Choose your visibility setting carefully.
            Public groups will be visible in search results, while private groups
            are only accessible to invited members.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
