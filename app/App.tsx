import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

// Firebase Imports
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../FirebaseConfig.ts';
import {Colors, styles} from "./default_style.tsx";
import {useRouter} from "expo-router";

// --- Login Screen ---
export default function App () {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Hãy nhập đầy đủ thông tin');
            return;
        }

        try {
            // 1. Authenticate with Firebase Auth
            // This checks the password securely on Google's servers
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. If Auth successful, get the UID
            const uid = user.uid;

            // 3. Check Firestore for the Role using the UID
            const userDocRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const role = userData.role;

                // 4. Route based on Role
                if (role === 'admin') {
                    router.push("/admin/home_admin");
                } else if (role === 'guest') {

                    await user.reload();
                    if (!user.emailVerified) {
                        Alert.alert("Lỗi", "Email chưa được xác thực")
                        return
                    }

                    router.push({
                        pathname: "/guest/home_guest",
                        params: {
                            user: uid
                        }
                    });
                }
            }
        } catch (error: any) {
            // Firebase Auth errors (e.g., wrong password, user not found)
            let errorMessage = error.code;
            if (error.code === 'auth/invalid-email') errorMessage = 'Email không đúng cú pháp';
            if (error.code === 'auth/user-not-found') errorMessage = 'Không tìm thấy nguười dùng';
            if (error.code === 'auth/wrong-password') errorMessage = 'Sai mật khẩu';

            Alert.alert('Lỗi đăng nhập', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo hoặc Tên App */}
            <View style={styles.loginHeader}>
                <Text style={styles.loginAppName}>CINEBOOK</Text>
                <Text style={styles.loginSubTitle}>Đặt vé phim online</Text>
            </View>

            {/* Form Nhập liệu */}
            <View style={styles.loginForm}>
                <TextInput
                    placeholder="Email"
                    style={styles.loginInput}
                    placeholderTextColor={Colors.textLight}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Mật khẩu"
                    secureTextEntry
                    style={styles.loginInput}
                    placeholderTextColor={Colors.textLight}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.loginBtnPrimary} onPress={handleLogin}>
                    <Text style={styles.loginBtnText}>Đăng nhập</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/sign_up")}>
                    <Text style={styles.LinkText}>Chưa có tài khoản? <Text style={{color: Colors.primary, fontWeight: 'bold'}}>Đăng ký</Text></Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> router.push("./forget_pass")}>
                    <Text style={styles.LinkText}><Text style={{fontWeight: 'bold'}}>Quên mật khẩu?</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


