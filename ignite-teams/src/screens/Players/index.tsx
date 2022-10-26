import { useState } from 'react';
import { Container, Form, HeaderList, NumbersOfPlayers} from './styles';

import { FlatList } from "react-native";

import { ButtonIcon } from '@components/ButtonIcon';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { Filter} from '@components/Filter';
import {  PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';




export function Players() {
  const [players, setPlayers] = useState(['lika', 'Fernando', 'biro biro', 'gustavo', 'hernandes']);
  const [team, setTeam] = useState('Time A');
    
    return (
        <Container>
            <Header showBackButton />

            <Highlight
             title="Nome da turma"
             subtitle="adicione a galera e separe os times"
            />

            <Form>
                <Input
                 placeholder="Nome da pessoa"
                 autoCorrect={false}

                />
                
                <ButtonIcon 
                 icon='add' 
                 type='SECONDARY' 
                />
            </Form>

            <HeaderList>
                <FlatList 
                 data={['Time A', 'Time B']}
                 keyExtractor={ item => item }
                 renderItem={({ item }) => (
                    <Filter 
                     title={item}
                     isActive={team === item}
                     onPress={() => setTeam(item)}
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
             keyExtractor={ (item) => item }
             renderItem={({ item }) => (
                <PlayerCard 
                 name={item}
                 onRemove={() => { }}
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
            />
                    
        </Container>
    );
}