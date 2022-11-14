import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION, PLAYER_COLLECTION} from '@storage/storage.config';
  
import { groupsGetAll } from './groupsGetAll';



export async function groupRemoveByName(groupDeleted: string) {
    try {
        const storedGrops = await groupsGetAll();
        const groups = storedGrops.filter(group => group !== groupDeleted);

        await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));
        await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupDeleted}`);

    } catch (error) {
        throw error;
    }
}