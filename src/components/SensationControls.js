import React from 'react';
import {observer} from 'mobx-react';
import {View, TouchableOpacity, Text} from 'react-native';
import {useToast} from './ui';
import {withModel} from '../model-components';
import {withTheming} from '../util/theming';
import {ThemeSheet} from '../assets/styles/ThemeSheet';
import ControlBack from '../assets/svgs/controlBack.svg';
import ControlForward from '../assets/svgs/controlForward.svg';
import ControlPlus from '../assets/svgs/controlPlus.svg';
import ControlMinus from '../assets/svgs/controlMinus.svg';

const SensationControlsComponent = ({model: {Sensations}, theming}) => {
  const showToast = useToast();
  const styles = stylesByTheme[theming.theme.id];

  const vote = function (item, vote) {
    Sensations.vote(item, vote)
      .then((success) => {
        let text;
        if (success) text = vote ? 'Ionizando [+++]' : 'Ionizando [---]';
        else text = '¡Sobrecargas en el núcleo!';
        showToast(text);
        // Sensations.next();
      })
      .catch((err) => {
        console.debug(`[SensationItem::vote] Error: ${err}`);
        showToast('El Oráculo está ocupado balanceando el núcleo');
      });
  };

  const minus = () => Sensations.current && vote(Sensations.current, false);
  const plus = () => Sensations.current && vote(Sensations.current, true);
  const prev = () => Sensations.back();
  const next = () => Sensations.next();
  return (
    <View style={styles.controlsBar}>
      <View style={styles.controlsSection}>
        <TouchableOpacity style={styles.controlsButton} onPress={minus}>
          <ControlMinus
            style={styles.controlsIcon(true)}
            fill={styles.controlsIcon(true).color}
          />
          <Text style={styles.controlsText(true)}>
            {Sensations?.current?.dislikes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlsButton} onPress={plus}>
          <ControlPlus
            style={styles.controlsIcon()}
            fill={styles.controlsIcon().color}
          />
          <Text style={styles.controlsText()}>
            {Sensations?.current?.likes}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.controlsSection}>
        <TouchableOpacity style={styles.controlsButton} onPress={prev}>
          <ControlBack
            style={styles.controlsIcon()}
            fill={styles.controlsIcon().color}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlsButton} onPress={next}>
          <ControlForward
            style={styles.controlsIcon()}
            fill={styles.controlsIcon().color}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const stylesByTheme = ThemeSheet.create((theme) => ({
  controlsBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexBasis: '45%',
  },
  controlsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: 64,
    height: 64,
  },
  controlsIcon: (alt = false) => ({
    color: alt ? theme.colorPalette.secondary : theme.colorPalette.light,
    height: 32,
    width: 32,
  }),
  controlsText: (alt = false) => ({
    color: alt ? theme.colorPalette.secondary : theme.colorPalette.light,
    fontSize: 18,
  }),
}));

const SensationControls = withTheming(
  withModel(observer(SensationControlsComponent)),
);

export {SensationControls};
