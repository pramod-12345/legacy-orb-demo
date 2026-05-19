import {
    checkMultiple,
    PERMISSIONS,
    RESULTS,
    requestMultiple,
} from "react-native-permissions";
import { Platform } from "react-native";

const PERMISSIONS_RESULTS = Object({
    UNAVAILABLE: "unavailable",
    BLOCKED: "blocked",
    DENIED: "denied",
    GRANTED: "granted",
    LIMITED: "limited",
});

/**
 * Check permission to access camera
 */
const checkGalleryPermissions = () => {
    return new Promise((resolve) => {
        checkMultiple([
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            PERMISSIONS.IOS.MEDIA_LIBRARY,
        ])
            .then((statuses: any) => {
                let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
                if (Platform.OS === "android") {
                    PERM_STATUS = resolvePermision([
                        statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
                    ]);
                } else if (Platform.OS === "ios") {
                    PERM_STATUS = resolvePermision([
                        statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
                    ]);
                }
                resolve(PERM_STATUS);
            })
            .catch(() => {
                resolve(PERMISSIONS_RESULTS.BLOCKED);
            });
    });
};

/**
 * Request permission to access camera
 */
const requestGalleryPermissions = () => {
    return new Promise((resolve) => {
        requestMultiple([
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            PERMISSIONS.IOS.MEDIA_LIBRARY,
        ])
            .then((statuses: any) => {
                let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
                if (Platform.OS === "android") {
                    PERM_STATUS = resolvePermision([
                        statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
                    ]);
                } else if (Platform.OS === "ios") {
                    PERM_STATUS = resolvePermision([
                        statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
                    ]);
                }
                if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
                    resolve(PERM_STATUS);
                    // permissionDeniedBlockedAlert();
                } else {
                    resolve(PERM_STATUS);
                }
            })
            .catch(() => {
                // resolve(false);
                resolve(PERMISSIONS_RESULTS.BLOCKED);
            });
    });
};

/**
 * Check permissions are allowed to the app camera and audio
 *@returns true if both permissions are allowed or not
 */
const checkMicrophonePermissions = () => {
    return new Promise((resolve) => {
        checkMultiple([
            PERMISSIONS.ANDROID.RECORD_AUDIO,
            PERMISSIONS.IOS.MICROPHONE,
        ])
            .then((statuses: any) => {
                let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
                if (Platform.OS === "android") {
                    PERM_STATUS = resolvePermision([
                        statuses[PERMISSIONS.ANDROID.RECORD_AUDIO],
                    ]);
                } else if (Platform.OS === "ios") {
                    PERM_STATUS = resolvePermision([
                        statuses[PERMISSIONS.IOS.MICROPHONE],
                    ]);
                }
                resolve(PERM_STATUS);
            })
            .catch(() => {
                resolve(PERMISSIONS_RESULTS.BLOCKED);
            });
    });
};

/**
 * Request permission to access camera and Audio
 */
const requestMicrophonePermissions = () => {
    return new Promise((resolve) => {
        requestMultiple([
            PERMISSIONS.ANDROID.RECORD_AUDIO,
            PERMISSIONS.IOS.MICROPHONE,
        ]).then((statuses: any) => {
            let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
            if (Platform.OS === "android") {
                PERM_STATUS = resolvePermision([
                    statuses[PERMISSIONS.ANDROID.RECORD_AUDIO],
                ]);
            } else if (Platform.OS === "ios") {
                PERM_STATUS = resolvePermision([statuses[PERMISSIONS.IOS.MICROPHONE]]);
            }
            resolve(PERM_STATUS);
        });
    });
};

/**
 * Check permission to access ReadWriteExternal
 */
