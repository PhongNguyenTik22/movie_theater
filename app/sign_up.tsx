// screens/SignUpScreen.tsx
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert,
    StatusBar, ScrollView
} from 'react-native';
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../FirebaseConfig.ts';
import {Colors, styles} from "./default_style.tsx"
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";


export default function SignUpScreen() {
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPass, setShowPass] = useState(false);

    const handleSignUp = async () => {
        if (!fullName || !phone || !email || !password)
            return Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");

        if (password !== confirmPassword)
            return Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp!");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await sendEmailVerification(user);

            await setDoc(doc(db, 'users', user.uid), {
                role: 'guest',
                fullName: fullName,
                phone: phone,
                email: email
            });

            Alert.alert("Thành công",
                "Tài khoản đã được tạo. Vui lòng kiểm tra email để xác nhận tạo tài khoản.");
            router.push("/App");

        } catch (error: any) {
            let errorMessage = error.code;
            if (error.code === 'auth/invalid-email') errorMessage = 'Email không đúng cú pháp';
            if (error.code === 'auth/user-not-found') errorMessage = 'Không tìm thấy nguười dùng';
            if (error.code === 'auth/wrong-password') errorMessage = 'Sai mật khẩu';
            if (error.code === 'auth/email-already-in-use') errorMessage = 'Email đã được dùng để đăng kí cho một tài khoản khác';

            Alert.alert('Lỗi', errorMessage);
            return
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Nút Back nhỏ ở góc trên */}
            <TouchableOpacity style={styles.signUpBackButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.signUpScrollContent} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <View style={styles.signUpHeader}>
                    <Text style={styles.signUpTitle}>Tạo tài khoản</Text>
                    <Text style={styles.loginSubTitle}>Đăng ký thành viên CineBook ngay</Text>
                </View>

                {/* FORM */}
                <View style={styles.loginForm}>

                    <Text style={styles.signUpLabel}>Họ và tên</Text>
                    <TextInput
                        style={styles.loginInput}
                        placeholder="Nguyễn Văn A"
                        placeholderTextColor={Colors.loginText}
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <Text style={styles.signUpLabel}>Số điện thoại</Text>
                    <TextInput
                        style={styles.loginInput}
                        placeholder="0912xxxxxx"
                        keyboardType="phone-pad"
                        placeholderTextColor={Colors.loginText}
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <Text style={styles.signUpLabel}>Email</Text>
                    <TextInput
                        style={styles.loginInput}
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        placeholderTextColor={Colors.loginText}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.signUpLabel}>Mật khẩu</Text>
                    <View style={styles.loginPasswordContainer}>
                        <TextInput
                            style={styles.loginInputPass}
                            placeholder="Nhập mật khẩu"
                            secureTextEntry={!showPass}
                            placeholderTextColor={Colors.loginText}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.loginEyeIcon}>
                            <Ionicons name={showPass ? "eye-off" : "eye"} size={20} color={Colors.gray} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.signUpLabel}>Xác nhận mật khẩu</Text>
                    <TextInput
                        style={styles.loginInput}
                        placeholder="Nhập lại mật khẩu"
                        secureTextEntry={!showPass}
                        placeholderTextColor={Colors.loginText}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    {/* NÚT ĐĂNG KÝ */}
                    <TouchableOpacity style={styles.loginBtnPrimary} onPress={handleSignUp}>
                        <Text style={styles.loginBtnText}>ĐĂNG KÝ</Text>
                    </TouchableOpacity>

                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.signUpLinkText}>Đăng nhập ngay</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    )};


