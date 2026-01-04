import {Text, TouchableOpacity, View, Image} from "react-native";
import {useRouter} from "expo-router";

const MovieCard=
    ({id, poster_path, title, vote_average, release_date} : MovieDetails) => {
        //console.log(poster_path);
        const router = useRouter();
        return (

                <TouchableOpacity className="w-[30%]"
                    onPress={() => {
                        router.push({
                            pathname: `./app/guest/${id}`,
                            params: {

                            }
                        })
                    } }>
                    <Image
                        source={{
                            uri: poster_path
                                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                                : 'https://placehold.co/600x400/1a1a1a/ffffff.png'
                        }}
                        className="w-full h-52 rounded-lg"
                        resizeMode="cover"
                    />

                    <Text className="text-sm font-bold text-black mt-2">{title}</Text>
                </TouchableOpacity>


        )
    }

export default MovieCard;