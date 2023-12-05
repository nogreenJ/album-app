import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, GithubAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "sss",
    authDomain: "sss",
    projectId: "sss",
    storageBucket: "sss",
    messagingSenderId: "sss",
    appId: "sss"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

//export default firebaseApp;

const googleProvider = new GoogleAuthProvider();
const gitProvider = new GithubAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const signInWithGit = async () => {
    try {
        const res = await signInWithPopup(auth, gitProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    signInWithGoogle, signInWithGit,
    logout,
};