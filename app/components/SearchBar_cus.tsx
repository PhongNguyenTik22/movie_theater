import {TextInput, View} from "react-native";
import {Colors, styles} from "@/app/default_style"
import {Ionicons} from "@expo/vector-icons";

interface Props {
    placeholder:string;
    onPress?:() => void;
    value:string;
    onChangeText:(text : string) => void;
}

const SearchBar = ({placeholder, onPress, value, onChangeText}: Props) => {
    return (
        <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="black" />
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value={value}
                onChangeText= {onChangeText}
                placeholderTextColor={Colors.loginText}
                className={"text-black"}
                />
        </View>
    )
}

export default SearchBar;