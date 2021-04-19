import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/storage'
var firebaseConfig = {
    apiKey: "AIzaSyD-i6zi-KAx7n_3RHgM9RAooUowW2q7rVs",
    authDomain: "jvn-insert.firebaseapp.com",
    databaseURL: "https://jvn-insert.firebaseio.com",
    projectId: "jvn-insert",
    storageBucket: "jvn-insert.appspot.com",
    messagingSenderId: "193407990562",
    appId: "1:193407990562:web:ca36c8c5270934b353437b",
    measurementId: "G-TMFDG76MJS"
}
firebase.initializeApp(firebaseConfig);

export default firebase