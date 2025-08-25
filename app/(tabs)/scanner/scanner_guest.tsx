import { SafeAreaView, Text } from "react-native";

const ScannerGuestScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-gray-500 justify-center items-center">
            <Text className="text-xl text-white text-center px-6">
                Make sure to register for R|P first!
            </Text>
        </SafeAreaView>
    )
};

export default ScannerGuestScreen;