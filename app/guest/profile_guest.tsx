import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    StatusBar,
} from 'react-native';
import {router, useLocalSearchParams} from "expo-router";
import {doc, getDoc, setDoc, DocumentData} from 'firebase/firestore';
import {db} from "@/FirebaseConfig";
import {FontAwesome5, Ionicons} from "@expo/vector-icons"


const UserProfileScreen = () => {
    const params = useLocalSearchParams()

    // State for the actual confirmed user data
    const [userData, setUserData] = useState<DocumentData>();

    // State for the temporary inputs while editing
    const [tempData, setTempData] = useState<DocumentData>();

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchUserProfile = async () => {
        let doc_id : string = String(params.user)
        const ref = doc(db, 'users', doc_id);
        const snapshot = await getDoc(ref)

        if (snapshot.exists()) {
            setUserData(snapshot.data());
            setTempData(snapshot.data());
        }
        setIsLoading(false);
    };

    const updateUserProfile = async (newData: any) => {
        let doc_id : string = String(params.user)
        const ref = doc(db, 'users', doc_id);
        await setDoc(ref, newData)
    };

    const loadData = async () => {
        try {
            fetchUserProfile();
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật thông tin người dùng');
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);

    // Enable Edit Mode
    const handleEditPress = () => {
        setTempData(userData); // Reset temp data to current actual data
        setIsEditing(true);
    };

    // Handle Cancel
    const handleCancelPress = () => {
        setIsEditing(false);
        setTempData(userData); // Revert changes
    };

    // Handle Save (The 'Change' button)
    const handleSaveChanges = async () => {
        if (!tempData) {
            Alert.alert('Lỗi', 'Hãy điền đầy đủ thông tin.');
            return;
        }

        setIsSaving(true);
        try {
            await updateUserProfile(tempData);
            setUserData(tempData); // Update the "real" view with the new data
            setIsEditing(false);
            Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật thông tin người dùng');
        } finally {
            setIsSaving(false);
        }
    };

    // Loading Screen
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    else return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thông tin người dùng</Text>

                <View style={styles.rightContainer}>
                    <TouchableOpacity onPress={handleEditPress}>
                        <FontAwesome5 name={"user-edit"} size={20} color={"black"}></FontAwesome5>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>router.push({
                        pathname: './purchased_guest',
                        params: params
                        })}>
                        <Ionicons name="ticket" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* BODY */}
            <View style={styles.content}>

                {/* Avatar Placeholder */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {//@ts-ignore
                                userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                </View>

                {/* PROFILE FIELDS */}
                <View style={styles.formContainer}>

                    {/* Email Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Email</Text>
                        {/*@ts-ignore*/}
                        <Text style={styles.valueText}>{userData.email}</Text>
                    </View>

                    {/* Name Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Tên người dùng</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                // @ts-ignore
                                value={tempData.fullName}
                                // @ts-ignore
                                onChangeText={(text) => setTempData({ ...tempData, fullName: text })}
                                placeholder="Enter full name"
                            />
                        ) : (
                            // @ts-ignore
                            <Text style={styles.valueText}>{userData.fullName}</Text>
                        )}
                    </View>

                    {/* Phone Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Số điện thoại</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                // @ts-ignore
                                value={tempData.phone}
                                // @ts-ignore
                                onChangeText={(text) => setTempData({ ...tempData, phone: text })}
                                keyboardType="phone-pad"
                                placeholder="Enter phone number"
                            />
                        ) : (
                            // @ts-ignore
                            <Text style={styles.valueText}>{userData.phone}</Text>
                        )}
                    </View>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.footer}>
                    {isEditing ? (
                        <View style={styles.editActionButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancelPress}
                                disabled={isSaving}
                            >
                                <Text style={styles.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleSaveChanges}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View></View>
                    )}
                </View>
            </View>
        </View>
    );
};

// ==========================================
// 3. STYLES
// ==========================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // White background
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        backgroundColor: '#00ADEF', // Blue Header
        paddingVertical: 20,
        paddingHorizontal: 16,
        //alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    headerTitle: {
        flex: 1,
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    // Avatar
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E1E1E1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#F0F0F0',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    // Form Fields
    formContainer: {
        marginBottom: 20,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        fontWeight: '600',
    },
    valueText: {
        fontSize: 18,
        color: '#333',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    input: {
        fontSize: 18,
        color: '#333',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
    },
    // Buttons
    footer: {
        marginTop: 'auto',
        marginBottom: 20,
    },
    editButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editActionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#F2F2F7',
    },
    saveButton: {
        backgroundColor: '#34C759', // Green for success/save
    },
    cancelButtonText: {
        color: '#FF3B30', // Red for cancel
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserProfileScreen;