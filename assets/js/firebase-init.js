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

// 탭/창 닫으면 자동 로그아웃(세션 보존만)
setPersistence(auth, browserSessionPersistence).catch(console.error);

// 보호 페이지 가드
export function guardPage(redirectUrl = "/login.html") {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        location.href = redirectUrl;
        return;
      }
      resolve(user);
    });
  });
}

export { auth, signOut };