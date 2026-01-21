import {ScrollView, View, Image, Text, TouchableOpacity} from "react-native";
import React from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchMovieDetails} from "@/services/tdmb_api_config";
import {styles} from "@/app/default_style"

interface MovieInfoProps {
    label: string;
    value? : string | number | null;
}


const MovieInfo =({ label, value} :MovieInfoProps)=>{
    return (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-black font-normal text-sm">
            {label}
        </Text>
            <Text className="text-gray font-normal text-sm">
                {value || 'N/A'}
            </Text>
    </View>
    )
}
const MovieDetails_Admin = () => {
    const router = useRouter();

    const { id } = useLocalSearchParams();
    const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string))

    return (
        <View className= "bg-primary flex-1">
            <ScrollView contentContainerStyle={{
                paddingBottom: 80}}>
                <View>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
                        className = "w-full h-[550px]" resizeMode={"stretch"}/>
                </View>

                <View className= "flex-col items-start justify-center mt-5 px-5">
                    <Text className = "text-black font-bold text-xl"> {movie?.title}</Text>

                    <View className= "flex-col items-center gap-x-1 mt-2">
                        <Text className="text-gray text-sm">
                            Năm phát hành: {movie?.release_date?.split('-')[0]}
                        </Text>
                        <Text className="text-gray text-sm">
                            Thời lượng phim: {movie?.runtime}m
                        </Text>
                        <Text className="text-gray text-sm">
                            MetaScore: ⭐️{movie?.vote_average}/10
                        </Text>

                    </View>

                    <MovieInfo label="Tổng quan" value={movie?.overview} />
                    <MovieInfo label="Thể loại" value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"} />
                </View>

                <TouchableOpacity
                    style={styles.bookBtnPrimary}
                    onPress={() => {
                        router.push({
                            pathname: "/admin/add_film/add_to_schedule",
                            params: {
                                id: movie?.id,
                            }
                        })
                    }}
                    >
                    <Text style={{color : "#FFFFFF"}}>Thêm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.goBackBtn} onPress={() => router.back()}>
                    <Text style={{color : "#FFFFFF"}}>Quay lại</Text>

                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}

export default MovieDetails_Admin;