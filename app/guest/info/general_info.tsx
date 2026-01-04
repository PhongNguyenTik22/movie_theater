import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const router = useRouter();

    // Hàm đăng xuất giả lập
    const handleLogout = () => {
        // Xóa lịch sử và quay về trang Login
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Profile */}
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/300' }} // Avatar giả
                    style={styles.avatar}
                />
                <Text style={styles.name}>Sinh Viên IT</Text>
                <Text style={styles.email}>sinhvien@university.edu.vn</Text>
            </View>

            {/* Menu Options */}
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Cài đặt</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="card-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Thanh toán</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Trợ giúp</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', marginBottom: 20 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
    name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    email: { color: '#888' },

    menu: { backgroundColor: '#fff', paddingHorizontal: 20 },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 15,
        borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
    },
    menuText: { flex: 1, marginLeft: 15, fontSize: 16 },

    btnLogout: { margin: 20, backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, alignItems: 'center' },
    logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});