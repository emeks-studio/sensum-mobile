import OneSignal from 'react-native-onesignal';
import User from '../model/User';
import {
  MSG_CHOOSE_THE_ONE,
  MSG_NEW_SENSATION
} from '../constants/messages';

// TODO: A refactor is needed; CarrierCrow is not purely `model` given is using UI stuff.
const CarrierCrow = Oracle => {  
  const handleNotification = (result) => {
    console.debug('[CarrierCrow::handleNotification]', result);
    const payload = result.notification ? result.notification.payload : result.payload;
    const additionalData = payload.additionalData;
    // By removing line below we are allowing the trick for accumulate totems
    // OneSignal.clearOneSignalNotifications();
    switch(additionalData.type){
      case MSG_NEW_SENSATION:
        console.log("We could redirect the user to sensations screen!")
        break;
      case MSG_CHOOSE_THE_ONE:
        const totem = additionalData.totem;
        Oracle.setTotem(totem);
        break;
      default:
        break;
    };
  };
  
  const suscribe = () => {
    console.debug('[CarrierCrow::suscribe]');

    // Onesignal's logcat/xcode error verbosity level
    // 0 = NONE, 1 = FATAL, 2 = ERROR, 3 = WARN, 4 = INFO, 5 = DEBUG, 6 = VERBOSE
    OneSignal.setLogLevel(0, 0);

    OneSignal.init("f7a74ce7-d611-4732-b235-53209b389d69");
    
    // Android: Set Display option of the notifications. displayOption is of type OSInFocusDisplayOption
    // 0 -> None, 1 -> InAppAlert, 2 -> Notification
    // By using option 2 we are forcing that the notification appears on the top bar.
    OneSignal.inFocusDisplaying(2);
    OneSignal.setLocationShared(false);
    
    OneSignal.addEventListener('ids', User.tryRegisterPushNotificationId);
    // When the user click over the notification
    OneSignal.addEventListener('opened', handleNotification);
    // When the app is open
    // OneSignal.addEventListener('received', handleReceived);
  };
  
  const unsuscribe = () => {
    console.debug('[CarrierCrow::unsuscribe]');
    OneSignal.removeEventListener('ids', User.tryRegisterPushNotificationId);
    OneSignal.removeEventListener('opened', handleNotification);
  };
  
  return {
    suscribe,
    unsuscribe
  };
}

const configCarrierCrow = ({Oracle}) => CarrierCrow(Oracle);

export {
  configCarrierCrow
}
