// assets/js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYZXuZ5ZGRgSEzvEGfbaUg6ViiyidSVKU",
  authDomain: "gritedu-lms.firebaseapp.com",
  projectId: "gritedu-lms",
  storageBucket: "gritedu.firebasestorage.app",
  messagingSenderId: "789104307613",
  appId: "1:789104307613:web:0d6acf64a261a1a86d9374"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 창/탭 닫으면 자동 로그아웃되도록 세션 유지
await setPersistence(auth, browserSessionPersistence);

function guardPage(redirectUrl = "/login.html") {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => {
      if (!user) {
        reject("UNAUTHENTICATED");
        location.href = redirectUrl;
      } else {
        // 추가 권한 체크 가능: custom claims 등
        resolve(user);
      }
    });
  });
}

function handleLogout() {
  signOut(auth).then(() => {
    location.href = "/login.html";
  });
}

export { auth, guardPage, signOut };
