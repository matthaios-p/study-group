import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GroupCard, { GroupCardProps } from './GroupCard';
import './SearchGroupsWithJoin.css';

/**
 * SearchGroupsWithJoin Component
 *
 * Displays searchable and filterable list of study groups with join functionality.
 * Features:
 * - Filter groups by subject, members, date
 * - Display groups using GroupCard component
 * - Handle join requests with approval workflow
 * - Real-time updates
 */

interface StudyGroup extends GroupCardProps {}

interface FilterCriteria {
  subject: string;
  minMembers: number;
  maxMembers: number;
  startDate: string;
  endDate: string;
}

const SearchGroupsWithJoin: React.FC = () => {
  // State management
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterCriteria>({
    subject: '',
    minMembers: 0,
    maxMembers: 100,
    startDate: '',
    endDate: '',
  });

  // Current user ID (should come from auth context in real app)
  const currentUserId = 'user_123';

  /**
   * Fetch all groups on component mount
   */
  useEffect(() => {
    fetchGroups();
    fetchSubjects();
  }, []);

  /**
   * Fetch study groups from backend
   */
  const fetchGroups = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/groups');
      setGroups(response.data);
      setFilteredGroups(response.data);
    } catch (err) {
      setError('Failed to fetch study groups. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch available subjects
   */
  const fetchSubjects = async (): Promise<void> => {
    try {
      const response = await axios.get('/api/groups/subjects');
      setSubjects(response.data);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  /**
   * Apply filters to groups
   */
  const applyFilters = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/groups/search', filters);
      setFilteredGroups(response.data);
    } catch (err) {
      setError('Failed to apply filters. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name.includes('Members') ? parseInt(value) || 0 : value,
    }));
  };

  /**
   * Reset all filters
   */
  const resetFilters = (): void => {
    setFilters({
      subject: '',
      minMembers: 0,
      maxMembers: 100,
      startDate: '',
      endDate: '',
    });
    setFilteredGroups(groups);
  };

  /**
   * Handle successful join
   */
  const handleJoinSuccess = (groupId: string, message: string): void => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="search-groups-with-join-container">
      <header className="search-header">
        <h1>Find & Join Study Groups</h1>
        <p>Discover study groups and join based on your interests</p>
      </header>

      {/* Global Success Message */}
      {successMessage && (
        <div className="global-success-message">
          ✅ {successMessage}
        </div>
      )}

      {/* Filter Section */}
      <section className="filter-section">
        <h2>Filter Groups</h2>
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="subject">Subject (Μάθημα)</label>
            <select
              id="subject"
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="filter-input"
            >
              <option value="">All Subjects</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="minMembers">Minimum Members</label>
            <input
              id="minMembers"
              type="number"
              name="minMembers"
              value={filters.minMembers}
              onChange={handleFilterChange}
              className="filter-input"
              min="0"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxMembers">Maximum Members</label>
            <input
              id="maxMembers"
              type="number"
              name="maxMembers"
              value={filters.maxMembers}
              onChange={handleFilterChange}
              className="filter-input"
              min="0"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={applyFilters} className="btn btn-primary">
            Apply Filters
          </button>
          <button onClick={resetFilters} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading groups...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Results Section */}
      {!loading && !error && (
        <section className="results-section">
          <h2>Study Groups ({filteredGroups.length})</h2>

          {filteredGroups.length === 0 ? (
            <div className="no-results">
              <p>No study groups found matching your criteria.</p>
              <button onClick={resetFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="groups-grid">
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  {...group}
                  userId={currentUserId}
                  onJoinSuccess={handleJoinSuccess}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SearchGroupsWithJoin;
