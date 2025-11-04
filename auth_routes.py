from flask import Blueprint, request, render_template, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from models import get_db  # Import from models.py
import sqlite3
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)


# HELPER FUNCTIONS


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """
    Validate password strength
    Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Valid"

def login_required(f):
    """Decorator to protect routes that require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function


# SIGNUP ROUTE


@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        
        # Validation
        if not email or not password:
            flash('Email and password are required.', 'danger')
            return render_template('signup.html')
        
        if not validate_email(email):
            flash('Please enter a valid email address.', 'danger')
            return render_template('signup.html')
        
        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('signup.html')
        
        is_valid, message = validate_password(password)
        if not is_valid:
            flash(message, 'danger')
            return render_template('signup.html')
        
        # Hash password
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
        # Database insertion
        conn = None
        try:
            conn = get_db()
            c = conn.cursor()
            c.execute('INSERT INTO users (email, password) VALUES (?, ?)', 
                     (email, hashed_password))
            conn.commit()
            
            logger.info(f"New user registered: {email}")
            flash('Signup successful! Please log in.', 'success')
            return redirect(url_for('auth.login'))
            
        except sqlite3.IntegrityError:
            logger.warning(f"Signup attempt with existing email: {email}")
            flash('Email already exists. Please use a different one or log in.', 'danger')
            
        except Exception as e:
            logger.error(f"Signup error: {str(e)}")
            flash('An error occurred during signup. Please try again.', 'danger')
            
        finally:
            if conn:
                conn.close()
    
    return render_template('signup.html')


# LOGIN ROUTE


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    # Redirect if already logged in
    if 'user_id' in session:
        return redirect(url_for('resume.template_select'))
    
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        if not email or not password:
            flash('Email and password are required.', 'danger')
            return render_template('login.html')
        
        conn = None
        try:
            conn = get_db()
            conn.row_factory = sqlite3.Row
            c = conn.cursor()
            c.execute('SELECT id, email, password FROM users WHERE email = ?', (email,))
            user = c.fetchone()
            
            if user and check_password_hash(user['password'], password):
                # Successful login
                session['user_id'] = user['id']
                session['email'] = user['email']
                session.permanent = True  # Use permanent session with timeout
                
                logger.info(f"User logged in: {email}")
                flash('Login successful!', 'success')
                
                # Redirect to next page if specified, otherwise template selection
                next_page = request.args.get('next')
                if next_page:
                    return redirect(next_page)
                return redirect(url_for('resume.template_select'))
            else:
                # Failed login
                logger.warning(f"Failed login attempt for: {email}")
                flash('Invalid email or password.', 'danger')
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            flash('An error occurred during login. Please try again.', 'danger')
            
        finally:
            if conn:
                conn.close()
    
    return render_template('login.html')


# LOGOUT ROUTE


@auth_bp.route('/logout')
def logout():
    email = session.get('email', 'Unknown')
    session.clear()
    logger.info(f"User logged out: {email}")
    flash('Logged out successfully.', 'info')
    return redirect(url_for('index'))
