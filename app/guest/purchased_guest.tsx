import React, {useCallback, useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StatusBar
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import {useLocalSearchParams, Stack, useFocusEffect} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {doc, DocumentData, getDoc, setDoc} from 'firebase/firestore';
import {db} from '@/FirebaseConfig'


const extractID = (ticket_id: string, item: number) => {
    return ticket_id.split('_')[item];
}

// const keySpawn = (ticket_id: string) => {
//     return extractID(ticket_id, 0) + extractID(ticket_id, 1)
//         + extractID(ticket_id, 2) + extractID(ticket_id, 3)
// }

const formatDateID = (date : Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

// --- Components ---



// --- Main Screen ---

export default function MyTicketsScreen() {
    // 1. Get User ID from navigation params
    const params = useLocalSearchParams();

    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);

    const TicketCard = ({
                            item,
                            isEditMode,
                            onRemove
                        }: {
        item: string,
        isEditMode: boolean,
        onRemove: (id: string) => void
    }) => {
        return (
            <View style={styles.ticketContainer}>
                {/* Box Header */}
                <View style={styles.ticketHeader}>
                    <Text style={styles.movieTitle}>{extractID(item, 6)}</Text>
                </View>

                {/* Box Body */}
                <View style={styles.ticketBody}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Date:</Text>
                        <Text style={styles.value}>{extractID(item, 0)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Time:</Text>
                        <Text style={styles.value}>{extractID(item, 2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Room:</Text>
                        <Text style={styles.value}>{extractID(item, 1)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Seats:</Text>
                        <Text style={styles.value}>{extractID(item, 3)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Food Order</Text>
                    <Text style={styles.foodText}>Combo 1: {extractID(item, 4).split(',')[0]}</Text>
                    <Text style={styles.foodText}>Bắp phô mai: {extractID(item, 4).split(',')[1]}</Text>
                    <Text style={styles.foodText}>Nước ngọt: {extractID(item, 4).split(',')[2]}</Text>
                </View>

                {/* Remove Button (Conditional) */}
                {isEditMode && (
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => {
                            onRemove(item);
                        }}
                    >
                        <Text style={styles.removeButtonText}>Remove Ticket</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };



    const loadTicket = async () => {
        let t: any[] = []
        for (let i = 0; i < 10; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const doc_id = formatDateID(d)
            const ref = doc(db, 'ticket', doc_id)
            const snapshot = await getDoc(ref)

            if (snapshot.exists())
            {
                const temp = snapshot.data().ticket
                for (let i = 0; i < temp.length; i++)
                {
                    if (params.user === extractID(temp[i], 5))
                    {
                        t.push(temp[i]);
                    }
                }
            }
        }
        setTickets(t);
        setLoading(false);
    }

    // 2. Fetch Data
    // useEffect(() => {
    //     //setTickets([])
    //     loadTicket();
    // }, []);

    useFocusEffect(
        useCallback(()=>{
            //setLoading(true);
            loadTicket()
        }, [])
    )

    const mockRemoveTicket = async (ticketId: string) => {
        console.log(`Deleting ticket ${ticketId} from database...`);
        try {
            const doc_id = extractID(ticketId, 0);
            const ref = doc(db, 'ticket', doc_id);
            const snapshot = await getDoc(ref)
            if (snapshot.exists())
            {
                let temp: string[] = snapshot.data().ticket
                temp = temp.filter((t: string) => t !== ticketId)
                let data:DocumentData = {ticket: temp}
                //console.log(data)
                await setDoc(ref, data)
            }
        } catch (error) {
            setLoading(false);
            return false
        }
        setLoading(false);
        return true
    };

    // 3. Handle Removal Logic
    const handleRemovePress = (ticketId: string) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to remove this ticket from your history? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true)
                        const success = await mockRemoveTicket(ticketId);
                        if (success) {
                            setTickets((prev) => prev.filter((t) => t.id !== ticketId));
                        }
                    }
                }
            ]
        );
    };

    // 4. Custom Header
    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>My Tickets</Text>
            <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
                <Ionicons
                    name={isEditMode ? "close-circle" : "trash-outline"}
                    size={28}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.screenContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

            {/* Custom Header */}
            {renderHeader()}

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={tickets}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <TicketCard
                            item={item}
                            isEditMode={isEditMode}
                            onRemove={handleRemovePress}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>No tickets found.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

// --- Styles ---

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    // Header Styles
    headerContainer: {
        backgroundColor: '#007AFF', // Blue box
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 40, // Extra padding for status bar if not using SafeAreaView properly on Android
    },
    headerTitle: {
        flex: 1,
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // List Styles
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        marginTop: 50,
    },
    // Ticket Box Styles
    ticketContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
        // overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    ticketHeader: {
        backgroundColor: '#333',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderStyle: 'dashed', // Decorative dashed line
    },
    movieTitle: {
        color: '#FFD700', // Gold color for movie title
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    ticketBody: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        color: '#666',
        fontWeight: '600',
        fontSize: 14,
    },
    value: {
        color: '#222',
        fontWeight: 'bold',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 1,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 6,
        textDecorationLine: 'underline',
    },
    foodText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
        marginBottom: 2,
    },
    // Remove Button Styles
    removeButton: {
        backgroundColor: '#ff3b30',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});