import { useCallback, useEffect, useState, useRef } from 'react';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';

import { Container, Form, HeaderList, NumbersOfPlayers} from './styles';

import { Alert, FlatList, TextInput, TouchableOpacity } from "react-native";

import { ButtonIcon } from '@components/ButtonIcon';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { Filter} from '@components/Filter';
import {  PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';

import { AppError } from '@utils/AppError';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playerGetByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName} from '@storage/group/groupRemoveByName';

type RouteParams = {
    group: string;
}


export function Players() {
  const [newPlayerName, setNewPlayerName] = useState('')  
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [team, setTeam] = useState('Time A');

  const navigation =useNavigation()
    
  // pegando dados via parametro
  const route = useRoute()
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
        return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar')
    }

    const newPlayer = {
        name: newPlayerName,
        team,
    }

    try {
        await playerAddByGroup(newPlayer, group) 
        
        newPlayerNameInputRef.current?.blur();

        setNewPlayerName('')
     
    } catch (error) {
        if(error instanceof AppError) {
            Alert.alert('Nova pessoa', error.message);
        }else {
            console.log(error)
            Alert.alert('Nova pessoa', ' Não foi possivel adicionar')
        }
    }
  }

  async function fetchPlayersByTeam() {
    try {
        const playersByTeam = await playersGetByGroupAndTeam(group, team);
        setPlayers(playersByTeam);
    } catch (error) {
        Alert.alert('Pessoas', 'Não foi possivel carregar as pessoas do time selecionado')
    }
  }
 
  async function handlePlayerRemove(playerName: string) {
    try {
        await playerRemoveByGroup(playerName, group)
        fetchPlayersByTeam();

    } catch (error) {
        Alert.alert('Remover pessoa', 'Não foi possivel remover a pessoa selecionada.');
        
    }
  }

  async function groupRemove() {
    try {
        await groupRemoveByName(group);

        navigation.navigate('groups');
        
    } catch (error) {
        Alert.alert('Remover grupo', 'Não foi possivel remover o grupo.')
    }
  }

  async function handleRemoveGroup() {
   Alert.alert(
    'Remover',
    'Deseja remover o grupo?',
    [
        { text: 'Não', style: 'cancel'},
        { text: 'Sim', onPress: () => groupRemove() }
    ]
   )
  }

  useFocusEffect(useCallback(() => {
    fetchPlayersByTeam();
  }, [players]));

    return (
        <Container>
            <Header showBackButton />

            <Highlight
             title={group}
             subtitle="adicione a galera e separe os times"
            />

            <Form>
                <Input
                 inputRef={newPlayerNameInputRef}
                 placeholder="Nome da pessoa"
                 value={newPlayerName}
                 autoCorrect={false}
                 onChangeText={setNewPlayerName}
                 onSubmitEditing={handleAddPlayer}
                 returnKeyType='done'
                />
                
                <ButtonIcon 
                 icon='add' 
                 type='PRIMARY'
                 onPress={handleAddPlayer} 
                />
            </Form>

            <HeaderList >
                <FlatList 
                 data={['Time A','Time B']}
                 keyExtractor={ item => item }
                 renderItem={({ item }) => (
                    <Filter 
                     title={item}
                     onPress={() => setTeam(item)}
                     isActive={item === team}
                    />

                 )}
                 horizontal
                />
                    <NumbersOfPlayers>
                        {players.length}
                    </NumbersOfPlayers>

            </HeaderList>

            <FlatList 
             data={players}
             keyExtractor={ (item) => item.name }
             renderItem={({ item }) => (
                <PlayerCard 
                 name={item.name}
                 onRemove={() => handlePlayerRemove(item.name)}
                />
                
             )}
             ListEmptyComponent={() => (
                <ListEmpty
                 message="Não há pessoas nesse time" 
                />
             )}
             showsVerticalScrollIndicator={false}
             contentContainerStyle={[
                { paddingBottom: 100 }, players.length === 0 && { flex: 1 }
             ]}
            />

            <Button 
             title="Remover turma"
             type='SECONDARY'
             onPress={handleRemoveGroup}
            />
                    
        </Container>
    );
}