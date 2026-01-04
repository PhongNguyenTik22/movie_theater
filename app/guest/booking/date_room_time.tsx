import React, {useEffect, useState} from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    FlatList, SafeAreaView, Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- MÀU SẮC ---
const Colors = {
    primary: '#00ADEF', // Xanh chủ đạo
    white: '#FFFFFF',
    bg: '#F9F9F9', // Xám rất nhạt cho nền
    text: '#333',
    grayBorder: '#E0E0E0',
    textGray: '#888',
};

// --- DỮ LIỆU GIẢ ---
const DATES = [
    { id: '1', day: 'T2', date: '18/12' },
    { id: '2', day: 'T3', date: '19/12' },
    { id: '3', day: 'T4', date: '20/12' }, // Giả sử hôm nay là ngày 20
    { id: '4', day: 'T5', date: '21/12' },
    { id: '5', day: 'T6', date: '22/12' },
    { id: '6', day: 'T7', date: '23/12' },
    { id: '7', day: 'CN', date: '24/12' },
];

let Dates: string[] = []


const ROOMS = [1, 2, 3];
const TIMES = ['08:00', '12:00', '16:00'];

export default function SelectShowtimeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams(); // Lấy tên phim từ trang trước

    // --- STATE QUẢN LÝ LỰA CHỌN ---
    const [selectedDate, setSelectedDate] = useState('1'); // Mặc định chọn ngày 20 (id=3)
    const [selectedRoom, setSelectedRoom] = useState(1); // Mặc định rạp đầu
    const [selectedTime, setSelectedTime] = useState(''); // Chưa chọn giờ

    // useEffect(() => {
    //     const
    // }, [])

    const handleNext = () => {
        if (!selectedTime) {
            Alert.alert('Thông báo', 'Vui lòng chọn suất chiếu (giờ chiếu)!');
            return;
        }
        // Truyền tất cả thông tin đã chọn sang trang tiếp theo
        router.push({
            pathname: '/guest/booking/seat',
            params: {
                id: params.id,
                movieName: params.movieName,
                date: selectedDate, // Truyền ngày đã chọn
                room: selectedRoom, // Truyền rạp đã chọn
                time: selectedTime // Truyền giờ đã chọn
            }
        });
    };

    return (
        <View style={styles.container}>

            {/* 1. HEADER MÀU XANH */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.headerTitle}>{params.movieName || 'Tên Phim'}</Text>
                        <Text style={styles.headerSub}>Chọn ngày chiếu và suất chiếu</Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.body}>

                {/* 2. CHỌN NGÀY (SCROLL NGANG) */}
                <Text style={styles.sectionTitle}>Chọn ngày</Text>
                <View style={{ height: 80 }}>
                    <FlatList
                        horizontal
                        data={DATES}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            const isSelected = selectedDate === item.id;
                            return (
                                <TouchableOpacity
                                    style={[styles.dateItem, isSelected && styles.dateItemActive]}
                                    onPress={() => setSelectedDate(item.id)}
                                >
                                    <Text style={[styles.dateDay, isSelected && styles.textWhite]}>{item.day}</Text>
                                    <Text style={[styles.dateNum, isSelected && styles.textWhite]}>{item.date}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                {/* 3. CHỌN RẠP (LIST DỌC) */}
                <Text style={styles.sectionTitle}>Chọn rạp</Text>
                {ROOMS.map((room) => {
                    const isSelected = selectedRoom === room;
                    return (
                        <TouchableOpacity
                            key={room}
                            style={[styles.cinemaItem, isSelected && styles.cinemaItemActive]}
                            onPress={() => setSelectedRoom(room)}
                        >
                            <Text style={styles.cinemaName}>Phòng chiếu số {room}</Text>
                            {/*<Text style={styles.cinemaAddress}>{cinema.address}</Text>*/}
                        </TouchableOpacity>
                    );
                })}

                {/* 4. CHỌN SUẤT CHIẾU (GRID) */}
                <Text style={styles.sectionTitle}>Chọn suất chiếu</Text>
                <View style={styles.timeContainer}>
                    {TIMES.map((time, index) => {
                        const isSelected = selectedTime === time;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.timeItem, isSelected && styles.timeItemActive]}
                                onPress={() => setSelectedTime(time)}
                            >
                                <Text style={[styles.timeText, isSelected && styles.textWhite]}>
                                    {time}
                                </Text>
                                <Text style={[styles.roomText, isSelected && styles.textWhite]}>
                                    Phòng {index + 1}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </ScrollView>

            {/* 5. FOOTER */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
                    <Text style={styles.btnText}>TIẾP TỤC</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },

    // Header
    header: { backgroundColor: Colors.primary, paddingTop: 30 },
    headerContent: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    headerSub: { fontSize: 14, color: '#E0F7FA' },

    body: { padding: 20, paddingBottom: 100 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginTop: 20, marginBottom: 10 },
    textWhite: { color: 'white' },

    // Date Item
    dateItem: {
        width: 60, height: 70, borderRadius: 10,
        borderWidth: 1, borderColor: Colors.grayBorder,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 10, backgroundColor: 'white'
    },
    dateItemActive: {
        backgroundColor: Colors.primary, borderColor: Colors.primary
    },
    dateDay: { fontSize: 14, color: '#888', marginBottom: 5 },
    dateNum: { fontSize: 18, fontWeight: 'bold', color: '#333' },

    // Cinema Item
    cinemaItem: {
        padding: 15, borderRadius: 10,
        borderWidth: 1, borderColor: Colors.grayBorder,
        marginBottom: 10, backgroundColor: 'white'
    },
    cinemaItemActive: {
        borderColor: Colors.primary,
        backgroundColor: '#E1F5FE' // Xanh rất nhạt
    },
    cinemaName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    cinemaAddress: { fontSize: 12, color: '#888' },

    // Time Item
    timeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    timeItem: {
        width: '30%', // Chia 3 cột
        paddingVertical: 15, borderRadius: 8,
        borderWidth: 1, borderColor: Colors.grayBorder,
        alignItems: 'center', backgroundColor: 'white'
    },
    timeItemActive: {
        backgroundColor: Colors.primary, borderColor: Colors.primary
    },
    timeText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    roomText: { fontSize: 10, color: '#888', marginTop: 2 },

    // Footer
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 20, backgroundColor: 'white',
        borderTopWidth: 1, borderTopColor: '#eee',
        elevation: 10
    },
    btnNext: {
        backgroundColor: Colors.primary,
        paddingVertical: 15, borderRadius: 30,
        alignItems: 'center'
    },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});