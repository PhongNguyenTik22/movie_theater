import { Ionicons } from '@expo/vector-icons';
import {useFocusEffect, useLocalSearchParams, useRouter} from 'expo-router';
import React, {useCallback, useEffect, useState} from 'react';
import {db} from '@/FirebaseConfig'
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

// --- CẤU HÌNH MÀU SẮC ---
const Colors = {
    primary: '#00ADEF',
    selected: '#EF4444',
    booked: '#4B5563',
    empty: '#E5E7EB',
    white: '#FFFFFF',
};

// --- DỮ LIỆU GHẾ ---
const SEAT_ROWS = [
    ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
    ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
    ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
    ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
    ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
    ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'],
];

const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COL_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8'];

// const formatDateID = (date : Date) => {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const year = date.getFullYear();
//
//     return `${day}-${month}-${year}`;
// };
//
// const formatSeatID = (row: number, col: number) => {
//     return ROW_LABELS[row] + COL_LABELS[col];
// }
//
// const formatTicketID = (
//     date: string,
//     room: string,
//     time: string,
//     seat: string,
//     user: string) => {
//     return date +  '_' + room + '_' + time + '_' + seat + '_' + user;
// }

const extractID = (ticket_id: string, item: number) => {
    return ticket_id.split('_')[item];
}

let occupied: string [] = []

export default function BookingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [loading, setLoading] = useState(true);

    const getBookedSeat = async () => {
        let ticket_data: string[] = [];
        try {
            //@ts-ignore
            const id: string = params.date;
            const ref = doc(db, 'ticket', id);
            const snapshot = await getDoc(ref);

            if (snapshot.exists()) {
                const data = snapshot.data();
                ticket_data = data.ticket;
            } else {
                await setDoc(ref, {
                    ticket: []
                })
            }
        }
        catch (error)
        {
            console.error(error)
            Alert.alert("Error", "Fetch database failed.");
        }

        for (let i = 0; i < ticket_data.length; i++)
        {
            if (extractID(ticket_data[i], 0) === params.date
            && extractID(ticket_data[i], 1) === params.room
            && extractID(ticket_data[i], 2) === params.time)
            {
                ticket_data[i] = extractID(ticket_data[i], 3);
                let temp = ticket_data[i].split(',')
                for (let i = 0; i < temp.length; i++) {
                    occupied.push(temp[i]);
                }
            }
        }
        setLoading(false);
    }


    // lấy dữ liệu vé ngồi, nếu ko có thì tạo doc mới
    useFocusEffect(
        useCallback(()=>{
            //setLoading(true);
            occupied = []
            getBookedSeat()
        }, [])
    )

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const handleToggleSeat = (seatId : string) => {
        if (occupied.includes(seatId)) return;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const totalPrice = selectedSeats.length * 90000;

    const renderSeat = (seatId :string) => {
        const isBooked = occupied.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);

        let backgroundColor = Colors.empty;
        let textColor = '#333';

        if (isBooked) {
            backgroundColor = Colors.booked;
            textColor = '#fff';
        } else if (isSelected) {
            backgroundColor = Colors.selected;
            textColor = '#fff';
        }

        return (
            <TouchableOpacity
                key={seatId}
                disabled={isBooked}
                onPress={() => handleToggleSeat(seatId)}
                style={[styles.seatBox, { backgroundColor }]}
            >
                <Text style={[styles.seatText, { color: textColor }]}>{seatId}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 15 }}>
                        {/* Tên phim */}
                        <Text style={styles.movieTitle}>{params.movieName || "Tên Phim"}</Text>

                        {/* Thông tin chi tiết: Giờ • Ngày • Rạp */}
                        <Text style={styles.movieSub}>
                            {params.time} • {params.date} • Phòng chiếu {params.room}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator
                        size = "large"
                        color = "#0000FF"
                        className="mt-10 self-center"
                    />
                ) : (<View>
                <View style={styles.screenContainer}>
                    <View style={styles.screenCurve} />
                    <Text style={styles.screenLabel}>MÀN HÌNH</Text>
                </View>

                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: Colors.empty }]} /><Text style={styles.legendText}>Trống</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: Colors.booked }]} /><Text style={styles.legendText}>Đã bán</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: Colors.selected }]} /><Text style={styles.legendText}>Đang chọn</Text></View>
                </View>

                <View style={styles.seatGrid}>
                    {SEAT_ROWS.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.rowContainer}>
                            <View style={styles.rowLabelContainer}>
                                <Text style={styles.rowLabelText}>{ROW_LABELS[rowIndex]}</Text>
                            </View>
                            <View style={styles.seatsRow}>
                                {row.map((seatId) => renderSeat(seatId))}
                            </View>
                        </View>
                    ))}
                </View>
                </View>)}
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.footer}>
                <View style={styles.footerInfo}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.labelTotal}>{selectedSeats.length} Ghế</Text>
                        <Text style={styles.selectedSeatsText} numberOfLines={1}>
                            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn'}
                        </Text>
                    </View>
                    <Text style={styles.priceTotal}>{totalPrice.toLocaleString()}đ</Text>
                </View>

                <TouchableOpacity
                    style={[styles.btnNext, { backgroundColor: selectedSeats.length > 0 ? Colors.primary : '#ccc' }]}
                    disabled={selectedSeats.length === 0}
                    onPress={() => {
                        // CODE MỚI: Chuyển sang trang Bắp Nước và gửi kèm danh sách ghế
                        router.push({
                            pathname: '/guest/booking/snack',
                            params: {
                                ...params, // Truyền tiếp tên phim, rạp, ngày, giờ
                                seats: selectedSeats.join(','), // Truyền ghế dạng chuỗi "E5,E6"
                            }
                        });
                    }}
                >
                    <Text style={styles.btnText}>TIẾP TỤC</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { backgroundColor: Colors.primary, paddingTop: 45, paddingBottom: 15 },
    headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
    movieTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    movieSub: { fontSize: 13, color: '#E0F2FE', marginTop: 4 }, // Tăng khoảng cách nhẹ
    scrollBody: { paddingBottom: 150 },

    screenContainer: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
    screenCurve: { width: width * 0.8, height: 4, backgroundColor: '#DDD', borderRadius: 2 },
    screenLabel: { fontSize: 12, color: '#AAA', marginTop: 10, letterSpacing: 3 },

    legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 40 },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendBox: { width: 16, height: 16, borderRadius: 4, marginRight: 6 },
    legendText: { fontSize: 12, color: '#666' },

    seatGrid: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20
    },
    rowContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowLabelContainer: {
        width: 20,
        alignItems: 'center',
        marginRight: 8
    },
    rowLabelText: { fontSize: 14, fontWeight: 'bold', color: '#999' },

    seatsRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    seatBox: {
        width: 34,
        height: 34,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 3
    },
    seatText: { fontSize: 10, fontWeight: '700' },

    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        backgroundColor: 'white', padding: 20,
        borderTopWidth: 1, borderTopColor: '#EEE', elevation: 10
    },
    footerInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
    labelTotal: { fontSize: 12, color: '#888' },
    selectedSeatsText: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    priceTotal: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
    btnNext: { paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});


/*
ticket collection

doc id = day
each day has a history of all purchased ticket
ticket id = day _ room _ time _ seat _ user

occupied:




 */