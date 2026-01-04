// screens/AdminScreen.tsx
import React, {Fragment, useEffect, useState} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator, FlatList
} from 'react-native';
import {useRouter} from "expo-router";
import useFetch from "@/services/useFetch"
import {fetchMovie} from "@/services/tdmb_api_config";
import MovieCard from "@/app/admin/render_poster_admin";
import {styles} from "@/app/default_style"
import SearchBar from "@/app/components/SearchBar_cus"


export default function Home_admin_screen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");


    const {
        data: movies,
        loading: moviesloading,
        error: movieserror,
        refetch: loadMovies,
        reset,
    }
    = useFetch(() => fetchMovie({
        query : searchQuery
    }))

    useEffect(() => {
        const func = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();
            } else {
                reset()
                await loadMovies();
            }
        }, 500);
        return () => clearTimeout(func);
    }, [searchQuery]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    {/* Logo */}
                    <Text style={styles.logoText}>CINEBOOK</Text>

                    <View style={styles.searchBar}>
                        <SearchBar
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={(text: string) => setSearchQuery(text)}
                        />
                    </View>

                    {moviesloading ? (
                        <ActivityIndicator
                            size = "large"
                            color = "#0000FF"
                            className="mt-10 self-center"
                        />
                    ) : movieserror ? (
                        <Text>
                            Error: {movieserror?.message}
                        </Text>
                    ) : <View></View>
                    }
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

                <FlatList
                    data={movies}
                    renderItem={({item}) => (
                        <MovieCard
                            { ... item}
                        />
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
    // return (
    //     <View style={styles.container}>
    //
    //         {/* --- PHẦN 1: HEADER (MÀU XANH) --- */}
    //         <View style={styles.headerContainer}>
    //             <View style={styles.headerContent}>
    //                 {/* Logo */}
    //                 <Text style={styles.logoText}>CINEBOOK</Text>
    //
    //                 {/* Thanh tìm kiếm */}
    //                 <View style={styles.searchBar}>
    //                     <Text style={styles.searchText}>Search</Text>
    //                     <Ionicons name="search" size={20} color="black" />
    //                 </View>
    //             </View>
    //         </View>
    //
    //         {/* --- PHẦN THÂN TRANG (Cuộn được) --- */}
    //         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
    //
    //             {/* --- PHẦN 2: BANNER --- */}
    //             <View style={styles.bannerContainer}>
    //                 <Image source={BANNER_MOVIE.image} style={styles.bannerImage} />
    //                 {/* Nút Đặt Ngay màu đỏ đè lên ảnh */}
    //                 <TouchableOpacity style={styles.bookingBtn} onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
    //                     <Text style={styles.bookingText}>Đặt ngay</Text>
    //                 </TouchableOpacity>
    //             </View>
    //
    //             {/* --- PHẦN 3: DANH SÁCH PHIM --- */}
    //             <View style={styles.listSection}>
    //                 <Text style={styles.sectionTitle}>Đang chiếu</Text>
    //
    //                 {/* Grid Layout (Xếp lưới) */}
    //                 <View style={styles.gridContainer}>
    //                     {MOVIES.map((item) => (
    //                         <TouchableOpacity
    //                             key={item.id}
    //                             style={styles.movieItem}
    //                             onPress={() => goToDetail(item)}
    //                         >
    //                             <Image source={item.image} style={styles.moviePoster} />
    //                             <Text style={styles.movieName} numberOfLines={1}>{item.name}</Text>
    //                         </TouchableOpacity>
    //                     ))}
    //                 </View>
    //             </View>
    //
    //         </ScrollView>
    //     </View>
    // );

}


