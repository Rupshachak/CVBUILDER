from flask import Blueprint, render_template, request, redirect, url_for, flash, session, send_from_directory, send_file
from models import get_db
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from datetime import datetime
import os

resume_bp = Blueprint('resume', __name__)
os.makedirs("static/resumes", exist_ok=True)

# ---------- TEMPLATE SELECTION ----------
@resume_bp.route('/template_select')
def template_select():
    if 'user_id' not in session:
        flash('Please login to continue.', 'warning')
        return redirect(url_for('auth.login'))
    return render_template('template_select.html', 
                         username=session.get('email', '').split('@')[0],
                         email=session['email'])

# ---------- RESUME FORM ----------
@resume_bp.route('/resume_form/<template_style>')
def resume_form(template_style):
    if 'user_id' not in session:
        flash('Please login to build your resume.', 'warning')
        return redirect(url_for('auth.login'))
    return render_template('resume_form.html', email=session['email'], template_style=template_style)

# ---------- GENERATE PDF + SAVE + DOWNLOAD ----------
@resume_bp.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    if 'user_id' not in session:
        flash('Please login to generate a resume.', 'warning')
        return redirect(url_for('auth.login'))
    
    # Store the download flag
    should_download = True

    # Get basic form data
    name = request.form.get('name', 'Unnamed').strip()
    title = request.form.get('title', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    location = request.form.get('location', '').strip()
    linkedin = request.form.get('linkedin', '').strip()
    
    # Get education data
    education_degrees = request.form.getlist('education_degree[]')
    education_schools = request.form.getlist('education_school[]')
    education_years = request.form.getlist('education_year[]')
    
    # Get experience data
    experience_titles = request.form.getlist('experience_title[]')
    experience_companies = request.form.getlist('experience_company[]')
    experience_dates = request.form.getlist('experience_date[]')
    experience_descriptions = request.form.getlist('experience_description[]')
    
    # Get skills data
    skills_list = request.form.getlist('skills[]')
    
    template_style = request.form.get('template_style', 'modern')

    # Build education entries
    education_entries = []
    for i in range(len(education_degrees)):
        degree = education_degrees[i].strip() if i < len(education_degrees) else ''
        school = education_schools[i].strip() if i < len(education_schools) else ''
        year = education_years[i].strip() if i < len(education_years) else ''
        
        if degree or school or year:
            entry = []
            if degree:
                entry.append(degree)
            if school:
                entry.append(school)
            if year:
                entry.append(f"({year})")
            education_entries.append(' - '.join(entry))
    
    education = "\n".join(education_entries) if education_entries else "Not provided"
    
    # Build experience entries
    experience_entries = []
    for i in range(len(experience_titles)):
        job_title = experience_titles[i].strip() if i < len(experience_titles) else ''
        company = experience_companies[i].strip() if i < len(experience_companies) else ''
        date = experience_dates[i].strip() if i < len(experience_dates) else ''
        description = experience_descriptions[i].strip() if i < len(experience_descriptions) else ''
        
        if job_title or company or date or description:
            entry_parts = []
            
            # Title and date
            title_line = job_title
            if date:
                title_line += f" | {date}"
            if title_line:
                entry_parts.append(title_line)
            
            # Company
            if company:
                entry_parts.append(f"Company: {company}")
            
            # Description (bullet points)
            if description:
                desc_lines = [line.strip() for line in description.split('\n') if line.strip()]
                entry_parts.extend(desc_lines)
            
            if entry_parts:
                experience_entries.append('\n'.join(entry_parts))
    
    experience = "\n\n".join(experience_entries) if experience_entries else "Not provided"
    
    # Build skills
    all_skills = []
    for skill_input in skills_list:
        if skill_input.strip():
            # Split by comma
            skills = [s.strip() for s in skill_input.split(',') if s.strip()]
            all_skills.extend(skills)
    
    skills = ", ".join(all_skills) if all_skills else "Not provided"

    # Generate filename with timestamp
    safe_name = name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = f"{safe_name}_{template_style}_{timestamp}.pdf"
    file_path = os.path.join("static/resumes", filename)

    # Generate PDF
    try:
        pdf = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter

        # Template colors
        if template_style == "modern":
            header_color = colors.HexColor("#1E4DB4")
            accent_color = colors.HexColor("#1E4DB4")
            bottom_color = colors.HexColor("#508CFF")
        elif template_style == "creative":
            header_color = colors.HexColor("#28A079")
            accent_color = colors.HexColor("#1E805F")
            bottom_color = colors.HexColor("#63D8A2")
        else:  # simple
            header_color = colors.black
            accent_color = colors.black
            bottom_color = colors.gray

        # Header
        pdf.setFillColor(header_color)
        pdf.rect(0, height - 120, width, 120, fill=True, stroke=False)
        pdf.setFillColor(colors.white)
        pdf.setFont("Helvetica-Bold", 24)
        pdf.drawString(50, height - 60, name)
        
        # Title
        if title:
            pdf.setFont("Helvetica", 14)
            pdf.drawString(50, height - 80, title)
        
        # Contact info
        contact_parts = []
        if email:
            contact_parts.append(email)
        if phone:
            contact_parts.append(phone)
        if location:
            contact_parts.append(location)
        if linkedin:
            contact_parts.append(linkedin)
        
        if contact_parts:
            pdf.setFont("Helvetica", 11)
            pdf.drawString(50, height - 100, " | ".join(contact_parts))

        y = height - 150
        pdf.setStrokeColor(accent_color)
        pdf.setLineWidth(2)
        pdf.line(40, y, width - 40, y)
        y -= 30

        def draw_section(title_text, content):
            nonlocal y
            if not content or content == "Not provided":
                return
            
            # Section title
            pdf.setFont("Helvetica-Bold", 16)
            pdf.setFillColor(accent_color)
            pdf.drawString(50, y, title_text)
            y -= 22
            
            pdf.setFont("Helvetica", 11)
            pdf.setFillColor(colors.black)
            
            # Split content into lines
            lines = content.split("\n")
            for line in lines:
                if not line.strip():
                    y -= 8
                    continue
                
                # Check if line is a bullet point (starts with description from experience)
                if line and not line.startswith("Company:") and title_text == "EXPERIENCE":
                    # Check if this is a detail line (not title/company)
                    if not any(line.startswith(prefix) for prefix in ["Company:", "|"]):
                        # This is a bullet point
                        line = f"• {line}"
                        pdf.drawString(70, y, line)
                    else:
                        pdf.drawString(70, y, line)
                else:
                    pdf.drawString(70, y, line if title_text != "EDUCATION" else f"• {line}")
                
                y -= 16
                
                # Check for page overflow
                if y < 60:
                    pdf.showPage()
                    y = height - 80
                    pdf.setFont("Helvetica", 11)
                    pdf.setFillColor(colors.black)
            
            y -= 10

        draw_section("EDUCATION", education)
        draw_section("EXPERIENCE", experience)
        
        # Skills section
        if skills and skills != "Not provided":
            pdf.setFont("Helvetica-Bold", 16)
            pdf.setFillColor(accent_color)
            pdf.drawString(50, y, "SKILLS")
            y -= 22
            pdf.setFont("Helvetica", 11)
            pdf.setFillColor(colors.black)
            pdf.drawString(70, y, skills)
            y -= 20

        # Footer
        pdf.setFillColor(bottom_color)
        pdf.rect(0, 0, width, 20, fill=True, stroke=False)
        pdf.save()

    except Exception as e:
        flash(f'Error generating PDF: {str(e)}', 'danger')
        return redirect(url_for('resume.resume_form', template_style=template_style))

    # Save to database
    try:
        conn = get_db()
        c = conn.cursor()
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        c.execute('''INSERT INTO resumes 
                     (user_id, name, email, phone, education, experience, skills, template_style, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (session['user_id'], name, email, phone, education, experience, skills, template_style, created_at))
        conn.commit()
        conn.close()
        
        flash('Resume generated and downloaded successfully! Also saved to your dashboard.', 'success')
    except Exception as e:
        flash(f'Resume generated but database error: {str(e)}', 'warning')
    
    # Return the file for download
    return send_file(
        file_path,
        as_attachment=True,
        download_name=filename,
        mimetype='application/pdf'
    )

# ---------- VIEW RESUME (Opens in browser) ----------
@resume_bp.route('/view_resume/<filename>')
def view_resume(filename):
    if 'user_id' not in session:
        flash('Please login to view resumes.', 'warning')
        return redirect(url_for('auth.login'))
    
    file_path = os.path.join("static/resumes", filename)
    if not os.path.exists(file_path):
        flash('Resume file not found.', 'danger')
        return redirect(url_for('dashboard.dashboard'))
    
    # Send file for inline viewing (opens in browser)
    return send_file(file_path, mimetype='application/pdf')

# ---------- DOWNLOAD RESUME (Forces download) ----------
@resume_bp.route('/download_resume/<filename>')
def download_resume(filename):
    if 'user_id' not in session:
        flash('Please login to download resumes.', 'warning')
        return redirect(url_for('auth.login'))
    
    file_path = os.path.join("static/resumes", filename)
    if not os.path.exists(file_path):
        flash('Resume file not found.', 'danger')
        return redirect(url_for('dashboard.dashboard'))
    
    # Send file as attachment to force download
    return send_file(
        file_path,
        as_attachment=True,
        download_name=filename,
        mimetype='application/pdf'
    )

# ---------- DELETE RESUME ----------
@resume_bp.route('/delete_resume/<int:resume_id>')
def delete_resume(resume_id):
    if 'user_id' not in session:
        flash('Please login to delete resumes.', 'warning')
        return redirect(url_for('auth.login'))

    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT name, template_style, created_at FROM resumes WHERE id = ? AND user_id = ?', 
              (resume_id, session['user_id']))
    resume = c.fetchone()

    if resume:
        # Safely generate filename
        safe_name = (resume[0] or 'Unnamed').replace(' ', '_')
        safe_template = resume[1] or 'modern'
        safe_timestamp = (resume[2] or '').replace(':', '').replace('-', '').replace(' ', '')
        filename = f"{safe_name}_{safe_template}_{safe_timestamp}.pdf"
        
        file_path = os.path.join("static/resumes", filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error deleting file: {e}")

        c.execute('DELETE FROM resumes WHERE id = ? AND user_id = ?', (resume_id, session['user_id']))
        conn.commit()
        flash('Resume deleted successfully.', 'success')
    else:
        flash('Resume not found.', 'danger')

    conn.close()
    return redirect(url_for('dashboard.dashboard'))