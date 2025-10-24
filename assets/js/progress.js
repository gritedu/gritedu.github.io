const KEY = 'lms_progress';

export function getProgress(){ 
  try { 
    return JSON.parse(localStorage.getItem(KEY)||'{}'); 
  } catch { 
    return {}; 
  } 
}

export function setProgress(p){ 
  localStorage.setItem(KEY, JSON.stringify(p)); 
}

export function markDone(courseId, lessonId){
  const p = getProgress();
  p[courseId] ??= { completed: [], lastPlayed: null, ts: 0 };
  if(!p[courseId].completed.includes(lessonId)) p[courseId].completed.push(lessonId);
  p[courseId].lastPlayed = lessonId; 
  p[courseId].ts = Date.now(); 
  setProgress(p);
}

export function ratio(courseId, total){
  const p = getProgress()[courseId]; 
  if(!p) return 0;
  return Math.min(100, Math.round((p.completed.length / Math.max(1,total))*100));
}
