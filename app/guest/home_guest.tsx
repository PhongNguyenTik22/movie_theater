import React, {useEffect, useState} from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions, Alert, ActivityIndicator, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Để lấy icon kính lúp
import {db} from '@/FirebaseConfig'
import {doc, DocumentData, getDoc, setDoc} from 'firebase/firestore';
import {useLocalSearchParams, useRouter} from "expo-router";
import useFetch from "@/services/useFetch"
import {fetchMovie, fetchMovieDetails} from "@/services/tdmb_api_config";
import MovieCard from "@/app/guest/render_poster_guest";
import {styles} from "@/app/default_style"
import SearchBar from "@/app/components/SearchBar_cus"



// Lấy chiều rộng màn hình để chia cột cho đẹp
const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = (width - 40) / COLUMN_COUNT - 10; // Trừ padding 2 bên và khoảng cách giữa các ảnh

// --- MÀU SẮC THEO THIẾT KẾ ---
const Colors = {
    headerBg: '#00ADEF', // Màu xanh nền header
    background: '#FFFFFF',
    text: '#000000',
    redBtn: '#E50914', // Màu đỏ nút Đặt ngay
    grayInput: '#E0E0E0',
};

const formatDateID = (date : Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

let id_list: string[] = []

export default function HomeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const update_available = async () => {
            const d = new Date();
            const doc_id = formatDateID(d);
            const ref = doc(db, 'available_film', doc_id);
            let dates: Date[] = [];
            const ROOMS = [1, 2, 3];
            for (let i = 0; i < 10; i++) {
                const d2 = new Date();
                d2.setDate(d2.getDate() + i);
                dates.push(d2);
            }

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 3; j++) {
                    const doc_id2 = formatDateID(dates[i]) + "_p" + ROOMS[j];
                    const ref2 = doc(db, 'schedule', doc_id2);
                    const snapshot2 = await getDoc(ref2);

                    if (snapshot2.exists()) {
                        const data = snapshot2.data();
                        if (data.t0800 !== '' && !id_list.includes(data.t0800)) id_list.push(data.t0800);
                        if (data.t1200 !== '' && !id_list.includes(data.t1200)) id_list.push(data.t1200);
                        if (data.t1600 !== '' && !id_list.includes(data.t1600)) id_list.push(data.t1600);
                    }
                }
            }
            await setDoc(ref, {
                idList: id_list,
            })
        }

        try {
            update_available();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Can't fetch movie data");
        }
    }, [])

    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                // Fetch all movie details in parallel
                const results = await Promise.all(id_list.map(id => fetchMovieDetails(id)));
                // Filter out failed/null results
                setMovies(results.filter(Boolean));
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllMovies();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    {/* Logo */}
                    <Text style={styles.logoText}>CINEBOOK</Text>

                    {/*<View style={styles.searchBar}>*/}
                    {/*    <SearchBar*/}
                    {/*        placeholder="Search..."*/}
                    {/*        value={searchQuery}*/}
                    {/*        onChangeText={(text: string) => setSearchQuery(text)}*/}
                    {/*    />*/}
                    {/*</View>*/}

                    {/*{moviesloading ? (*/}
                    {/*    <ActivityIndicator*/}
                    {/*        size = "large"*/}
                    {/*        color = "#0000FF"*/}
                    {/*        className="mt-10 self-center"*/}
                    {/*    />*/}
                    {/*) : movieserror ? (*/}
                    {/*    <Text>*/}
                    {/*        Error: {movieserror?.message}*/}
                    {/*    </Text>*/}
                    {/*) : <View></View>*/}
                    {/*}*/}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>

                <FlatList
                    data={movies}
                    renderItem={({item}) => (
                        <TouchableOpacity className="w-[30%]"
                                          onPress={() => {
                                              console.log(item.id);
                                              router.push({
                                                  pathname: `./${item.id}`,
                                                  params: {
                                                        ...params,
                                                      id: item.id,
                                                      name: item.title
                                                  }
                                              })
                                          } }>
                            <Image
                                source={{
                                    uri: item.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                        : 'https://placehold.co/600x400/1a1a1a/ffffff.png'
                                }}
                                className="w-full h-52 rounded-lg"
                                resizeMode="cover"
                            />

                            <Text className="text-sm font-bold text-black mt-2">{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: 'flex-start',
                        gap: 16,
                        paddingRight: 5,
                        marginBottom: 10
                    }}
                    className="mt-2 pb-32"
                    scrollEnabled={false}
                />


            </ScrollView>
        </View>
    )
}