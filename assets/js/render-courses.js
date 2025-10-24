async function loadCourses(){
  try {
    const res = await fetch('/data/courses.json');
    const courses = await res.json();
    
    const container = document.getElementById('coursesGrid');
    if(!container) return;
    
    container.innerHTML = courses.map(course => `
      <div class="card course-card">
        <img src="${course.thumbnail}" alt="${course.title}" onerror="this.src='/assets/banner_main.png'">
        <div style="padding: 16px;">
          <h3>${course.title}</h3>
          <p>${course.summary}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
            <span style="color: var(--muted); font-size: 14px;">${course.estimated_hours}시간</span>
            <a href="/course.html?id=${course.id}" class="btn primary">시작하기</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load courses:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadCourses);
