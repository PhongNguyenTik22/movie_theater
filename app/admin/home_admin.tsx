import React, {useEffect, useState} from 'react';
import {
    ScrollView,
    Text,
    View,
    ActivityIndicator, FlatList,  TouchableOpacity
} from 'react-native';
import {router} from "expo-router";
import useFetch from "@/services/useFetch"
import {fetchMovie} from "@/services/tdmb_api_config";
import MovieCard from "@/app/admin/render_poster_admin";
import {styles} from "@/app/default_style"
import SearchBar from "@/app/components/SearchBar_cus"
import {FontAwesome5} from "@expo/vector-icons";


export default function Home_admin_screen() {
    // const router = useRouter();
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

                    <TouchableOpacity onPress={()=>router.push("./schedule")}>
                        <FontAwesome5 name={"calendar-alt"} size={20} color={"black"}></FontAwesome5>
                    </TouchableOpacity>

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
}


