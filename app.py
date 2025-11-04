from flask import Flask, render_template
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'

# Create directories if they don't exist
os.makedirs('generated_resumes', exist_ok=True)
os.makedirs('database', exist_ok=True)

# Import blueprints 
from auth_routes import auth_bp
from dashboard_routes import dashboard_bp
from resume_routes import resume_bp

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(resume_bp)

@app.route('/')
def index():
    """Landing page"""
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)