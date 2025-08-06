import React, { useState } from 'react';
import { Todo } from '../services/api';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    setIsLoading(true);
    try {
      await onUpdate(todo.id, { 
        title: editTitle.trim(), 
        description: editDescription.trim() 
      });
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsLoading(true);
      try {
        await onDelete(todo.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: todo.completed ? '#f8f9fa' : 'white',
      opacity: todo.completed ? 0.8 : 1
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={isLoading}
          style={{
            width: '18px',
            height: '18px',
            marginTop: '0.25rem',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        />

        {/* Content */}
        <div style={{ flex: 1 }}>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  marginBottom: '0.5rem',
                  boxSizing: 'border-box'
                }}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ) : (
            <div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.125rem',
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#666' : '#333'
              }}>
                {todo.title}
              </h3>
              {todo.description && (
                <p style={{
                  margin: '0 0 0.75rem 0',
                  color: '#666',
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                  textDecoration: todo.completed ? 'line-through' : 'none'
                }}>
                  {todo.description}
                </p>
              )}
            </div>
          )}

          {/* Metadata */}
          <div style={{
            fontSize: '0.75rem',
            color: '#999',
            marginTop: '0.5rem'
          }}>
            Created: {formatDate(todo.created_at)}
            {todo.updated_at !== todo.created_at && (
              <span> • Updated: {formatDate(todo.updated_at)}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                disabled={isLoading || !editTitle.trim()}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading || !editTitle.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