const checkReadWriteExternalStoragePermissions = () => {
    return new Promise((resolve) => {
        var permReqArr: any = [
            PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
            PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            PERMISSIONS.IOS.MEDIA_LIBRARY,
            PERMISSIONS.IOS.PHOTO_LIBRARY,
        ];
        if (parseInt(Platform.Version + "", 10) < 33) {
            permReqArr = [
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                PERMISSIONS.IOS.MEDIA_LIBRARY,
                PERMISSIONS.IOS.PHOTO_LIBRARY,
            ];
        }

        checkMultiple(permReqArr)
            .then((statuses: any) => {
                // consoleLog('statuses==>', statuses);

                let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
                if (Platform.OS === "android") {
                    var permStatusAndroidArr = [
                        statuses[PERMISSIONS.ANDROID.READ_MEDIA_AUDIO],
                        statuses[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO],
                        statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
                    ];
                    if (parseInt(Platform.Version + "", 10) < 33) {
                        permStatusAndroidArr = [
                            statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
                            statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
                        ];
                    }

                    PERM_STATUS = resolvePermision(permStatusAndroidArr);
                } else if (Platform.OS === "ios") {
                    PERM_STATUS = resolvePermision([
                        statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
                        statuses[PERMISSIONS.IOS.PHOTO_LIBRARY],
                    ]);
                }
                resolve(PERM_STATUS);
            })
            .catch(() => {
                resolve(PERMISSIONS_RESULTS.BLOCKED);
            });
    });
};

/**
 * Request permission to access ReadWriteExternal
 */
const requestReadWriteExternalStoragePermissions = () => {
    return new Promise((resolve) => {
        var permReqArr: any = [
            PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
            PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            PERMISSIONS.IOS.MEDIA_LIBRARY,
            PERMISSIONS.IOS.PHOTO_LIBRARY,
        ];

        if (parseInt(Platform.Version + "", 10) < 33) {
            permReqArr = [
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                PERMISSIONS.IOS.MEDIA_LIBRARY,
                PERMISSIONS.IOS.PHOTO_LIBRARY,
            ];
        }

        requestMultiple(permReqArr)
            .then((statuses: any) => {
                let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
                if (Platform.OS === "android") {
                    var permStatusAndroidArr = [
                        statuses[PERMISSIONS.ANDROID.READ_MEDIA_AUDIO],
                        statuses[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO],
                        statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES],
                    ];
                    if (parseInt(Platform.Version + "", 10) < 33) {
                        permStatusAndroidArr = [
                            statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
                            statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
                        ];
                    }

                    PERM_STATUS = resolvePermision(permStatusAndroidArr);
                } else if (Platform.OS === "ios") {
                    PERM_STATUS = resolvePermision([
                        statuses[PERMISSIONS.IOS.MEDIA_LIBRARY],
                        statuses[PERMISSIONS.IOS.PHOTO_LIBRARY],
                    ]);
                }
                if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
                    resolve(PERM_STATUS);
                    // permissionDeniedBlockedAlert();
                } else {
                    resolve(PERM_STATUS);
                }
            })
            .catch(() => {
                // resolve(false);
                resolve(PERMISSIONS_RESULTS.BLOCKED);
            });
    });
};

const resolvePermision = (permissions: Array<any>) => {
    let PERM_STATUS = PERMISSIONS_RESULTS.GRANTED;

    if (Array.isArray(permissions) && permissions.length) {
        PERM_STATUS = PERMISSIONS_RESULTS.GRANTED;
        for (let index = 0; index < permissions.length; index++) {
            // consoleLog('permissions[index]', permissions[index]);
            if (permissions[index] === RESULTS.DENIED) {
                PERM_STATUS = PERMISSIONS_RESULTS.DENIED;
                break;
            } else if (permissions[index] === RESULTS.BLOCKED) {
                PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
                break;
            }
        }
    } else {
        PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
    }

    return PERM_STATUS;
};

export {
    PERMISSIONS_RESULTS,
    checkGalleryPermissions,
    requestGalleryPermissions,
    checkReadWriteExternalStoragePermissions,
    requestReadWriteExternalStoragePermissions,
    checkMicrophonePermissions,
    requestMicrophonePermissions,
};