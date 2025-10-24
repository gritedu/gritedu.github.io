import { markDone, ratio } from './progress.js';

function qs(key){ 
  return new URL(location.href).searchParams.get(key); 
}

async function loadCourse(){
  const id = qs('id') || 'lin-alg-101'; // 기본
  const courseRes = await fetch('/data/courses.json');
  const course = (await courseRes.json()).find(c => c.id === id);
  if(!course) return;

  document.getElementById('courseTitle').textContent = course.title;

  const plRes = await fetch(course.lessons_src);
  const pl = await plRes.json();
  const lessons = pl.lessons || [];

  const listEl = document.getElementById('lessonList');
  listEl.innerHTML = lessons.map((l, idx) => `
    <li data-lesson="${l.id}">
      <button style="width:100%;text-align:left" onclick="play('${course.id}','${l.id}','${l.youtube_id}')">
        ${idx+1}. ${l.title} (${l.duration_min}m)
      </button>
    </li>
  `).join('');

  window.play = (courseId, lessonId, yt) => {
    const iframe = document.getElementById('ytFrame');
    iframe.src = `https://www.youtube.com/embed/${yt}?rel=0&modestbranding=1`;
    renderResources(lessons.find(l=>l.id===lessonId));
    markDone(courseId, lessonId);
    updateProgress(courseId, lessons.length);
  };

  // 첫 레슨 자동 로드
  if(lessons.length) window.play(course.id, lessons[0].id, lessons[0].youtube_id);
  updateProgress(course.id, lessons.length);
}

function renderResources(lesson){
  const box = document.getElementById('resources');
  const arr = lesson?.resources || [];
  box.innerHTML = arr.length ? `<h3>자료</h3><ul>${
    arr.map(r=>`<li><a href="${r.url}" target="_blank">${r.title}</a></li>`).join('')
  }</ul>` : '';
}

function updateProgress(courseId, total){
  const fill = document.getElementById('progressFill');
  fill.style.width = ratio(courseId, total) + '%';
}

document.addEventListener('DOMContentLoaded', loadCourse);
