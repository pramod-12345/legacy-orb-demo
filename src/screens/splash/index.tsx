import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { image } from '../../assets/images';
import { fontFamily } from '../../constants/globalConstants';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={image.legacyOrbLogo} style={styles.logo} />
            <Text style={styles.appName}>Legacy Orb</Text>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Adjust background color as needed
    },
    logo: {
        width: 100, // Adjust size as needed
        height: 100,
        resizeMode: 'contain',
    },
    appName: {
        fontSize: 34,
        fontWeight: fontFamily.RRegular,
        marginTop: 20,
        color: '#000000', // Adjust color as needed
    },
});