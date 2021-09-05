import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
};

interface HighlightProps {
  amount: string;
  lastTransaction: string;
};

interface HighligthData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true); 
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highligthData, setHighligthData] = useState<HighligthData>({} as HighligthData);

  const theme = useTheme();
  const { user, singOut } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {

    const collectionFiltterd = collection
    .filter(transaction => transaction.type === type);

    if (collectionFiltterd.length === 0 ) {
      return 0;
    } else {
      const lastTransaction = 
      new Date(
        Math.max
          .apply(
              Math, 
              collectionFiltterd
                .map(transaction => new Date(transaction.date).getTime()
            )
          )
      );
    
      return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`;
    }
  }

  async function loadTransactions() {
    const dataKey = `@gofinances-ignite:transactions_user:${user.id}`;
    const response  = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {
      const { amount, date, type } = item;

      if (type ===  'positive') {
        entriesTotal += Number(amount);
      } else {
        expensiveTotal += Number(amount);
      }

      const amountFormatted = Number(amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });


      const dataFormatted = Intl.DateTimeFormat('pt-Br', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(date));
      
      return {
        ...item,
        amount: amountFormatted,
        date: dataFormatted,
      };
    });

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');


    const totalInterval = lastTransactionExpensives === 0 
    ? 'Não há transações'
    : `01 a ${lastTransactionExpensives}`

    const total = entriesTotal - expensiveTotal;
    setHighligthData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0
        ? 'Não há transações'
        : `Ùltima entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensives === 0
        ? 'Não há transações'
        : `Ùltima saída dia ${lastTransactionExpensives}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator 
              color={theme.colors.primary}
              size="large"
            />
          </LoadContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo
                    source={{uri: user.photo}}
                  />            
                  <User>
                    <UserGreeting>Olá</UserGreeting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={singOut}>
                  <Icon name='power'/>
                </LogoutButton>
              </UserWrapper>
            </Header>
            
            <HighlightCards>
              <HighlightCard
                type="up"
                title="Entradas"
                amount={highligthData.entries.amount}
                lastTransaction={highligthData.entries.lastTransaction}
              />
              <HighlightCard
                type="down"
                title="Saídas"
                amount={highligthData.expensives.amount}
                lastTransaction={highligthData.expensives.lastTransaction}
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={highligthData.total.amount}
                lastTransaction={highligthData.total.lastTransaction}
              />
            </HighlightCards>

            <Transactions>
              <Title>Listagem</Title>
              <TransactionList 
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />
            </Transactions>
          </>
      }
    </Container>
  );
}