import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { getHeight } from "../../constants/globalConstants";
import { color } from "../../constants/globalConstants";

interface LoaderState {
  loading: boolean;
}

export default class Loader extends Component<any, LoaderState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    return this.state.loading ? (
      <View style={styles.vwMain}>
        <View style={styles.vwWhite}>
          <ActivityIndicator size="large" color={color.black} />
        </View>
      </View>
    ) : null;
  }

  toggleLoader(shouldShow: boolean) {
    this.setState({ loading: shouldShow });
  }
}

const styles = StyleSheet.create({
  // View Style
  vwMain: {
    backgroundColor: color.black60,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  vwWhite: {
    // backgroundColor: color.white,
    borderRadius: getHeight(25),
    height: getHeight(80),
    width: getHeight(80),
    alignItems: "center",
    justifyContent: "center",
  },
  imgLoader: {
    backgroundColor: color.white,
    borderRadius: getHeight(12),
    height: getHeight(140),
    width: getHeight(140),
  },
});
