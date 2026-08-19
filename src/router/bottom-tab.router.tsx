import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../app/root-stack/home';

const Tab = createBottomTabNavigator();

function BottomTabRouter() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}
export default BottomTabRouter;
