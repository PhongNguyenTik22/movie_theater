import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    SafeAreaView, Dimensions, Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {db} from '@/FirebaseConfig'
import {doc, getDoc, setDoc} from 'firebase/firestore';

const { width } = Dimensions.get('window');

// --- MÀU SẮC ---
const Colors = {
    primary: '#00ADEF',
    white: '#FFFFFF',
    bg: '#FFFFFF',
    grayBg: '#F3F4F6', // Màu nền xám nhạt của từng card
    text: '#1F2937',
    textGray: '#6B7280',
};

// --- DỮ LIỆU MOCK BẮP NƯỚC ---
const SNACK_MENU = [
    { id: 1, name: 'Combo 1', desc: '1 Bắp + 1 Nước', price: 80000, color: '#10B981', icon: 'fast-food' },
    { id: 2, name: 'Bắp Phô Mai', desc: 'Size L', price: 50000, color: '#F59E0B', icon: 'nutrition' },
    { id: 3, name: 'Nước Ngọt', desc: 'Pepsi/Coca', price: 35000, color: '#3B82F6', icon: 'beer' },
];

export default function SnackScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse dữ liệu ghế từ trang trước (đang dạng chuỗi 'A1,A2')
    //@ts-ignore
    const seatList = params.seats ? params.seats.split(',') : [];
    const ticketPrice = seatList.length * 90000; // Tính lại tiền vé

    // --- STATE QUẢN LÝ SỐ LƯỢNG ---
    // Tạo mảng state lưu số lượng từng món, mặc định là 0
    const [quantities, setQuantities] = useState([0, 0, 0, 0])

    // Hàm tăng giảm
    const updateQuantity = (id : number, change : number) => {
        setQuantities(prev => {
            const newQty = (prev[id] || 0) + change;
            if (newQty < 0) return prev; // Không cho âm
            return { ...prev, [id]: newQty };
        });
    };

    // Tính tổng tiền bắp nước
    const snackTotal = SNACK_MENU.reduce((total, item) => {
        return total + (item.price * (quantities[Number(item.id)] || 0));
    }, 0);

    const grandTotal = ticketPrice + snackTotal;

    const handleSetUpTicket = async (ticket: any)=> {
        try {
            let query = ticket.date + '_' + ticket.room + '_' + ticket.time + '_' + ticket.seats + '_';
            for (let i = 1 ; i < 4; i++) {
                query = query + String(quantities[i]) + ',';
            }
            query = query + '_' + ticket.user + '_' + ticket.name;

            const doc_id = ticket.date;
            const ref = doc(db, 'ticket', doc_id);
            const snapshot = await getDoc(ref);

            if (snapshot.exists()) {
                let data = snapshot.data();
                data.ticket.push(query);
                await setDoc(ref, data);
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Fetch data failed.")
        } finally {
            Alert.alert("Thành công", "Bạn đã đặt vé thành công!")
        }

    }

    return (
        <View style={styles.container}>

            {/* 1. HEADER */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.headerTitle}>Chọn Bắp Nước</Text>
                        <Text style={styles.headerSub}>Thêm combo để trải nghiệm tốt hơn</Text>
                    </View>
                </View>
            </View>

            {/* 2. DANH SÁCH COMBO */}
            <ScrollView contentContainerStyle={styles.body}>
                {SNACK_MENU.map((item) => {
                    const qty = quantities[Number(item.id)] || 0;
                    return (
                        <View key={item.id} style={styles.card}>

                            {/* Icon giả lập (Hình tròn màu) */}
                            <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                                {/* @ts-ignore */}
                                <Ionicons name={item.icon} size={24} color="white" />
                            </View>

                            {/* Thông tin */}
                            <View style={styles.infoBox}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemDesc}>{item.desc}</Text>
                                <Text style={styles.itemPrice}>{item.price.toLocaleString()}đ</Text>
                            </View>

                            {/* Bộ đếm Tăng/Giảm */}
                            <View style={styles.counterBox}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(Number(item.id), -1)}
                                    style={[styles.btnCounter, { backgroundColor: '#E5E7EB' }]}
                                >
                                    <Ionicons name="remove" size={20} color="#374151" />
                                </TouchableOpacity>

                                <Text style={styles.qtyText}>{qty}</Text>

                                <TouchableOpacity
                                    onPress={() => updateQuantity(Number(item.id), 1)}
                                    style={[styles.btnCounter, { backgroundColor: Colors.primary }]}
                                >
                                    <Ionicons name="add" size={20} color="white" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    );
                })}
            </ScrollView>

            {/* 3. FOOTER TÍNH TIỀN */}
            <View style={styles.footer}>

                {/* Dòng tính tiền chi tiết */}
                <View style={styles.rowInfo}>
                    <Text style={styles.label}>Vé ({seatList.length}x):</Text>
                    <Text style={styles.value}>{ticketPrice.toLocaleString()}đ</Text>
                </View>
                <View style={[styles.rowInfo, {marginBottom: 10}]}>
                    <Text style={styles.label}>Bắp nước:</Text>
                    <Text style={styles.value}>{snackTotal.toLocaleString()}đ</Text>
                </View>

                {/* Tổng cộng & Nút bấm */}
                <View style={styles.totalRow}>
                    <View>
                        <Text style={{fontSize: 12, color: '#6B7280'}}>Tổng cộng</Text>
                        <Text style={styles.totalPrice}>{grandTotal.toLocaleString()}đ</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.btnNext}
                        onPress={() => {
                            handleSetUpTicket(params);
                            router.push({
                                pathname: '/guest/home_guest',
                                params: {
                                    user: params.user
                                }
                            })
                        }}
                    >
                        <Text style={styles.btnText}>TIẾP TỤC</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },

    header: { backgroundColor: Colors.primary, paddingTop: 40, paddingBottom: 15 },
    headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    headerSub: { fontSize: 13, color: '#E0F2FE', marginTop: 2 },

    body: { padding: 20, paddingBottom: 150 },

    // Card Style
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.grayBg,
        borderRadius: 12, padding: 15, marginBottom: 15,
    },
    iconBox: {
        width: 60, height: 80, borderRadius: 8,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 15
    },
    infoBox: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
    itemDesc: { fontSize: 13, color: Colors.textGray, marginTop: 2 },
    itemPrice: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, marginTop: 5 },

    // Counter
    counterBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'white', borderRadius: 8, padding: 5
    },
    btnCounter: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    qtyText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 10, minWidth: 20, textAlign: 'center' },

    // Footer
    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        backgroundColor: 'white', padding: 20,
        borderTopWidth: 1, borderTopColor: '#F3F4F6', elevation: 15
    },
    rowInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { fontSize: 14, color: '#4B5563' },
    value: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },

    totalRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB'
    },
    totalPrice: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
    btnNext: {
        backgroundColor: Colors.primary, paddingHorizontal: 40, paddingVertical: 12, borderRadius: 10
    },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});