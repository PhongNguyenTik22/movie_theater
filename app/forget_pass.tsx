import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert,
    StatusBar, ScrollView
} from 'react-native';
import {sendPasswordResetEmail} from 'firebase/auth';
import { auth } from '../FirebaseConfig.ts';
import {Colors, styles} from "./default_style.tsx"
import {router, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";


export default function ResetPassScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');

    const handleResetPass = async () => {
        if (!email)
            return Alert.alert('Lỗi", "Vui lòng điền email!');

        try {
            await sendPasswordResetEmail(auth, email);

            Alert.alert("Thành công",
                "Link thay đổi mật khẩu đã được gửi tới email của bạn");
            router.push("/App");

        } catch (error: any) {
            Alert.alert('Lỗi không thể thay đổi mật khẩu', error.message);
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
                    <Text style={styles.signUpTitle}>Quên mật khẩu</Text>
                    <Text style={styles.loginSubTitle}>Nhập email của bạn để làm lại mật khẩu</Text>
                </View>

                {/* FORM */}
                <View style={styles.loginForm}>

                    <Text style={styles.signUpLabel}>Email</Text>
                    <TextInput
                        style={styles.loginInput}
                        placeholder="email123@gmail.com"
                        placeholderTextColor={Colors.loginText}
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* NÚT ĐĂNG KÝ */}
                    <TouchableOpacity style={styles.loginBtnPrimary} onPress={handleResetPass}>
                        <Text style={styles.loginBtnText}>Gửi yêu cầu</Text>
                    </TouchableOpacity>

                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    {/*<Text style={styles.footerText}>Đăng nhập </Text>*/}
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.signUpLinkText}>Quay lại đăng nhập</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};


