// Firebase 구성: 콘솔에서 복사한 값 그대로 사용
const firebaseConfig = {
  apiKey: "AIzaSyCYZXuZ5ZGRgSEzvEGfbaUg6ViiyidSVKU",
  authDomain: "gritedu-lms.firebaseapp.com",
  projectId: "gritedu-lms",
  storageBucket: "gritedu-lms.firebasestorage.app",
  messagingSenderId: "789104307613",
  appId: "1:789104307613:web:0d6acf64a261a1a86d9374"
};

// 초기화 (compat)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM 헬퍼
const $ = s => document.querySelector(s);
const email = () => $('#email').value.trim();
const pw = () => $('#pw').value;
const who = $('#who');
const logoutBtn = $('#logout');

// 이벤트
$('#signup').onclick = async () => {
  await auth.createUserWithEmailAndPassword(email(), pw());
};
$('#login').onclick = async () => {
  await auth.signInWithEmailAndPassword(email(), pw());
};
logoutBtn.onclick = async () => auth.signOut();

// 상태 표시
auth.onAuthStateChanged(u => {
  if (u) {
    who.textContent = `로그인됨: ${u.email}`;
    logoutBtn.style.display = 'inline-block';
  } else {
    who.textContent = '로그아웃 상태';
    logoutBtn.style.display = 'none';
  }
});
