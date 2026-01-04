// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import {RootStackParamList} from "./index.tsx";
//
// // Firebase Imports
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, db } from '../FirebaseConfig.ts';
// import styles from "./default_style.tsx";
// import {NativeStackNavigationProp} from "@react-navigation/native-stack";
//
// type navigation_prop = NativeStackNavigationProp<RootStackParamList, 'log_in'>
//
// // --- Login Screen ---
// export default function LoginScreen  () {
//     const navigation = useNavigation<navigation_prop>();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//
//     const handleLogin = async () => {
//         if (!email || !password) {
//             Alert.alert('Error', 'Please enter email and password');
//             return;
//         }
//
//         setLoading(true);
//
//         try {
//             // 1. Authenticate with Firebase Auth
//             // This checks the password securely on Google's servers
//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;
//
//             // 2. If Auth successful, get the UID
//             const uid = user.uid;
//
//             // 3. Check Firestore for the Role using the UID
//             const userDocRef = doc(db, 'users', uid);
//             const userSnap = await getDoc(userDocRef);
//
//             if (userSnap.exists()) {
//                 const userData = userSnap.data();
//                 const role = userData.role;
//
//                 // 4. Route based on Role
//                 if (role === 'admin') {
//                     navigation.replace('home_admin');
//                 } else if (role === 'guest') {
//                     navigation.replace('home_guest');
//                 } else {
//                     Alert.alert('Access Denied', 'Your account has no assigned role.');
//                     // Optional: Force logout if they have no role
//                     auth.signOut();
//                 }
//             } else {
//                 Alert.alert('Error', 'User profile data not found in database.');
//             }
//
//         } catch (error: any) {
//             // Firebase Auth errors (e.g., wrong password, user not found)
//             let errorMessage = error.code;
//             if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email format.';
//             if (error.code === 'auth/user-not-found') errorMessage = 'User not found.';
//             if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
//
//             Alert.alert('Login Error', errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <View style={styles.loginContainer}>
//             <Text style={styles.loginHeader}>Secure Login</Text>
//
//             <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//             />
//
//             <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//             />
//
//             {loading ? (
//                 <ActivityIndicator size="large" color="#007AFF" />
//             ) : (
//                 <TouchableOpacity style={styles.button} onPress={handleLogin}>
//                     <Text style={styles.buttonText}>Log In</Text>
//                 </TouchableOpacity>
//             )}
//
//             <TouchableOpacity onPress={() => navigation.navigate('sign_up')} style={styles.linkButton}>
//                 <Text style={styles.linkText}>Do not have an account? Sign Up</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };
//
//
