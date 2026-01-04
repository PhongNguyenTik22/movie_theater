import {Dimensions, StyleSheet} from "react-native";

// Lấy chiều rộng màn hình để chia cột cho đẹp
const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = (width - 40) / COLUMN_COUNT - 10; // Trừ padding 2 bên và khoảng cách giữa các ảnh

// --- MÀU SẮC THEO THIẾT KẾ ---
export const Colors = {
    headerBg: '#00ADEF', // Màu xanh nền header
    background: '#FFFFFF',
    text: '#000000',
    redBtn: '#E50914', // Màu đỏ nút Đặt ngay
    grayInput: '#E0E0E0',

    // login
    primary: '#00ADEF', // Màu xanh chủ đạo (giống nút trong Figma)
    loginText: '#333333', // Chữ đen xám (đỡ đau mắt hơn đen tuyền)
    textLight: '#888888', // Chữ màu nhạt (phụ đề)
    gray: '#F5F5F5', // Màu nền cho Input hoặc các khối phụ
    error: '#FF3B30', // Màu đỏ báo lỗi
    white: '#FFFFFF',

};

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    // --- main page header ---
    headerContainer: {
        backgroundColor: Colors.headerBg, // Màu xanh
        paddingTop: 30, // Tránh tai thỏ (nếu SafeAreaView không tự nhận)
        paddingBottom: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 50,
    },
    logoText: {
        fontSize: 20,
        fontWeight: '900', // Siêu đậm
        color: 'black',
    },
    searchBar: {
        flex: 1, // Tự co giãn chiếm chỗ trống
        flexDirection: 'row',
        backgroundColor: Colors.grayInput,
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 35,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10, // Cách logo và nút login ra
    },
    searchText: { color: 'gray' },

    // --- login page ---
    loginContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        padding: 20 },
    loginHeader: {
        alignItems: 'center',
        marginBottom: 50 },
    loginAppName: {
        fontSize: 40,
        fontWeight: '900',
        color: Colors.primary,
        letterSpacing: 2 },
    loginSubTitle: {
        fontSize: 16,
        color: Colors.textLight,
        marginTop: 10 },
    loginForm: { width: '100%' },
    loginInput: {
        backgroundColor: Colors.gray,
        padding: 15, borderRadius: 10, marginBottom: 15,
        fontSize: 16, color: Colors.loginText
    },
    loginBtnPrimary: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    loginBtnText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 18 },
    LinkText: {
        textAlign: 'center',
        marginTop: 20,
        color: Colors.textLight },

    //                              --- sign up page ---
    signUpBackButton: { padding: 20 },
    signUpScrollContent: { paddingHorizontal: 25, paddingBottom: 40 },

    signUpHeader: { marginBottom: 30, marginTop: 10 },
    signUpTitle: { fontSize: 30, fontWeight: 'bold', color: Colors.primary, marginBottom: 5 },
    signUpSubTitle: { fontSize: 16, color: Colors.gray },

    signUpForm: { width: '100%' },
    signUpLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginLeft: 2 },

    signUpInput: {
        backgroundColor: Colors.gray,
        padding: 15, borderRadius: 12, marginBottom: 20,
        fontSize: 16, color: Colors.text
    },

    // Input password có icon mắt
    loginPasswordContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.gray,
        borderRadius: 12, marginBottom: 20,
    },
    loginInputPass: { flex: 1, padding: 15, fontSize: 16, color: Colors.loginText },
    loginEyeIcon: { padding: 15 },

    // btnRegister: {
    //     backgroundColor: Colors.primary,
    //     padding: 16, borderRadius: 12,
    //     alignItems: 'center', marginTop: 10,
    //     shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
    // },
    // btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    footerText: { color: Colors.loginText, fontSize: 15 },
    signUpLinkText: { color: Colors.textLight, fontWeight: 'bold', fontSize: 15 },

    // --- main page Banner ---
    bannerContainer: {
        margin: 15,
        borderRadius: 15,
        overflow: 'hidden', // Để bo góc ảnh
        position: 'relative', // Để đặt nút Đặt ngay đè lên
    },
    bannerImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    bookingBtn: {
        position: 'absolute', // Đè lên ảnh
        bottom: 10,
        right: 10,
        backgroundColor: Colors.redBtn,
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    bookingText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    // --- Style List ---
    listSection: { paddingHorizontal: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },

    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Tự xuống dòng khi hết chỗ
        justifyContent: 'space-between', // Dãn đều
    },
    movieItem: {
        width: ITEM_WIDTH, // Độ rộng tính toán theo màn hình
        marginBottom: 20,
        alignItems: 'center',
    },
    moviePoster: {
        width: '100%',
        height: 140,
        borderRadius: 10,
        marginBottom: 5,
        resizeMode: 'cover',
    },
    movieName: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // --- id .tsx ---
    bookBtnPrimary: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",

        position: 'absolute',
        right: 20,
        bottom: 40,
        width: 170
    },

    goBackBtn: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",

        position: 'absolute',
        left: 20,
        bottom: 40,
        width: 170
    }
});
