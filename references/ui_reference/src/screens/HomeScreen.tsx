/**
 * Home Screen
 * Main dashboard showing cards, expenses, and recent transactions
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing } from '../theme';
import { RootStackParamList } from '../types';
import {
  HomeHeader,
  CategoryNav,
  BankCard,
  AddCardButton,
  ExpenseProgressBar,
  TransactionSection,
} from '../components';
import {
  currentUser,
  bankCards,
  monthlyExpenses,
  recentTransactions,
} from '../data/mockData';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Group transactions by date
  const todayTransactions = recentTransactions.filter((t) => {
    const today = new Date();
    const transDate = new Date(t.date);
    return transDate.toDateString() === today.toDateString();
  });

  const yesterdayTransactions = recentTransactions.filter((t) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const transDate = new Date(t.date);
    return transDate.toDateString() === yesterday.toDateString();
  });

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HomeHeader
          user={currentUser}
          onProfilePress={() => {}}
          onQRPress={handleNotificationsPress}
        />

        {/* Category Navigation */}
        <CategoryNav onCategoryPress={(category) => console.log(category)} />

        {/* Bank Cards */}
        <View style={styles.cardsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsScrollContent}
          >
            {bankCards.map((card, index) => (
              <View key={card.id} style={[styles.cardWrapper, index > 0 && styles.cardMargin]}>
                <BankCard
                  card={card}
                  isActive={card.isActive}
                  onPress={() => {}}
                />
              </View>
            ))}
            <View style={styles.addCardWrapper}>
              <AddCardButton onPress={() => {}} />
            </View>
          </ScrollView>
        </View>

        {/* Expense Progress Bar */}
        <ExpenseProgressBar data={monthlyExpenses} />

        {/* Recent Transactions */}
        <TransactionSection
          title="Today"
          transactions={todayTransactions}
          onTransactionPress={(t) => console.log(t)}
        />

        <TransactionSection
          title="Yesterday"
          transactions={yesterdayTransactions}
          onTransactionPress={(t) => console.log(t)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  cardsContainer: {
    marginBottom: Spacing.xl,
  },
  cardsScrollContent: {
    paddingHorizontal: Spacing.base,
  },
  cardWrapper: {},
  cardMargin: {
    marginLeft: Spacing.md,
  },
  addCardWrapper: {
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
});
