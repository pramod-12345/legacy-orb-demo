import { createStackNavigator } from '@react-navigation/stack';
import * as screens from '../screens/index';
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={screens.LoginScreen} />
    <Stack.Screen
      name="ForgotPassword"
      component={screens.ForgotPasswordScreen}
    />
  </Stack.Navigator>
);

export default AuthStack;
