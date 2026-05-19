import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Tablet detection: checks if it's an iPad or if the minimum dimension is >= 600
export const isTablet = Platform.OS === 'ios' ? Platform.isPad : Math.min(width, height) >= 600;

export const getSize = (tabSize: number, size: number) => {
    return isTablet ? tabSize : size;
}

export const color = {
    white: '#FFFFFF',
    black: '#000000',
    OffWhite: "#FCFEFE",
    CharcoalGray: "#333333",
    CoolGray: "#6B7280",
    LightSkyBlueTransparent: "#D2E4F126",
    LightGray: "#E0E0E0",
    DarkSlateGray: "#263238",
    DarkBlueGray: "#303841",
    WarmGrayTransparent: "#A7A29980",
    DarkGray: "#2E2E2E",
    MediumGray: "#757575",
    black60: '#00000060',
    SoftGray: "#F2F4F7",
    DimGray: "#999999",
    BorderLight: "#D6D4D980",
    OverlayDark: "rgba(0, 0, 0, 0.96)",
    GlassLight: "rgba(255, 255, 255, 0.14)",
};

export const fontFamily = {
    RThin: 'Roboto-Thin',
    RELight: 'Roboto-ExtraLight',
    RLight: 'Roboto-Light',
    RRegular: 'Roboto-Regular',
    RMedium: 'Roboto-Medium',
    RSBold: 'Roboto-SemiBold',
    RBold: 'Roboto-Bold',
    REBold: 'Roboto-ExtraBold',
    RBlack: 'Roboto-Black',
};

export const screenSize = {
    height: height,
    width: width,
};

/**
 * Calculates responsive width based on design base width (375).
 * For tablets, the scaling is capped to prevent excessively large elements.
 */
export function getWidth(size: number) {
    const scale = screenSize.width / 375;
    const cappedScale = isTablet ? Math.min(scale, 1.4) : scale;
    return size * cappedScale;
}

/**
 * Calculates responsive height based on design base height (812).
 * For tablets, the scaling is capped to prevent excessively large elements.
 */
export function getHeight(size: number) {
    const scale = screenSize.height / 812;
    const cappedScale = isTablet ? Math.min(scale, 1.4) : scale;
    return size * cappedScale;
}

// Font Size
export const fontSize = {
    size9: getWidth(9),
    size10: getWidth(10),
    size11: getWidth(11),
    size12: getWidth(12),
    size13: getWidth(13),
    size14: getWidth(14),
    size15: getWidth(15),
    size16: getWidth(16),
    size17: getWidth(17),
    size18: getWidth(18),
    size19: getWidth(19),
    size20: getWidth(20),
    size21: getWidth(21),
    size22: getWidth(22),
    size23: getWidth(23),
    size24: getWidth(24),
    size25: getWidth(25),
    size26: getWidth(26),
    size27: getWidth(27),
    size28: getWidth(28),
    size30: getWidth(30),
    size32: getWidth(32),
    size34: getWidth(34),
    size36: getWidth(36),
    size46: getWidth(46),
};