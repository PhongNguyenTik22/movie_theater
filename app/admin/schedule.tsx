import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {doc, DocumentData, getDoc, setDoc} from 'firebase/firestore';
import {db} from '@/FirebaseConfig'
import {useLocalSearchParams, useRouter, useFocusEffect} from 'expo-router'

// --- Helper Functions ---

// Generate next 10 days
// const getNext10Days = () => {
//     const dates = [];
//     for (let i = 0; i < 10; i++) {
//         const d = new Date();
//         d.setDate(d.getDate() + i);
//         dates.push(d);
//     }
//     return dates;
// };

// Format date for display (e.g., "Mon 27")
const formatDateDisplay = (date : Date) => {
    const day = date.getDate();
    const options = { weekday: 'short', };
    const weekdays = new Intl.DateTimeFormat('en-US').format(date);
    return `${weekdays}\n${day}`;
};

// Format date for Database ID (e.g., "2023-10-27")
// Matches prompt: "date (including month and year)"
const formatDateID = (date : Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const formatQuery = (date : Date, room : number, time : string) => {
    return formatDateID(date) + '_' + room + '_' + time;
}

const ROOMS = [1, 2, 3];
const TIMES = ['08:00', '12:00', '16:00'];
let dates : Date[] = [];
let datas : DocumentData[] = [];


export const ScheduleScreen = () => {
    const router = useRouter();
    const movie = useLocalSearchParams();

    // 3. PARSE THE MOVIE OBJECT
    // Expo Router params are strings. We parse it back to an object.
    // We use a fallback in case it's somehow already an object (though rare in Expo Router).
    //const movie = typeof params.movie === 'string' ? JSON.parse(params.movie) : params.movie;

    // --- State Management ---
    //const [availableDates] = useState(getNext10Days());

    // Selections (Multi-select enabled)
    const [selectedQuery, setSelectedQuery] = useState<string[]>([]);

    // Data State
    //const [datas, setDatas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedRoom, setSelectedRoom] = useState(1);

    // --- Firestore Logic ---

    const schedule_fetch = async () => {
        // get 10 days from now on
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
                    datas.push(snapshot.data());
                }
                else {
                    const newDoc = {
                        t0800: '',
                        t1200: '',
                        t1600: ''
                    };
                    await setDoc(ref, newDoc);
                    datas.push(newDoc);
                }
            }
        }
        setLoading(false);
    }

    useFocusEffect(
        useCallback(()=> {
            setLoading(true);
            schedule_fetch();
        }, [movie.id])
    );

    const getDateIndex = (date : string) => {
        for (let i = 0; i < 10; i++) {
            if (date === formatDateID(dates[i])) {
                return i;
            }
        }
        return 0;
    }
    // 3. Check if a specific time slot is occupied
    // Returns true if ANY of the selected dates/rooms have this time booked
    const isTimeOccupied = (date :Date, room :number, time:string) => {
        if (datas.length < 30) return true;

        let index = getDateIndex(formatDateID(date)) * 3 + room - 1;
        //console.log(index);

        if (time === "08:00") return datas[index].t0800 !== '';
        else if (time === "12:00") return datas[index].t1200 !== '';
        else if (time === "16:00") return datas[index].t1600 !== '';
        return false;
    };

    // 4. Handle Submission
    const handleAddToList = async () => {
        if (selectedQuery.length === 0) {
            Alert.alert("Missing Info", "Please select at least one Date, Room, and Time.");
            return;
        }

        try {
            const temp = selectedQuery.map(async (item) => {
                console.log(Number(item.split('_')[1]));
                const index = getDateIndex(item.split('_')[0]) * 3 + Number(item.split('_')[1]) - 1;
                console.log(index);
                const time = item.split('_')[2];
                if (index < 30 || index >= 0) {
                    if (time === '08:00') datas[index].t0800 = movie.id;
                    else if (time === '12:00') datas[index].t1200 = movie.id;
                    else if (time === '16:00') datas[index].t1600 = movie.id;
                }
            })

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 3; j++) {
                    const doc_id = formatDateID(dates[i]) + "_p" + ROOMS[j];
                    const ref = doc(db, 'schedule', doc_id);
                    await setDoc(ref, datas[i * 3 + j]);
                    //console.log(i * 3 + j);
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update schedule.");
            router.back();
        } finally {
            Alert.alert("Add to list", "Successfully added!");
            router.back();
        }
    };

    // --- Render ---

    return (
        <View style={styles.container}>
            {/* Header Info */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thêm phim vào lịch chiếu</Text>
                <Text style={styles.subHeader}>Select dates, rooms, and times below</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {loading ? (
                    <ActivityIndicator
                        size = "large"
                        color = "#0000FF"
                        className="mt-10 self-center"
                    />
                ) : ( <View>

                        {/* SECTION 1: DATE BAR (Horizontal Scroll) */}
                        <Text style={styles.label}>1. Select Date(s)</Text>
                        <View style={styles.dateBarContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {dates.map((date, index) => {
                                    const isSelected = formatDateID(selectedDate) === formatDateID(date);
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
                                            onPress={() => {
                                                setSelectedDate(date);
                                            }}
                                        >
                                            <Text style={[styles.dateText, isSelected && styles.textSelected]}>
                                                {formatDateDisplay(date)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* SECTION 2: ROOM BAR */}
                        <Text style={styles.label}>2. Select Room(s)</Text>
                        <View style={styles.rowContainer}>
                            {ROOMS.map((room) => {
                                const isSelected = selectedRoom === room;
                                return (
                                    <TouchableOpacity
                                        key={room}
                                        style={[styles.roomButton, isSelected && styles.roomButtonSelected]}
                                        onPress={() => {
                                            setSelectedRoom(room);
                                        }}
                                    >
                                        <Text style={[styles.btnText, isSelected && styles.textSelected]}>
                                            Room {room}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* SECTION 3: TIME BAR */}
                        <Text style={styles.label}>3. Select Time(s)</Text>
                        <View style={styles.rowContainer}>
                            {TIMES.map((time) => {
                                const query = formatQuery(selectedDate, selectedRoom, time)
                                const isSelected = selectedQuery.includes(query);
                                const occupied = isTimeOccupied(selectedDate, selectedRoom, time);
                                //console.log(occupied);

                                // Occupied Styling Logic
                                let buttonStyle = styles.timeButton;
                                if (occupied) buttonStyle = styles.timeButtonOccupied; // Different color for occupied
                                else if (isSelected) buttonStyle = styles.timeButtonSelected;

                                return (
                                    <TouchableOpacity
                                        key={time}
                                        disabled={false} // Admin can override if they want, or set to true to lock
                                        style={buttonStyle}
                                        onPress={() => {
                                            if (!occupied) {
                                                if (isSelected) {
                                                    setSelectedQuery(selectedQuery.filter(id => id !== query));
                                                }
                                                else {
                                                    setSelectedQuery([...selectedQuery, query])
                                                }
                                            }
                                        }}
                                    >
                                        <Text style={[
                                            styles.btnText,
                                            isSelected && styles.textSelected,
                                            occupied && styles.textOccupied
                                        ]}>
                                            {time}
                                        </Text>
                                        {occupied && <Text style={styles.occupiedLabel}>Occupied</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

            </ScrollView>


            {/* FOOTER: ADD TO LIST BUTTON */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.submitButton}
                    // onPress={handleAddToList}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Add to List</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: 50, // Ignore header area
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    subHeader: {
        fontSize: 14,
        color: '#666',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    // Date Styles
    dateBarContainer: {
        height: 80,
        paddingLeft: 15,
    },
    dateButton: {
        width: 60,
        height: 70,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dateButtonSelected: {
        backgroundColor: '#007AFF', // Blue
        borderColor: '#007AFF',
    },
    dateText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#333',
        lineHeight: 18,
    },
    // Room & Time Shared Row
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
    },
    // Room Styles
    roomButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    roomButtonSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    // Time Styles
    timeButton: {
        width: 90,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeButtonSelected: {
        width: 90,
        height: 60,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeButtonOccupied: {
        width: 90,
        height: 60,
        backgroundColor: '#FFEBEE',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFCDD2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    textOccupied: {
        color: '#D32F2F', // Dark Red text
    },
    occupiedLabel: {
        fontSize: 8,
        color: '#D32F2F',
    },
    btnText: {
        fontSize: 14,
        color: '#333',
    },
    // Footer Button
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    submitButton: {
        backgroundColor: '#28a745', // Green
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ScheduleScreen;