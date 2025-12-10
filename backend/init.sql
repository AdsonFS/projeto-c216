-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255),
  color VARCHAR(7) DEFAULT '#007bff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS todo_categories (
  todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (todo_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_todo_categories_todo_id ON todo_categories(todo_id);
CREATE INDEX IF NOT EXISTS idx_todo_categories_category_id ON todo_categories(category_id);

-- Insert sample categories
INSERT INTO categories (name, description, color) VALUES
('Work', 'Professional tasks and projects', '#FF6B6B'),
('Personal', 'Personal errands and activities', '#4ECDC4'),
('Study', 'Learning and educational tasks', '#45B7D1'),
('Health', 'Health and fitness related tasks', '#96CEB4'),
('Shopping', 'Items to buy and shopping lists', '#FFEAA7')
ON CONFLICT (name) DO NOTHING;

-- Insert sample todos
INSERT INTO todos (title, description, completed, due_date) VALUES
('Setup development environment', 'Configure Docker, React, NestJS and PostgreSQL', true, NULL),
('Create TODO API', 'Implement CRUD operations for todos', false, '2025-12-15 17:00:00'),
('Build React frontend', 'Create user interface for managing todos', false, '2025-12-20 12:00:00'),
('Implement category system', 'Add category management functionality', false, '2025-12-18 15:30:00'),
('Write documentation', 'Complete project documentation', false, '2025-12-25 10:00:00')
ON CONFLICT DO NOTHING;

-- Associate todos with categories (sample data)
INSERT INTO todo_categories (todo_id, category_id)
SELECT t.id, c.id FROM todos t, categories c
WHERE (t.title = 'Setup development environment' AND c.name = 'Work')
   OR (t.title = 'Create TODO API' AND c.name = 'Work')
   OR (t.title = 'Build React frontend' AND c.name = 'Work')
   OR (t.title = 'Implement category system' AND c.name = 'Work')
   OR (t.title = 'Write documentation' AND c.name = 'Work')
   OR (t.title = 'Build React frontend' AND c.name = 'Study')
   OR (t.title = 'Implement category system' AND c.name = 'Study')
ON CONFLICT DO NOTHING;
