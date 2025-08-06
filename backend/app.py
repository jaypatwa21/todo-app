from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from flask_mail import Mail
from dotenv import load_dotenv
import os
from datetime import timedelta

# Import our modules
from models import db, User, Todo
from auth import token_required, verify_google_token
from email_service import send_todo_created_email

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Database configuration
database_url = os.getenv('DATABASE_URL', 'sqlite:///todoapp.db')
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Mail configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)
mail = Mail(app)
CORS(app)

# Create tables
with app.app_context():
    db.create_all()

# Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'To-Do API is running'})

# Authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'message': 'Email, password, and name are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'message': 'User already exists'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            name=data['name']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error creating user: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'message': f'Error during login: {str(e)}'}), 500

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    try:
        data = request.get_json()
        
        if not data or not data.get('token'):
            return jsonify({'message': 'Google token is required'}), 400
        
        # Verify Google token
        user_info = verify_google_token(data['token'])
        
        if not user_info:
            return jsonify({'message': 'Invalid Google token'}), 401
        
        # Check if user exists
        user = User.query.filter_by(email=user_info['email']).first()
        
        if not user:
            # Create new user
            user = User(
                email=user_info['email'],
                name=user_info['name'],
                google_id=user_info['google_id']
            )
            db.session.add(user)
            db.session.commit()
        else:
            # Update Google ID if not set
            if not user.google_id:
                user.google_id = user_info['google_id']
                db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Google authentication successful',
            'access_token': access_token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'message': f'Error during Google authentication: {str(e)}'}), 500

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user.to_dict()})

# Todo routes
@app.route('/api/todos', methods=['GET'])
@token_required
def get_todos(current_user):
    try:
        todos = Todo.query.filter_by(user_id=current_user.id).order_by(Todo.created_at.desc()).all()
        return jsonify({
            'todos': [todo.to_dict() for todo in todos]
        })
    except Exception as e:
        return jsonify({'message': f'Error fetching todos: {str(e)}'}), 500

@app.route('/api/todos', methods=['POST'])
@token_required
def create_todo(current_user):
    try:
        data = request.get_json()
        
        if not data or not data.get('title'):
            return jsonify({'message': 'Title is required'}), 400
        
        todo = Todo(
            title=data['title'],
            description=data.get('description', ''),
            user_id=current_user.id
        )
        
        db.session.add(todo)
        db.session.commit()
        
        # Send email notification
        try:
            send_todo_created_email(
                mail, 
                current_user.email, 
                current_user.name, 
                todo.title
            )
        except Exception as email_error:
            print(f"Email sending failed: {str(email_error)}")
            # Don't fail the todo creation if email fails
        
        return jsonify({
            'message': 'Todo created successfully',
            'todo': todo.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error creating todo: {str(e)}'}), 500

@app.route('/api/todos/<int:todo_id>', methods=['GET'])
@token_required
def get_todo(current_user, todo_id):
    try:
        todo = Todo.query.filter_by(id=todo_id, user_id=current_user.id).first()
        
        if not todo:
            return jsonify({'message': 'Todo not found'}), 404
        
        return jsonify({'todo': todo.to_dict()})
        
    except Exception as e:
        return jsonify({'message': f'Error fetching todo: {str(e)}'}), 500

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
@token_required
def update_todo(current_user, todo_id):
    try:
        todo = Todo.query.filter_by(id=todo_id, user_id=current_user.id).first()
        
        if not todo:
            return jsonify({'message': 'Todo not found'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            todo.title = data['title']
        if 'description' in data:
            todo.description = data['description']
        if 'completed' in data:
            todo.completed = data['completed']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Todo updated successfully',
            'todo': todo.to_dict()
        })
        
    except Exception as e:
        return jsonify({'message': f'Error updating todo: {str(e)}'}), 500

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
@token_required
def delete_todo(current_user, todo_id):
    try:
        todo = Todo.query.filter_by(id=todo_id, user_id=current_user.id).first()
        
        if not todo:
            return jsonify({'message': 'Todo not found'}), 404
        
        db.session.delete(todo)
        db.session.commit()
        
        return jsonify({'message': 'Todo deleted successfully'})
        
    except Exception as e:
        return jsonify({'message': f'Error deleting todo: {str(e)}'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
