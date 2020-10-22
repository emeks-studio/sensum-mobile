import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { View, Linking, StatusBar, TouchableOpacity } from "react-native";
import { ThemeSheet } from "../assets/styles/ThemeSheet";
import { withModel } from "../model-components";
import { withTheming } from "../util/theming";
import { SensationItem } from "./SensationItem";
import { TopBarTitle, showToast } from "./ui";
import User from "../model/User";
import CloseIcon from "../assets/svgs/close.svg";

const SensationsScreenComponent = ({ model: { Sensations }, navigation, theming }) => {
  const styles = stylesByTheme[theming.theme.id];

  useEffect(() => {
    console.debug("[SensationsScreen::refresh]");
    Sensations.reset();
    Sensations.getMoreSensations();
  }, []);

  const goToHome = () => {
    navigation.navigate("Home");
  };

  // TODO: Move to credits screen (We could use the title as a button for displaying the new)
  const goToLore = () => {
    const url = "https://emeks.gitlab.io/sensum/lore/";
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  const showNetwork = () => {
    User.tryGatherAcolytes().then(n => {
      if (n) showToast({ text: `${n} electrones en órbita` }, theming);
      else showToast({ text: `Sin conexión` }, theming);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar color={styles.container.backgroundColor}/>
      <View style={styles.header}>
        <TopBarTitle style={styles.headerTitle} onPress={showNetwork} />
        <TouchableOpacity onPress={goToHome}>
          <CloseIcon
            style={styles.closeButton}
            fill={styles.closeButton.color}
          />
        </TouchableOpacity>
      </View>
      <SensationItem />
    </View>
  );
};

const stylesByTheme = ThemeSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colorPalette.dark
  },
  header: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "flex-end",
    margin: 20,
    marginBottom: 15
  },
  closeButton: {
    color: theme.colorPalette.light,
    height: 32,
    width: 32
  }
}));

const SensationsScreen = withTheming(withModel(observer(SensationsScreenComponent)));

SensationsScreen.navigationOptions = {
  header: null
};

export { SensationsScreen };
