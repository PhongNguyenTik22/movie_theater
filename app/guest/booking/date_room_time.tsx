import React, {useCallback, useEffect, useState} from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    FlatList, Alert, ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {db} from '@/FirebaseConfig'
import {doc, getDoc, setDoc} from 'firebase/firestore';


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


const formatDateID = (date : Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const removeYear = (date : string) => {
    return date.split('-')[0] + '-' + date.split('-')[1];
}


let dates: Date[] = []
let datas: string[] = []
let avai_date: string[] = []

const ROOMS = [1, 2, 3];
const TIMES = ['08:00', '12:00', '16:00'];

export default function SelectShowtimeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams(); // Lấy tên phim từ trang trước

    // --- STATE QUẢN LÝ LỰA CHỌN ---
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try{
            for (let i = 0; i < 10; i++) {
                const d = new Date();
                d.setDate(d.getDate() + i);
                dates.push(d);
            }

            // fetch the collection
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 3; j++) {
                    const doc_id = formatDateID(dates[i]) + "_p" + ROOMS[j];
                    const ref = doc(db, 'schedule', doc_id);
                    const snapshot = await getDoc(ref);

                    if (snapshot.exists()) {
                        //console.log(datas.length);
                        const temp = snapshot.data()
                        if (temp.t0800 === params.id) datas.push(doc_id + '_' + '08:00');
                        if (temp.t1200 === params.id) datas.push(doc_id + '_' + '12:00');
                        if (temp.t1600 === params.id) datas.push(doc_id + '_' + '16:00');
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }

        for (let i = 0; i< datas.length; i++) {
            let temp = datas[i].split('_')[0];
            if (!avai_date.includes(temp)) avai_date.push(temp);
        }

        setLoading(false);
    }

    useFocusEffect(
        useCallback(()=>{
            setLoading(true)
            fetchData()
        }, [])
    )

    const avai_room = (date: string) => {
        let room : string[] = []
        for (let i = 0; i< datas.length; i++) {
            let temp = datas[i].split('_')[1];
            if (datas[i].split('_')[0] === date
                && !room.includes(temp)) room.push(temp);
        }
        return room;
    }

    const avai_time = (date : string, room: string) => {
        let time : string[] = []
        for (let i = 0; i< datas.length; i++) {
            let temp = datas[i].split('_')[2];
            if (datas[i].split('_')[0] === date
                && datas[i].split('_')[1] === room
                && !time.includes(temp)) time.push(temp);
        }
        return time;
    }

    const handleNext = () => {
        if (!selectedTime) {
            Alert.alert('Thông báo', 'Vui lòng chọn suất chiếu (giờ chiếu)!');
            return;
        }
        // Truyền tất cả thông tin đã chọn sang trang tiếp theo
        router.push({
            pathname: '/guest/booking/seat',
            params: {
                ...params,
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
                        <Text style={styles.headerTitle}>{params.name || 'Tên Phim'}</Text>
                        <Text style={styles.headerSub}>Chọn ngày chiếu và suất chiếu</Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.body}>

                {loading ? (
                    <ActivityIndicator
                        size = "large"
                        color = "#0000FF"
                        className="mt-10 self-center"
                    />
                ) : ( <View>
                {/* 2. CHỌN NGÀY (SCROLL NGANG) */}
                <Text style={styles.sectionTitle}>Chọn ngày</Text>
                <View style={{ height: 80 }}>
                    <FlatList
                        horizontal
                        data={avai_date}
                        showsHorizontalScrollIndicator={false}
                        //keyExtractor={item}
                        renderItem={({ item }) => {
                            const isSelected = selectedDate === item;
                            return (
                                <TouchableOpacity
                                    style={[styles.dateItem, isSelected && styles.dateItemActive]}
                                    onPress={() => setSelectedDate(item)}
                                >
                                    {/*<Text style={[styles.dateDay, isSelected && styles.textWhite]}>{item.day}</Text>*/}
                                    <Text style={[styles.dateNum, isSelected && styles.textWhite]}>{removeYear(item)}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                {/* 3. CHỌN RẠP (LIST DỌC) */}
                <Text style={styles.sectionTitle}>Chọn phòng chiếu</Text>
                {avai_room(selectedDate).map((item) => {
                    const isSelected = selectedRoom === item;
                    return (
                        <TouchableOpacity
                            key={item}
                            style={[styles.cinemaItem, isSelected && styles.cinemaItemActive]}
                            onPress={() => setSelectedRoom(item)}
                        >
                            <Text style={styles.cinemaName}>Phòng chiếu số {item}</Text>
                            {/*<Text style={styles.cinemaAddress}>{cinema.address}</Text>*/}
                        </TouchableOpacity>
                    );
                })}

                {/* 4. CHỌN SUẤT CHIẾU (GRID) */}
                <Text style={styles.sectionTitle}>Chọn suất chiếu</Text>
                <View style={styles.timeContainer}>
                    {avai_time(selectedDate, selectedRoom).map((item) => {
                        const isSelected = selectedTime === item;
                        return (
                            <TouchableOpacity
                                key={item}
                                style={[styles.timeItem, isSelected && styles.timeItemActive]}
                                onPress={() => setSelectedTime(item)}
                            >
                                <Text style={[styles.timeText, isSelected && styles.textWhite]}>
                                    {item}
                                </Text>
                                <Text style={[styles.roomText, isSelected && styles.textWhite]}>
                                    Phòng {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                </View>)}
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