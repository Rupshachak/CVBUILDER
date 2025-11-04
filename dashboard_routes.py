from flask import Blueprint, render_template, session, redirect, url_for, flash
from models import get_db

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('Please login first.', 'warning')
        return redirect(url_for('auth.login'))
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC', (session['user_id'],))
    resumes = c.fetchall()
    conn.close()
    return render_template('dashboard.html', email=session['email'], resumes=resumes)
