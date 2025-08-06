import React, { useState } from 'react';

interface AddTodoProps {
  onAddTodo: (todoData: { title: string; description: string }) => Promise<void>;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onAddTodo({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        style={{
          padding: '0.75rem 2rem',
          backgroundColor: isLoading || !title.trim() ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: isLoading || !title.trim() ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
};

export default AddTodo;
