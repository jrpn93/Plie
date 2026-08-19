import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home.screen';
import { ROUTES } from '../constants/routes';

const Tab = createBottomTabNavigator();

function BottomTabRouter() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
    </Tab.Navigator>
  );
}
export default BottomTabRouter;
